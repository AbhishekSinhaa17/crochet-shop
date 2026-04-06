import { OrderRepository } from "@/repositories/order-repository";
import { orderCreateSchema, customOrderSchema, OrderCreateInput, CustomOrderInput } from "@/validators/order";
import { ProductRepository } from "@/repositories/product-repository";

export class OrderService {
  private repository: OrderRepository;
  private productRepository: ProductRepository;

  constructor(useAdmin = false) {
    this.repository = new OrderRepository(useAdmin);
    this.productRepository = new ProductRepository(useAdmin);
  }

  async placeOrder(userId: string, data: any) {
    // 1. Validate
    const validated = orderCreateSchema.parse(data);
    
    // 2. Fetch products and calculate total
    let subtotal = 0;
    const itemsWithDetails = await Promise.all(validated.items.map(async (item) => {
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

    // 4. Create order
    const order = await this.repository.createOrder({
      ...validated,
      user_id: userId,
      order_number: orderNumber,
      total,
      subtotal,
      items: itemsWithDetails as any
    });

    // 5. Update stock (decrement)
    await Promise.all(itemsWithDetails.map(async (item) => {
      const product = await this.productRepository.getById(item.product_id);
      await this.productRepository.update(item.product_id, {
        stock: product.stock - item.quantity
      });
    }));

    return order;
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
}
