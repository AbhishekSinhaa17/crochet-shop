import { ChatRepository } from "@/repositories/chat-repository";

export class ChatService {
  private repository: ChatRepository;

  constructor(useAdmin = false) {
    this.repository = new ChatRepository(useAdmin);
  }

  async sendAdminReply(customerId: string, adminId: string, content: string, subject: string = "Custom Order Inquiry") {
    // 1. Find or create conversation
    let conversation = await this.repository.getConversation(customerId, subject);
    
    if (!conversation) throw new Error("Failed to create or find conversation");

    // 2. Create message
    return await this.repository.createMessage({
      conversation_id: conversation.id,
      sender_id: adminId,
      content,
      message_type: "text"
    });
  }
}
