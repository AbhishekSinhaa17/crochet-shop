"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import ChatWindow from "@/components/chat/ChatWindow";
import { Conversation } from "@/types";
import { formatDateTime } from "@/lib/utils";
import {
  MessageCircle,
  MessagesSquare,
  Search,
  Inbox,
  Loader2,
  Circle,
  Clock,
  User,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setUserId(user.id);

        const { data, error } = await supabase
          .from("conversations")
          .select("*, profile:profiles!customer_id(full_name)")
          .order("last_message_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setConversations(data);
          if (data.length > 0) setSelectedConv(data[0].id);
        }
      } catch (error: any) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = ((conv as any).profile?.full_name || "").toLowerCase();
    const subject = (conv.subject || "").toLowerCase();
    const lastMsg = (conv.last_message || "").toLowerCase();
    return name.includes(q) || subject.includes(q) || lastMsg.includes(q);
  });

  const selectedConversation = conversations.find((c) => c.id === selectedConv);
  const selectedName =
    (selectedConversation as any)?.profile?.full_name || "Customer";

  return (
    <div className="relative">
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-32 right-1/4 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
      </div>

      {/* Header */}
      <div
        className="flex items-center gap-3 mb-8"
        style={{ animation: "fadeInDown 0.5s ease-out" }}
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <MessagesSquare className="w-5 h-5 text-white" />
          </div>
          {conversations.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-linear-to-r from-rose-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">
                {conversations.length}
              </span>
            </span>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold bg-linear-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
            Messages
          </h1>
          <p className="text-sm text-gray-500">
            {conversations.length} conversation
            {conversations.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div
        className="grid md:grid-cols-3 gap-0 md:gap-0 h-[calc(100vh-220px)] min-h-[600px] bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden"
        style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
      >
        {/* Sidebar */}
        <div className="md:col-span-1 border-r border-gray-100 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Conversations
              </h2>
            </div>
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all duration-200"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {loading && (
              <div
                className="flex flex-col items-center justify-center py-16"
                style={{ animation: "fadeInUp 0.4s ease-out" }}
              >
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mb-3" />
                <p className="text-sm text-gray-400">Loading chats...</p>
              </div>
            )}

            {!loading && filteredConversations.length === 0 && (
              <div
                className="flex flex-col items-center justify-center py-16"
                style={{ animation: "fadeInUp 0.4s ease-out" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3 animate-bounce [animation-duration:3s]">
                  <Inbox className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  {searchQuery ? "No matches found" : "No conversations yet"}
                </p>
              </div>
            )}

            {filteredConversations.map((conv, index) => {
              const name = (conv as any).profile?.full_name || "Customer";
              const gradient =
                avatarGradients[name.charCodeAt(0) % avatarGradients.length];
              const isSelected = selectedConv === conv.id;
              const timeAgo = getTimeAgo(conv.last_message_at);

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`group/item w-full text-left p-3 rounded-xl transition-all duration-300 relative ${
                    isSelected
                      ? "bg-linear-to-r from-indigo-50 to-purple-50/60 shadow-sm border border-indigo-100/60"
                      : "hover:bg-gray-50/80 border border-transparent"
                  }`}
                  style={{
                    animation: `fadeInLeft 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {/* Active indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-indigo-500 to-purple-500 rounded-r-full" />
                  )}

                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className={`relative shrink-0 w-10 h-10 rounded-xl bg-linear-to-br ${gradient} flex items-center justify-center shadow-sm ${isSelected ? "shadow-md scale-105" : "group-hover/item:scale-105"} transition-all duration-300`}
                    >
                      <span className="text-white font-bold text-xs">
                        {getInitials(name)}
                      </span>
                      {/* Online dot - you can make this dynamic */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`font-semibold text-sm truncate transition-colors duration-200 ${
                            isSelected
                              ? "text-indigo-700"
                              : "text-gray-900 group-hover/item:text-indigo-700"
                          }`}
                        >
                          {name}
                        </p>
                        {timeAgo && (
                          <span
                            className={`shrink-0 text-[10px] font-medium ${
                              isSelected ? "text-indigo-400" : "text-gray-400"
                            }`}
                          >
                            {timeAgo}
                          </span>
                        )}
                      </div>
                      {conv.subject && (
                        <p
                          className={`text-xs font-medium truncate mt-0.5 ${
                            isSelected ? "text-indigo-600/70" : "text-gray-600"
                          }`}
                        >
                          {conv.subject}
                        </p>
                      )}
                      {conv.last_message && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {conv.last_message}
                        </p>
                      )}
                    </div>

                    {/* Chevron */}
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-1 transition-all duration-200 ${
                        isSelected
                          ? "text-indigo-400 translate-x-0 opacity-100"
                          : "text-gray-300 -translate-x-1 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          {!loading && conversations.length > 0 && (
            <div className="p-3 border-t border-gray-100/80">
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                {conversations.length} active
              </div>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 flex flex-col relative">
          {selectedConv ? (
            <>
              {/* Chat Header Bar */}
              <div
                className="px-6 py-4 border-b border-gray-100/80 bg-linear-to-r from-white to-gray-50/50 flex items-center gap-3"
                style={{ animation: "fadeInDown 0.3s ease-out" }}
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-linear-to-br ${
                    avatarGradients[
                      selectedName.charCodeAt(0) % avatarGradients.length
                    ]
                  } flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white font-bold text-xs">
                    {getInitials(selectedName)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {selectedName}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Window */}
              <div
                className="flex-1 overflow-hidden"
                style={{ animation: "fadeInUp 0.4s ease-out" }}
              >
                <ChatWindow
                  conversationId={selectedConv}
                  currentUserId={userId}
                />
              </div>
            </>
          ) : (
            /* Empty Chat State */
            <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50/50 to-indigo-50/30">
              <div
                className="text-center"
                style={{ animation: "fadeInUp 0.5s ease-out" }}
              >
                <div className="relative mx-auto w-20 h-20 mb-5">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-2xl bg-indigo-100/50 animate-ping [animation-duration:3s]" />
                  <div className="absolute inset-2 rounded-xl bg-indigo-100/60 animate-ping [animation-duration:3s] [animation-delay:0.5s]" />
                  <div className="relative w-20 h-20 rounded-2xl bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>
                <p className="font-display font-semibold text-gray-900 text-lg mb-1">
                  Select a conversation
                </p>
                <p className="text-sm text-gray-500 max-w-xs">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
