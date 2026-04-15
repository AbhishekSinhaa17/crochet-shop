"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import ChatWindow from "@/components/chat/ChatWindow";
import { Conversation } from "@/types";
import { formatDateTime } from "@/lib/utils";
import { deleteConversationAction } from "@/actions/admin_chat";
import toast from "react-hot-toast";
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
  Phone,
  Video,
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Star,
  Filter,
  SlidersHorizontal,
  Bell,
  BellOff,
  CheckCheck,
  Send,
  Smile,
  Paperclip,
  ImageIcon,
  ArrowLeft,
  Settings,
  Users,
  Hash,
  AtSign,
  Zap,
  Crown,
  Truck,
} from "lucide-react";

const avatarGradients = [
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-blue-500 via-cyan-500 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-pink-500 via-rose-500 to-red-500",
  "from-indigo-500 via-blue-500 to-cyan-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",
  "from-cyan-500 via-teal-500 to-emerald-500",
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
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

export default function AdminChatPage() {
  const { user, loading: authLoading } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConversation = async () => {
    if (!selectedConv || isDeleting) return;
    
    if (!window.confirm("Are you sure you want to permanently delete this conversation and all its messages? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await deleteConversationAction(selectedConv);
      if (res.success) {
        toast.success("Conversation deleted successfully");
        setConversations(prev => prev.filter(c => c.id !== selectedConv));
        setSelectedConv(null);
      } else {
        toast.error(res.error || "Failed to delete conversation");
      }
    } catch (err) {
      toast.error("An error occurred while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

    const loadConversations = async () => {
      try {
        setUserId(user.id);

        // 1. Fetch all conversation IDs used for custom orders
        const { data: customOrderData } = await supabase
          .from("custom_orders")
          .select("conversation_id")
          .not("conversation_id", "is", null);

        const customOrderConvIds = new Set(
          customOrderData?.map((co) => co.conversation_id).filter(Boolean) || []
        );

        // 2. Fetch all conversations
        const { data, error } = await supabase
          .from("conversations")
          .select("*, profile:profiles!customer_id(full_name), messages(is_read, sender_id)")
          .order("last_message_at", { ascending: false });

        if (error) throw error;
        if (data) {
          // 3. Filter out custom order conversations and calculate unread count
          const enhancedData = data
            .filter((conv: any) => {
              const subject = (conv.subject || "").toLowerCase();
              const isCustomOrder = 
                customOrderConvIds.has(conv.id) || 
                subject.includes("custom order");
              return !isCustomOrder;
            })
            .map((conv: any) => ({
              ...conv,
              unread_count: conv.messages?.filter((m: any) => !m.is_read && m.sender_id !== user.id).length || 0
            }));

          setConversations(enhancedData);
          if (enhancedData.length > 0 && !selectedConv) setSelectedConv(enhancedData[0].id);
        }
      } catch (error: any) {
        console.error("Error loading conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadConversations();
  }, [user, authLoading]);

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

  const handleSelectConversation = (convId: string) => {
    setSelectedConv(convId);
    setShowMobileChat(true);
  };

  // Calculate total conversations that HAVE unread messages
  const unreadCount = conversations.filter(c => (c as any).unread_count > 0).length;

  const handleConversationSeen = useCallback((id: string) => {
    setConversations(prev => prev.map(c => 
      c.id === id && (c as any).unread_count > 0 ? { ...c, unread_count: 0 } : c
    ));
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Light mode */}
        <div className="dark:opacity-0 transition-opacity duration-700">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-violet-200/40 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-200/30 via-cyan-200/20 to-teal-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-pink-200/25 via-rose-200/20 to-fuchsia-200/25 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Dark mode */}
        <div className="opacity-0 dark:opacity-100 transition-opacity duration-700">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-indigo-900/20 via-purple-900/15 to-violet-900/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-gradient-to-br from-blue-900/15 via-cyan-900/10 to-teal-900/15 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-pink-900/10 via-rose-900/10 to-fuchsia-900/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Header Section */}
      <div className="mb-6 animate-fade-in-down">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/25 dark:shadow-indigo-500/15 transform group-hover:scale-105 transition-all duration-300">
                <MessagesSquare className="w-7 h-7 text-white drop-shadow-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-lg animate-bounce-slow">
                    <span className="text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">
                Messages
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {conversations.length} conversation
                  {conversations.length !== 1 && "s"}
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {unreadCount} unread
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow-md group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/60 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow-md group">
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="animate-fade-in-up animation-delay-200">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-violet-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative h-[calc(100vh-220px)] min-h-[600px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl shadow-gray-200/50 dark:shadow-gray-900/50 overflow-hidden flex">
            {/* Gradient top line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 z-10" />

            {/* Sidebar */}
            <div
              className={`${
                showMobileChat ? "hidden md:flex" : "flex"
              } w-full md:w-96 flex-col border-r border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-b from-white/50 to-gray-50/30 dark:from-gray-900/50 dark:to-gray-800/30`}
            >
              {/* Sidebar Header */}
              <div className="p-5 border-b border-gray-200/60 dark:border-gray-800/60">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                    Conversations
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFilterOpen(!filterOpen)}
                      className={`p-2 rounded-lg transition-all ${
                        filterOpen
                          ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      }`}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative group/search">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-lg opacity-0 group-focus-within/search:opacity-100 transition-opacity" />
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-gray-400 dark:text-gray-500 group-focus-within/search:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-100/80 dark:bg-gray-800/80 border border-transparent focus:border-indigo-500/50 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Filter chips (shown when filter is open) */}
                {filterOpen && (
                  <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                    {["All", "Unread", "Starred", "Archived"].map((filter) => (
                      <button
                        key={filter}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          filter === "All"
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                      Loading conversations...
                    </p>
                  </div>
                )}

                {!loading && filteredConversations.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                        <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {searchQuery ? "No matches found" : "No conversations"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                      {searchQuery
                        ? "Try a different search term"
                        : "When customers message you, they'll appear here"}
                    </p>
                  </div>
                )}

                {filteredConversations.map((conv, index) => {
                  const name = (conv as any).profile?.full_name || "Customer";
                  const gradient =
                    avatarGradients[name.charCodeAt(0) % avatarGradients.length];
                  const isSelected = selectedConv === conv.id;
                  const timeAgo = getTimeAgo(conv.last_message_at);
                  const isUnread = (conv as any).unread_count > 0;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`group/conv w-full text-left p-4 rounded-2xl transition-all duration-300 relative ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-50 via-purple-50/80 to-violet-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-violet-900/30 shadow-lg shadow-indigo-500/10 border border-indigo-200/50 dark:border-indigo-700/50"
                          : "hover:bg-gray-100/80 dark:hover:bg-gray-800/80 border border-transparent"
                      }`}
                      style={{
                        animation: `fadeInLeft 0.4s ease-out ${index * 0.05}s both`,
                      }}
                    >
                      {/* Active indicator */}
                      {isSelected && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-violet-500 rounded-r-full shadow-lg shadow-indigo-500/50" />
                      )}

                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform transition-all duration-300 ${
                              isSelected
                                ? "scale-105 shadow-xl"
                                : "group-hover/conv:scale-105"
                            }`}
                          >
                            <span className="text-white font-bold text-sm drop-shadow">
                              {getInitials(name)}
                            </span>
                          </div>
                          {/* Online indicator */}
                          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
                            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <p
                                className={`font-semibold text-sm truncate transition-colors ${
                                  isSelected
                                    ? "text-indigo-700 dark:text-indigo-300"
                                    : "text-gray-900 dark:text-white group-hover/conv:text-indigo-700 dark:group-hover/conv:text-indigo-400"
                                }`}
                              >
                                {name}
                              </p>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/50" />
                              )}
                            </div>
                            {timeAgo && (
                              <span
                                className={`shrink-0 text-[11px] font-medium ${
                                  isSelected
                                    ? "text-indigo-500 dark:text-indigo-400"
                                    : "text-gray-400 dark:text-gray-500"
                                }`}
                              >
                                {timeAgo}
                              </span>
                            )}
                          </div>

                          {conv.subject && (
                            <p
                              className={`text-xs font-medium truncate ${
                                isSelected
                                  ? "text-indigo-600/80 dark:text-indigo-400/80"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {conv.subject}
                            </p>
                          )}

                          {conv.last_message && (
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCheck
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSelected
                                    ? "text-indigo-400"
                                    : "text-gray-400"
                                }`}
                              />
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {conv.last_message}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Chevron */}
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 mt-1 transition-all duration-300 ${
                            isSelected
                              ? "text-indigo-500 dark:text-indigo-400 translate-x-0 opacity-100"
                              : "text-gray-300 dark:text-gray-600 -translate-x-2 opacity-0 group-hover/conv:translate-x-0 group-hover/conv:opacity-100"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              {!loading && conversations.length > 0 && (
                <div className="p-4 border-t border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-r from-gray-50/80 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {conversations.length} active
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Area */}
            <div
              className={`${
                showMobileChat ? "flex" : "hidden md:flex"
              } flex-1 flex-col bg-gradient-to-br from-gray-50/50 via-white/30 to-indigo-50/30 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-indigo-900/20`}
            >
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Mobile back button */}
                        <button
                          onClick={() => setShowMobileChat(false)}
                          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Avatar */}
                        <div className="relative">
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                              avatarGradients[
                                selectedName.charCodeAt(0) %
                                  avatarGradients.length
                              ]
                            } flex items-center justify-center shadow-lg`}
                          >
                            <span className="text-white font-bold text-sm">
                              {getInitials(selectedName)}
                            </span>
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                        </div>

                        {/* Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {selectedName}
                            </p>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                              Customer
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Online now
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleDeleteConversation}
                          disabled={isDeleting}
                          className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 transition-all group"
                          title="Delete Conversation"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                        <button className="p-2.5 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Chat Window */}
                  <div className="flex-1 overflow-hidden animate-fade-in">
                    <ChatWindow
                      conversationId={selectedConv}
                      currentUserId={userId}
                      onSeen={() => handleConversationSeen(selectedConv)}
                    />
                  </div>


                </>
              ) : (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center animate-fade-in">
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      {/* Pulsing rings */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800/50 dark:to-purple-800/50 animate-ping opacity-20" />
                      <div className="absolute inset-3 rounded-xl bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800/50 dark:to-purple-800/50 animate-ping opacity-30 animation-delay-500" />
                      <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-100 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-violet-900/40 flex items-center justify-center shadow-xl">
                        <MessageCircle className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                      </div>
                    </div>
                    <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                      Choose a conversation from the sidebar to start messaging
                      with your customers
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex -space-x-3">
                        {conversations.slice(0, 4).map((conv, i) => {
                          const name =
                            (conv as any).profile?.full_name || "Customer";
                          const gradient =
                            avatarGradients[
                              name.charCodeAt(0) % avatarGradients.length
                            ];
                          return (
                            <div
                              key={conv.id}
                              className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md`}
                              style={{ zIndex: 4 - i }}
                            >
                              <span className="text-white text-[10px] font-bold">
                                {getInitials(name)}
                              </span>
                            </div>
                          );
                        })}
                        {conversations.length > 4 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md">
                            <span className="text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                              +{conversations.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        waiting for you
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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