import { OrderRepository } from "@/repositories/order-repository";
import { ProductRepository } from "@/repositories/product-repository";
import { UserRepository } from "@/repositories/user-repository";
import { orderCreateSchema, customOrderSchema } from "@/validators/order";
import { Logger } from "@/lib/logger";
import { pushToEmailQueue } from "@/lib/mail-queue";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { 
  OrderConfirmationData, 
  AdminNotificationData, 
  OrderDeliveredData,
  CustomOrderAdminAlertData,
  CustomOrderUpdateData
} from "@/types/email";

export class OrderService {

  private repository: OrderRepository;
  private productRepository: ProductRepository;
  private userRepository: UserRepository;

  constructor(useAdmin = false) {
    this.repository = new OrderRepository(useAdmin);
    this.productRepository = new ProductRepository(useAdmin);
    this.userRepository = new UserRepository(useAdmin);
  }

  async placeOrder(userId: string, data: any) {
    try {
      // 1. Validate
      const validated = orderCreateSchema.parse(data);
      
      // 2. Fetch products and calculate total
      let subtotal = 0;
      const itemsWithDetails = await Promise.all(validated.items.map(async (item: any) => {
        const product = await this.productRepository.getById(item.product_id);
        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${product?.name || item.product_id} is out of stock or insufficient.`);
        }
        subtotal += Number(product.price) * item.quantity;
        return {
          ...item,
          price: Number(product.price),
          name: product.name
        };
      }));

      const total = subtotal; // Add shipping fee etc here

      // 3. Generate order number
      const orderNumber = `CC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // 4. Create order ATOMICALLY via RPC
      const result = await this.repository.placeOrderAtomic({
        p_user_id: userId,
        p_order_number: orderNumber,
        p_total: total,
        p_subtotal: subtotal,
        p_shipping_address: validated.shipping_address,
        p_items: itemsWithDetails.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        p_payment_method: validated.payment_method || 'razorpay',
        p_status: validated.status || 'confirmed',
        p_payment_status: validated.payment_status || 'paid'
      });

      Logger.info("Order placed successfully", { userId, orderNumber, orderId: result.id });

      // Enrich the result with data needed for emails since RPC only returns id & order_number
      const enrichedResult = {
        ...result,
        total,
        subtotal,
        shipping_fee: total - subtotal,
        shipping_address: validated.shipping_address
      };

      // 📧 Async Email Trigger (Awaited for Serverless reliability)
      try {
        await this.triggerOrderEmails(userId, enrichedResult, itemsWithDetails);
      } catch (err) {
        Logger.error("Failed to trigger order emails", err);
      }

      return enrichedResult;
    } catch (error: any) {
      Logger.error("Failed to place order", error);
      throw error;
    }
  }

  /**
   * 📧 Helper to trigger emails after order placement
   */
  private async triggerOrderEmails(userId: string, order: any, items: any[]) {
    try {
      const profile = await this.userRepository.getProfile(userId);
      const authUserRes = await supabaseAdmin.auth.admin.getUserById(userId);
      const userEmail = authUserRes.data?.user?.email || profile?.email;

      if (!profile || !userEmail) {
        Logger.warn("Could not find profile or email for user, skipping order emails", { userId });
        return;
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const orderLink = `${siteUrl}/orders/${order.id}`;

      const adminEmail = process.env.ADMIN_EMAIL || 'hellostrokesofcraft@gmail.com';

      // 📧 Send both emails in parallel to ensure one doesn't block the other
      await Promise.allSettled([
        // 1. Send to Customer
        pushToEmailQueue({
          to: userEmail,
          subject: `Order Confirmed - #${order.order_number}`,
          type: 'ORDER_CONFIRMATION',
          orderId: order.id,
          data: {
            orderNumber: order.order_number,
            customerName: profile.full_name || 'Customer',
            items: items,
            subtotal: order.subtotal,
            shippingFee: order.shipping_fee || 0,
            total: order.total,
            shippingAddress: order.shipping_address || {},
            orderLink
          } as OrderConfirmationData
        }),
        
        // 2. Send to Admin
        pushToEmailQueue({
          to: adminEmail,
          subject: `New Order Received - #${order.order_number}`,
          type: 'ADMIN_NOTIFICATION',
          orderId: order.id,
          data: {
            orderNumber: order.order_number,
            customerName: profile.full_name || userEmail,
            customerEmail: userEmail,
            total: order.total,
            items: items.map(i => ({ name: i.name, quantity: i.quantity })),
            adminLink: `${siteUrl}/admin/orders?id=${order.id}`
          } as AdminNotificationData
        })
      ]);
    } catch (error) {
      Logger.error("Error in triggerOrderEmails", error);
    }
  }


  async getMyOrders(userId: string) {
    return await this.repository.getOrdersByUser(userId);
  }

  async getOrder(id: string) {
    return await this.repository.getOrderById(id);
  }

  async getAllOrders(options?: any) {
    return await this.repository.getAllOrders(options);
  }

  async updateStatus(id: string, status: string, note?: string) {
    const order = await this.repository.updateOrderStatus(id, status, note);
    
    // 📧 Trigger Delivery Email
    if (status === 'delivered') {
      await this.triggerDeliveryEmail(order).catch(err => Logger.error("Delivery email failed", err));
    }

    return order;
  }

  private async triggerDeliveryEmail(order: any) {
    try {
      const profile = await this.userRepository.getProfile(order.user_id);
      const authUserRes = await supabaseAdmin.auth.admin.getUserById(order.user_id);
      const userEmail = authUserRes.data?.user?.email || profile?.email;

      if (!profile || !userEmail) return;

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      // Smart dynamic review link generation
      let productReviewLink = `${siteUrl}/products`; 
      
      try {
        const { data: item } = await supabaseAdmin
          .from("order_items")
          .select("product_id")
          .eq("order_id", order.id)
          .limit(1)
          .single();
          
        if (item && item.product_id) {
           productReviewLink = `${siteUrl}/products/${item.product_id}#reviews`; 
        }
      } catch(e) {
        // Fallback gracefully without breaking the email trigger
        Logger.warn('Failed to fetch product_id for review link fallback applied.');
      }

      await pushToEmailQueue({
        to: userEmail,
        subject: `Your order has been delivered! 🎉`,
        type: 'ORDER_DELIVERED',
        orderId: order.id,
        data: {
          orderNumber: order.order_number,
          customerName: profile.full_name || 'Customer',
          orderId: order.id,
          orderLink: `${siteUrl}/orders/${order.id}`,
          reviewLink: productReviewLink
        } as OrderDeliveredData
      });
    } catch (error) {
      Logger.error("Error in triggerDeliveryEmail", error);
    }
  }

  async updateTracking(id: string, trackingNumber: string, courier: string = 'INDIA_POST', status?: string) {
    const data: any = { 
      tracking_number: trackingNumber,
      courier: courier,
      updated_at: new Date().toISOString()
    };
    
    if (status) {
      data.status = status;
    }

    return await this.repository.update(id, data);
  }

  // Custom Orders
  async submitCustomOrder(userId: string, data: any) {
    // 1. Validate
    const validated = customOrderSchema.parse(data);
    
    // 2. Clear out any admin-only fields if they exist in data (though Zod handles it)
    
    // 3. Create
    const result = await this.repository.createCustomOrder({
      ...validated,
      user_id: userId
    });

    // 📧 Async Emails for Custom Order (Customer & Admin)
    await this.triggerCustomOrderEmail(userId, result).catch(err => 
        Logger.error("Failed to trigger custom order emails", err)
    );

    return result;
  }

  private async triggerCustomOrderEmail(userId: string, order: any) {
    try {
        const profile = await this.userRepository.getProfile(userId);
        if (!profile) return;

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const adminEmail = process.env.ADMIN_EMAIL || 'hellostrokesofcraft@gmail.com';

        Logger.info("Triggering dual custom order emails", { orderId: order.id });

        // 📧 Parallel isolated triggers
        await Promise.allSettled([
            // 1. Customer Confirmation
            pushToEmailQueue({
                to: profile.email,
                subject: `We've received your custom request!`,
                type: 'CUSTOM_ORDER_RECEIVED',
                orderId: order.id,
                data: {
                    customerName: profile.full_name || 'Customer',
                    title: order.title || 'Custom Request',
                    orderLink: `${siteUrl}/orders?tab=custom`
                }
            }).then(() => Logger.info("Custom order customer email queued")),

            // 2. Admin Alert
            pushToEmailQueue({
                to: adminEmail,
                subject: `Action Required: New Custom Request Received`,
                type: 'CUSTOM_ORDER_ADMIN_ALERT',
                orderId: order.id,
                data: {
                    customerName: profile.full_name || 'Customer',
                    customerEmail: profile.email,
                    title: order.title,
                    description: order.description,
                    adminLink: `${siteUrl}/admin/custom-orders`
                } as CustomOrderAdminAlertData
            }).then(() => Logger.info("Custom order admin email queued"))
        ]);
    } catch (error) {
        Logger.error("Error in triggerCustomOrderEmail", error);
    }
}

  async getMyCustomOrders(userId: string) {
    return await this.repository.getCustomOrdersByUser(userId);
  }

  async getAllCustomOrders(options?: any) {
    return await this.repository.getAllCustomOrders(options);
  }

  async getCustomOrder(id: string) {
    return await this.repository.getCustomOrderById(id);
  }

  async updateCustomStatus(id: string, status: string, adminNotes?: string, quotedPrice?: number, additionalData?: any) {
    // 1. Check current status to prevent illegal transitions
    const currentOrder = await this.repository.getCustomOrderById(id);
    if (!currentOrder) throw new Error("Order not found");

    const postPaymentStatuses = ["paid", "in_progress", "shipped", "delivered"];
    const isAlreadyPaid = postPaymentStatuses.includes(currentOrder.status);
    const targetStatusIsPrePayment = ["pending", "quoted"].includes(status);

    if (isAlreadyPaid && targetStatusIsPrePayment) {
      throw new Error(`Cannot revert order to ${status} status after payment has been received.`);
    }

    const updated = await this.repository.updateCustomOrderStatus(id, status, adminNotes, quotedPrice, additionalData);

    // 📧 Trigger Status Update Email (Explicitly Awaited for reliability)
    try {
        await this.triggerCustomOrderStatusUpdateEmail(updated);
    } catch (err) {
        Logger.error("Failed to trigger custom status update email", err);
    }

    return updated;
}

private async triggerCustomOrderStatusUpdateEmail(order: any) {
    try {
        const profile = await this.userRepository.getProfile(order.user_id);
        if (!profile) return;

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        // Custom logic for status messages
        const isQuoted = order.status === 'quoted';
        const isDelivered = order.status === 'delivered';
        const isShipped = order.status === 'shipped';
        const displayStatus = (order.status || 'pending').toString().replace(/_/g, ' ');

        let subject = `Update on your request: ${order.title}`;
        if (isQuoted) subject = "Your Custom Quote is Ready! 🏷️";
        if (isShipped) subject = "Your Custom Order is on the way! 🚚";
        if (isDelivered) subject = "Your Custom Order has been delivered! 🎉";

        Logger.info(`Attempting to send custom status update email to ${profile.email} for order ${order.id}`);
        await pushToEmailQueue({
            to: profile.email,
            subject: subject,
            type: 'CUSTOM_ORDER_UPDATE',
            orderId: order.id,
            data: {
                customerName: profile.full_name || 'Customer',
                title: order.title || 'Custom Project',
                status: displayStatus,
                message: order.admin_notes || "",
                quotedPrice: order.quoted_price,
                orderLink: `${siteUrl}/orders?tab=custom`,
                showPayButton: isQuoted
            } as CustomOrderUpdateData
        });
    } catch (error) {
        Logger.error("Error in triggerCustomOrderStatusUpdateEmail", error);
    }
}

  async updateCustomOrder(id: string, data: any) {
    return await this.repository.updateCustomOrder(id, data);
  }

  async getAdminDashboardData() {
    try {
      const [orderStats, recentOrders, productCount, customerCount] = await Promise.all([
        this.repository.getDashboardStats(),
        this.repository.getRecentOrders(5),
        this.productRepository.getActiveCount(),
        this.userRepository.getCustomerCount()
      ]);

      return {
        stats: {
          totalRevenue: orderStats.totalRevenue,
          totalOrders: orderStats.totalOrders,
          activeInventory: productCount,
          totalCustomers: customerCount
        },
        recentOrders
      };
    } catch (error) {
      Logger.error("Failed to fetch dashboard data", error);
      throw error;
    }
  }
}
