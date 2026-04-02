"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types";
import { Send, ImagePlus } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
}

export default function ChatWindow({ conversationId, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, profile:profiles!sender_id(full_name, avatar_url)")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    setLoading(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      await supabase
        .from("conversations")
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-[fadeInUp_0.3s_ease-out]`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  isOwn
                    ? "bg-linear-to-br from-violet-500 to-indigo-500 text-white rounded-br-sm shadow-violet-500/20"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700/50 rounded-bl-sm"
                }`}
              >
                {!isOwn && (
                  <p className="text-xs font-semibold mb-1 text-violet-600 dark:text-violet-400">
                    {(msg as any).profile?.full_name || "Admin"}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p
                  className={`text-xs mt-1.5 ${
                    isOwn ? "text-violet-100/80" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {formatDateTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-slate-100/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 shrink-0">
        <button
          type="button"
          className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 transition-colors"
        >
          <ImagePlus className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 text-sm text-slate-800 dark:text-slate-100 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || loading}
          className="py-2.5 px-5 bg-linear-to-r from-violet-500 to-indigo-500 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/30 dark:hover:shadow-violet-500/50 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center hover:scale-105 disabled:hover:scale-100"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}