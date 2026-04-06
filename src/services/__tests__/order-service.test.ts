import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrderService } from "../order-service";
import { OrderRepository } from "../../repositories/order-repository";
import { ProductRepository } from "../../repositories/product-repository";

// Mock repositories
vi.mock("../../repositories/order-repository");
vi.mock("../../repositories/product-repository");

describe("OrderService", () => {
  let orderService: OrderService;
  let mockOrderRepo: any;
  let mockProductRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();
    orderService = new OrderService(true);
    mockOrderRepo = (OrderRepository as any).prototype;
    mockProductRepo = (ProductRepository as any).prototype;
  });

  describe("placeOrder", () => {
    it("should successfully place an order when stock is available", async () => {
      // Setup mocks
      const mockProduct = { id: "prod-1", name: "Crochet Hat", price: 50, stock: 10 };
      mockProductRepo.getById.mockResolvedValue(mockProduct);
      mockOrderRepo.placeOrderAtomic.mockResolvedValue({ id: "order-1", order_number: "CC-123" });

      const orderData = {
        items: [{ product_id: "prod-1", quantity: 2 }],
        shipping_address: { street: "123 Main St", city: "NYC" },
        payment_method: "razorpay"
      };

      const result = await orderService.placeOrder("user-1", orderData);

      expect(result.id).toBe("order-1");
      expect(mockOrderRepo.placeOrderAtomic).toHaveBeenCalledWith(expect.objectContaining({
        p_total: 100,
        p_subtotal: 100
      }));
    });

    it("should throw an error if a product is out of stock", async () => {
      const mockProduct = { id: "prod-1", name: "Crochet Hat", price: 50, stock: 1 };
      mockProductRepo.getById.mockResolvedValue(mockProduct);

      const orderData = {
        items: [{ product_id: "prod-1", quantity: 2 }],
        shipping_address: { street: "123 Main St", city: "NYC" }
      };

      await expect(orderService.placeOrder("user-1", orderData))
        .rejects.toThrow("out of stock");
    });
  });
});
