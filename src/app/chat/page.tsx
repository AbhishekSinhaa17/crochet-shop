"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import ChatWindow from "@/components/chat/ChatWindow";
import {
  MessageCircle,
  Plus,
  Sparkles,
  X,
  Send,
  MessageSquare,
  Clock,
  ChevronRight,
  ArrowLeft,
  Search,
  Star,
  Pin,
  MoreVertical,
  CheckCheck,
  Smile,
  Paperclip,
  Mic,
  Image as ImageIcon,
  Phone,
  Video,
  Info,
  Settings,
  Bell,
  Archive,
  Trash2,
  Filter,
  SlidersHorizontal,
  Zap,
  Heart,
  ThumbsUp,
  Loader2,
  RefreshCcw,
  Crown,
  Shield,
} from "lucide-react";
import { Conversation } from "@/types";
import { formatDateTime } from "@/lib/utils";

const avatarGradients = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-indigo-500 via-blue-500 to-cyan-500",
];

function getTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [newSubject, setNewSubject] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) return;

    const loadConversations = async () => {
      setIsLoading(true);
      setUserId(user.id);

      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("customer_id", user.id)
        .order("last_message_at", { ascending: false });

      if (data) {
        setConversations(data);
        // Only auto-select the first conversation if none is selected
        if (data.length > 0 && !selectedConv) setSelectedConv(data[0].id);
      }
      setIsLoading(false);
    };

    loadConversations();

    // Subscribe to conversation updates
    const channel = supabase
      .channel("customer_conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `customer_id=eq.${user.id}`,
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, authLoading, selectedConv]);

  const createConversation = async () => {
    if (!newSubject.trim()) return;

    const { data, error } = await supabase
      .from("conversations")
      .insert({
        customer_id: userId,
        subject: newSubject.trim(),
      })
      .select()
      .single();

    if (data) {
      setConversations([data, ...conversations]);
      setSelectedConv(data.id);
      setShowNew(false);
      setNewSubject("");
      setShowMobileChat(true);

      await supabase.from("messages").insert({
        conversation_id: data.id,
        sender_id: userId,
        content: `New conversation: ${newSubject.trim()}`,
        message_type: "system",
      });
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      conv.subject?.toLowerCase().includes(q) ||
      conv.last_message?.toLowerCase().includes(q)
    );
  });

  const handleSelectConversation = (convId: string) => {
    setSelectedConv(convId);
    setShowMobileChat(true);
    // When selecting a conversation, mark its messages as seen in the UI list
    setConversations(prev => prev.map(c => 
      c.id === convId ? { ...c, unread_count: 0 } : c
    ));
  };

  const handleConversationSeen = useCallback((id: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id && (c as any).unread_count > 0 ? { ...c, unread_count: 0 } : c
    ));
  }, []);

  const selectedConversation = conversations.find((c) => c.id === selectedConv);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/20 relative overflow-hidden transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Light mode blobs */}
        <div className="dark:opacity-0 transition-opacity duration-700">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/50 via-purple-200/40 to-fuchsia-200/50 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-teal-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-pink-200/30 via-rose-200/25 to-orange-200/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Dark mode blobs */}
        <div className="opacity-0 dark:opacity-100 transition-opacity duration-700">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-900/30 via-purple-900/20 to-fuchsia-900/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-900/20 via-cyan-900/15 to-teal-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-pink-900/15 via-rose-900/10 to-orange-900/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 dark:from-violet-500 dark:to-purple-600 opacity-20 dark:opacity-30"
            style={{
              top: `${15 + i * 10}%`,
              left: `${5 + i * 12}%`,
              animation: `float ${4 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-6 lg:mb-8 animate-fade-in-down">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/25 dark:shadow-violet-500/15 transform group-hover:scale-105 transition-all duration-300">
                  <MessageSquare className="w-7 h-7 text-white drop-shadow-lg" />
                  {conversations.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-lg">
                      <span className="text-[10px] font-bold text-white">
                        {conversations.length}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-violet-800 to-purple-900 dark:from-white dark:via-violet-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">
                  Messages
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Real-time support chat
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all shadow-sm hover:shadow-md group">
                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
              <button
                onClick={() => setShowNew(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-semibold shadow-xl shadow-violet-500/25 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-violet-500/30 group"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Chat Container */}
        <div className="animate-fade-in-up animation-delay-200">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative grid lg:grid-cols-[400px_1fr] h-[calc(100vh-200px)] min-h-[600px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden">
              {/* Gradient top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 z-10" />

              {/* Sidebar / Conversation List */}
              <div
                className={`${
                  showMobileChat ? "hidden lg:flex" : "flex"
                } flex-col border-r border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-b from-white/50 to-gray-50/30 dark:from-gray-900/50 dark:to-gray-800/30`}
              >
                {/* Sidebar Header */}
                <div className="p-5 border-b border-gray-200/60 dark:border-gray-800/60">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
                      Conversations
                      <span className="px-2.5 py-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg shadow-violet-500/25">
                        {conversations.length}
                      </span>
                    </h2>
                    <button
                      onClick={() => setShowNew(!showNew)}
                      className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        showNew
                          ? "bg-red-100 dark:bg-red-900/40 text-red-500 rotate-45"
                          : "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25"
                      }`}
                    >
                      {showNew ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Search */}
                  <div className="relative group/search">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl blur-lg opacity-0 group-focus-within/search:opacity-100 transition-opacity" />
                    <div className="relative flex items-center">
                      <Search className="absolute left-4 w-4 h-4 text-gray-400 group-focus-within/search:text-violet-500 transition-colors" />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-100/80 dark:bg-gray-800/80 border border-transparent focus:border-violet-500/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* New Conversation Form */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${
                      showNew
                        ? "max-h-32 mt-4 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200/50 dark:border-violet-700/50">
                      <p className="text-xs font-semibold text-violet-700 dark:text-violet-400 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        Start a new conversation
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="What can we help you with?"
                          className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all placeholder:text-gray-400"
                          onKeyDown={(e) =>
                            e.key === "Enter" && createConversation()
                          }
                        />
                        <button
                          onClick={createConversation}
                          disabled={!newSubject.trim()}
                          className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
                  {isLoading ? (
                    // Loading State
                    <div className="space-y-3 p-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-gray-100/80 dark:bg-gray-800/50 animate-pulse"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-2" />
                              <div className="h-3 bg-gray-200/70 dark:bg-gray-700/70 rounded w-full mb-2" />
                              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center">
                          <MessageCircle className="w-10 h-10 text-violet-500 dark:text-violet-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {searchQuery
                          ? "No matches found"
                          : "No conversations yet"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6 max-w-xs">
                        {searchQuery
                          ? "Try a different search term"
                          : "Start a new conversation to get help from our support team"}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={() => setShowNew(true)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all hover:-translate-y-0.5"
                        >
                          <Sparkles className="w-4 h-4" />
                          Start a conversation
                        </button>
                      )}
                    </div>
                  ) : (
                    // Conversation List
                    <div className="space-y-1">
                      {filteredConversations.map((conv, index) => {
                        const isSelected = selectedConv === conv.id;
                        const gradient =
                          avatarGradients[index % avatarGradients.length];
                        const timeAgo = getTimeAgo(conv.last_message_at);

                        return (
                          <button
                            key={conv.id}
                            onClick={() => handleSelectConversation(conv.id)}
                            className={`group/conv w-full text-left p-4 rounded-2xl transition-all duration-300 relative ${
                              isSelected
                                ? "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 shadow-xl shadow-violet-500/25"
                                : "hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                            }`}
                            style={{
                              animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                            }}
                          >
                            {/* Active indicator */}
                            {isSelected && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg" />
                            )}

                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div className="relative shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                                    isSelected
                                      ? "bg-white/20 backdrop-blur-sm"
                                      : `bg-gradient-to-br ${gradient}`
                                  } ${isSelected ? "" : "group-hover/conv:scale-105"}`}
                                >
                                  <MessageCircle
                                    className={`w-5 h-5 ${isSelected ? "text-white" : "text-white"}`}
                                  />
                                </div>
                                {/* Status indicator */}
                                {!conv.is_closed && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
                                    <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                                  </span>
                                )}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p
                                    className={`font-semibold text-sm truncate transition-colors ${
                                      isSelected
                                        ? "text-white"
                                        : "text-gray-900 dark:text-white group-hover/conv:text-violet-700 dark:group-hover/conv:text-violet-400"
                                    }`}
                                  >
                                    {conv.subject}
                                  </p>
                                  {timeAgo && (
                                    <span
                                      className={`shrink-0 text-[11px] font-medium ${
                                        isSelected
                                          ? "text-white/70"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      {timeAgo}
                                    </span>
                                  )}
                                </div>

                                {conv.last_message && (
                                  <div className="flex items-center gap-2">
                                    <CheckCheck
                                      className={`w-3.5 h-3.5 shrink-0 ${
                                        isSelected
                                          ? "text-white/60"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <p
                                      className={`text-xs line-clamp-2 ${
                                        isSelected
                                          ? "text-white/80"
                                          : "text-gray-500 dark:text-gray-400"
                                      }`}
                                    >
                                      {conv.last_message}
                                    </p>
                                  </div>
                                )}

                                <div
                                  className={`flex items-center gap-2 mt-2 text-xs ${
                                    isSelected
                                      ? "text-white/60"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <Clock className="w-3 h-3" />
                                  {formatDateTime(conv.last_message_at)}
                                </div>
                              </div>

                              {/* Chevron */}
                              <ChevronRight
                                className={`w-4 h-4 shrink-0 mt-1 transition-all duration-300 ${
                                  isSelected
                                    ? "text-white translate-x-0 opacity-100"
                                    : "text-gray-300 -translate-x-2 opacity-0 group-hover/conv:translate-x-0 group-hover/conv:opacity-100"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sidebar Footer */}
                {!isLoading && conversations.length > 0 && (
                  <div className="p-4 border-t border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {conversations.filter((c) => !c.is_closed).length}{" "}
                          active
                        </span>
                      </div>
                      <button className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                        View archived
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Area */}
              <div
                className={`${
                  showMobileChat ? "flex" : "hidden lg:flex"
                } flex-col bg-gradient-to-br from-gray-50/50 via-white/30 to-violet-50/30 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-violet-900/20`}
              >
                {selectedConv && selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Mobile back button */}
                          <button
                            onClick={() => setShowMobileChat(false)}
                            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                          >
                            <ArrowLeft className="w-5 h-5" />
                          </button>

                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                          </div>

                          {/* Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                Support Team
                              </p>
                              <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 text-[10px] font-bold uppercase tracking-wider">
                                Official
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
                              {selectedConversation.subject}
                            </p>
                          </div>
                        </div>

                        {/* Header Actions */}
                        <div className="flex items-center gap-2">
                          <button className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group">
                            <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all group">
                            <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                          <button className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 overflow-hidden animate-fade-in">
                      {user && (
                        <ChatWindow
                          conversationId={selectedConv}
                          currentUserId={user.id}
                          onSeen={() => handleConversationSeen(selectedConv)}
                        />
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="px-6 py-3 border-t border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                        {[
                          { icon: Zap, label: "Quick reply" },
                          { icon: Heart, label: "Rate support" },
                          { icon: Archive, label: "Archive chat" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 hover:bg-violet-50 dark:hover:bg-violet-900/30 border border-transparent hover:border-violet-200/50 dark:hover:border-violet-700/50 text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-400 text-xs font-semibold whitespace-nowrap transition-all group"
                          >
                            <action.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Empty State */
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center animate-fade-in">
                      <div className="relative mx-auto w-28 h-28 mb-8">
                        {/* Pulsing rings */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-800/50 dark:to-purple-800/50 animate-ping opacity-20" />
                        <div className="absolute inset-4 rounded-2xl bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-800/50 dark:to-purple-800/50 animate-ping opacity-30 animation-delay-500" />
                        <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 dark:from-violet-900/40 dark:via-purple-900/40 dark:to-fuchsia-900/40 flex items-center justify-center shadow-2xl border border-violet-200/50 dark:border-violet-700/50">
                          <MessageCircle className="w-14 h-14 text-violet-500 dark:text-violet-400 animate-bounce-slow" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        Select a conversation
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                        Choose an existing conversation or start a new one to
                        begin messaging with our support team
                      </p>

                      <button
                        onClick={() => setShowNew(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                      >
                        <Sparkles className="w-5 h-5" />
                        Start New Conversation
                      </button>

                      {/* Features */}
                      <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
                        {[
                          { icon: Zap, label: "Fast Response" },
                          { icon: Shield, label: "Secure Chat" },
                          { icon: Crown, label: "Priority Support" },
                        ].map((feature) => (
                          <div
                            key={feature.label}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/50"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 flex items-center justify-center">
                              <feature.icon className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {feature.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(30px, 10px) scale(1.05);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 20s infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 2px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
