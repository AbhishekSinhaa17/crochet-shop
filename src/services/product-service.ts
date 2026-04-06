import { ProductRepository } from "@/repositories/product-repository";
import { productSchema, productUpdateSchema, ProductInput, ProductUpdateInput } from "@/validators/product";

export class ProductService {
  private repository: ProductRepository;

  constructor(useAdmin = false) {
    this.repository = new ProductRepository(useAdmin);
  }

  async getProducts(options?: any) {
    return await this.repository.getAll(options);
  }

  async getProduct(idOrSlug: string, isSlug = false) {
    if (isSlug) {
      return await this.repository.getBySlug(idOrSlug);
    }
    return await this.repository.getById(idOrSlug);
  }

  async createProduct(data: any) {
    // 1. Validate
    const validated = productSchema.parse(data);
    
    // 2. Additional logic (e.g. unique slug check if needed, though DB will catch it)
    
    // 3. Save
    return await this.repository.create(validated);
  }

  async updateProduct(id: string, data: any) {
    // 1. Validate
    const validated = productUpdateSchema.parse(data);
    
    // 2. Save
    return await this.repository.update(id, validated);
  }

  async deleteProduct(id: string) {
    return await this.repository.delete(id);
  }

  async getCategories() {
    return await this.repository.getAllCategories();
  }
}
