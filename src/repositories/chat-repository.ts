import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export class ChatRepository {
  private client;

  constructor(useAdmin = false) {
    this.client = useAdmin ? supabaseAdmin : null;
  }

  private async getClient() {
    if (this.client) return this.client;
    return await createServerSupabaseClient();
  }

  async getConversation(customerId: string, subject: string) {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("conversations")
      .select("id")
      .eq("customer_id", customerId)
      .eq("subject", subject)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createConversation(data: { customer_id: string; subject: string; last_message: string; last_message_at: string }) {
    const supabase = await this.getClient();
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return conversation;
  }

  async updateConversation(id: string, data: { last_message: string; last_message_at: string }) {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from("conversations")
      .update(data)
      .eq("id", id);

    if (error) throw error;
    return true;
  }

  async createMessage(data: { conversation_id: string; sender_id: string; content: string; message_type: string }) {
    const supabase = await this.getClient();
    const { data: message, error } = await supabase
      .from("messages")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return message;
  }
  async deleteConversation(id: string) {
    const supabase = await this.getClient();
    // Delete messages first to handle foreign key constraints if not cascading
    await supabase.from("messages").delete().eq("conversation_id", id);
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) throw error;
    return true;
  }
}
