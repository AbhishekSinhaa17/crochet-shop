"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Message } from "@/types";
import { Send, ImagePlus, Loader2 } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  onSeen?: () => void;
}

export default function ChatWindow({ conversationId, currentUserId, onSeen }: ChatWindowProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const isInitialLoad = useRef(true);

  const fetchMessages = useCallback(async () => {
    try {
      setInitialLoading(true);
      // Try with profile join first
      const { data, error } = await supabase
        .from("messages")
        .select("*, profile:profiles(full_name, avatar_url)")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data) {
        setMessages(data);
        isInitialLoad.current = true;
        setShouldScrollToBottom(true);
      }
    } catch (err) {
      console.warn("Retrying fetch without profile join due to error:", err);
      // Fallback to simple select if join fails (common with missing FKs or RLS)
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (data) {
        setMessages(data);
        isInitialLoad.current = true;
        setShouldScrollToBottom(true);
      }
    } finally {
      setInitialLoading(false);
    }
  }, [conversationId]);

  const markAsRead = useCallback(async () => {
    try {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("conversation_id", conversationId)
        .neq("sender_id", currentUserId)
        .eq("is_read", false);
      if (onSeen) onSeen();
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [conversationId, currentUserId, onSeen]);

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
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      markAsRead();
    }
  }, [messages.length, markAsRead]);

  // Handle auto-scroll
  useEffect(() => {
    if (shouldScrollToBottom && scrollRef.current) {
      const scrollContainer = scrollRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    // We only want to auto-scroll if the user is already at the bottom
    if (isAtBottom) {
      setShouldScrollToBottom(true);
    }
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
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin"
      >
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3" />
            <p className="text-sm text-slate-400">Loading message history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : null}
        {!initialLoading && messages.map((msg) => {
          const isOwn = user?.id && String(msg.sender_id).toLowerCase() === String(user.id).toLowerCase();
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