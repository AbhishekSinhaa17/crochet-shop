import { UserRepository } from "@/repositories/user-repository";
import { profileUpdateSchema, ProfileUpdateInput } from "@/validators/auth";

export class ProfileService {
  private repository: UserRepository;

  constructor(useAdmin = false) {
    this.repository = new UserRepository(useAdmin);
  }

  async getProfile(userId: string) {
    return await this.repository.getProfile(userId);
  }

  async updateProfile(userId: string, data: any) {
    // 1. Validate
    const validated = profileUpdateSchema.parse(data);
    
    // 2. Logic: Ensure roles can't be updated by customers themselves if they try to pass it in
    // (The validator allows it, but the service can strip it if not admin)
    // For now, we assume the repository handles the call. 
    // If this is called from a non-admin context, we should strip 'role'.
    
    return await this.repository.updateProfile(userId, validated);
  }

  async getProfiles(options?: any) {
    return await this.repository.getAllProfiles(options);
  }
}
