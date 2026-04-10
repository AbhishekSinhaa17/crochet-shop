import { OrderRepository } from "@/repositories/order-repository";
import { ProductRepository } from "@/repositories/product-repository";
import { UserRepository } from "@/repositories/user-repository";
import { orderCreateSchema, customOrderSchema } from "@/validators/order";
import { Logger } from "@/lib/logger";

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
        p_payment_method: validated.payment_method || 'razorpay'
      });

      Logger.info("Order placed successfully", { userId, orderNumber, orderId: result.id });
      return result;
    } catch (error: any) {
      Logger.error("Failed to place order", error);
      throw error;
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
    return await this.repository.updateOrderStatus(id, status, note);
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
    return await this.repository.createCustomOrder({
      ...validated,
      user_id: userId
    });
  }

  async getMyCustomOrders(userId: string) {
    return await this.repository.getCustomOrdersByUser(userId);
  }

  async getAllCustomOrders(options?: any) {
    return await this.repository.getAllCustomOrders(options);
  }

  async updateCustomStatus(id: string, status: string, adminNotes?: string, quotedPrice?: number) {
    return await this.repository.updateCustomOrderStatus(id, status, adminNotes, quotedPrice);
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
