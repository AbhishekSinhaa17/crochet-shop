import { ProductRepository } from "@/repositories/product-repository";
import { productSchema, productUpdateSchema } from "@/validators/product";
import { unstable_cache } from "next/cache";
import { Logger } from "@/lib/logger";

export class ProductService {
  private repository: ProductRepository;

  constructor(useAdmin = false) {
    this.repository = new ProductRepository(useAdmin);
  }

  async getProducts(options?: any) {
    try {
      // We use a cache key based on options to ensure correct data is returned
      const cacheKey = `products-${JSON.stringify(options)}`;
      
      const fetchProducts = unstable_cache(
        async () => await this.repository.getAll(options),
        [cacheKey],
        { revalidate: 3600, tags: ['products'] }
      );

      return await fetchProducts();
    } catch (error: any) {
      Logger.error("Failed to fetch products", error);
      throw error;
    }
  }

  async getProduct(idOrSlug: string, isSlug = false) {
    try {
      if (isSlug) {
        return await this.repository.getBySlug(idOrSlug);
      }
      return await this.repository.getById(idOrSlug);
    } catch (error: any) {
      Logger.error("Failed to fetch product", error);
      throw error;
    }
  }

  async createProduct(data: any) {
    try {
      const validated = productSchema.parse(data);
      const result = await this.repository.create(validated);
      Logger.adminAction("system", "create_product", { productId: result.id });
      return result;
    } catch (error: any) {
      Logger.error("Failed to create product", error);
      throw error;
    }
  }

  async updateProduct(id: string, data: any) {
    try {
      const validated = productUpdateSchema.parse(data);
      const result = await this.repository.update(id, validated);
      Logger.adminAction("system", "update_product", { productId: id });
      return result;
    } catch (error: any) {
      Logger.error("Failed to update product", error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      const result = await this.repository.delete(id);
      Logger.adminAction("system", "delete_product", { productId: id });
      return result;
    } catch (error: any) {
      Logger.error("Failed to delete product", error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const fetchCategories = unstable_cache(
        async () => await this.repository.getAllCategories(),
        ['categories'],
        { revalidate: 86400, tags: ['categories'] }
      );

      return await fetchCategories();
    } catch (error: any) {
      Logger.error("Failed to fetch categories", error);
      throw error;
    }
  }
}

