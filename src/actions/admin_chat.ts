"use server";

import { ChatRepository } from "@/repositories/chat-repository";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Logger } from "@/lib/logger";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    Logger.authFailure("Forbidden admin chat access attempt", { userId: user.id });
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}

export async function deleteConversationAction(id: string) {
  try {
    const admin = await verifyAdmin();
    const chatRepository = new ChatRepository(true);
    await chatRepository.deleteConversation(id);
    Logger.adminAction(admin.id, "delete_conversation", { conversationId: id });
    revalidatePath("/admin/chat");
    return { success: true };
  } catch (err: any) {
    Logger.error("deleteConversationAction Error", err, { module: "admin_chat", id });
    return { success: false, error: err.message };
  }
}
