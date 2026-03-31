"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ChatWindow from "@/components/chat/ChatWindow";
import { MessageCircle, Plus, Sparkles, X, Send, MessageSquare, Clock, ChevronRight } from "lucide-react";
import { Conversation } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [newSubject, setNewSubject] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("conversations")
        .select("*")
        .eq("customer_id", user.id)
        .order("last_message_at", { ascending: false });

      if (data) {
        setConversations(data);
        if (data.length > 0) setSelectedConv(data[0].id);
      }
      setIsLoading(false);
    };
    load();
  }, []);

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

      await supabase.from("messages").insert({
        conversation_id: data.id,
        sender_id: userId,
        content: `New conversation: ${newSubject.trim()}`,
        message_type: "system",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 relative overflow-hidden transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 dark:from-violet-600/20 dark:to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 dark:from-cyan-600/15 dark:to-blue-600/15 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-gradient-to-br from-pink-400/10 to-rose-400/10 dark:from-pink-600/10 dark:to-rose-600/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 dark:from-violet-500 dark:to-indigo-500 opacity-30 dark:opacity-40"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 12}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}

        {/* Grid Pattern for Dark Mode */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-0 dark:opacity-[0.02]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Premium Header */}
        <div className="mb-8 animate-[fadeInDown_0.6s_ease-out]">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-lg opacity-40 dark:opacity-60 animate-pulse" />
              <div className="relative p-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl shadow-lg shadow-violet-500/25 dark:shadow-violet-500/40">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-violet-900 to-indigo-900 dark:from-white dark:via-violet-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Messages
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                Real-time conversations
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* Conversation List */}
          <div 
            className="animate-[fadeInLeft_0.6s_ease-out]"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            <div className="relative group">
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 dark:from-violet-600/30 dark:via-indigo-600/30 dark:to-purple-600/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-100/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-900/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">Conversations</h2>
                      <span className="px-2.5 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-medium rounded-full shadow-sm shadow-violet-500/30">
                        {conversations.length}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowNew(!showNew)}
                      className={`relative p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                        showNew 
                          ? "bg-red-50 dark:bg-red-950/50 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rotate-45" 
                          : "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30 dark:shadow-violet-500/50 hover:shadow-violet-500/50"
                      }`}
                    >
                      {showNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* New Conversation Form */}
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${showNew ? "max-h-24 mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="flex gap-2 p-1 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="What's on your mind?"
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 dark:focus:border-violet-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        onKeyDown={(e) => e.key === "Enter" && createConversation()}
                      />
                      <button 
                        onClick={createConversation}
                        disabled={!newSubject.trim()}
                        className="px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-violet-500/30 dark:hover:shadow-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Conversation List */}
                <div className="p-3 max-h-[calc(100vh-340px)] overflow-y-auto scrollbar-thin">
                  {isLoading ? (
                    // Skeleton Loading
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 animate-pulse">
                          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4 mb-3" />
                          <div className="h-3 bg-slate-200/70 dark:bg-slate-700/70 rounded w-full mb-2" />
                          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
                        </div>
                      ))}
                    </div>
                  ) : conversations.length === 0 ? (
                    // Empty State
                    <div className="text-center py-12 px-4">
                      <div className="relative mx-auto w-20 h-20 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-20 dark:opacity-30 animate-ping" />
                        <div className="absolute inset-2 bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-full" />
                        <MessageCircle className="absolute inset-0 m-auto w-8 h-8 text-violet-500 dark:text-violet-400" />
                      </div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-1">No conversations yet</h3>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Start a new conversation to get help</p>
                      <button
                        onClick={() => setShowNew(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm rounded-xl hover:shadow-lg hover:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105"
                      >
                        <Sparkles className="w-4 h-4" />
                        Start a conversation
                      </button>
                    </div>
                  ) : (
                    // Conversation Items
                    <div className="space-y-2">
                      {conversations.map((conv, index) => (
                        <button
                          key={conv.id}
                          onClick={() => setSelectedConv(conv.id)}
                          className={`group w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden animate-[fadeInUp_0.4s_ease-out] ${
                            selectedConv === conv.id
                              ? "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/25 dark:shadow-violet-500/40"
                              : "bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-slate-900/50"
                          }`}
                          style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "both" }}
                        >
                          {/* Active Indicator */}
                          {selectedConv === conv.id && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                          )}
                          
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm line-clamp-1 transition-colors ${
                                selectedConv === conv.id ? "text-white" : "text-slate-800 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-400"
                              }`}>
                                {conv.subject}
                              </p>
                              <p className={`text-xs mt-1.5 line-clamp-2 ${
                                selectedConv === conv.id ? "text-violet-100" : "text-slate-500 dark:text-slate-400"
                              }`}>
                                {conv.last_message || "No messages yet"}
                              </p>
                              <div className={`flex items-center gap-1.5 mt-2 text-xs ${
                                selectedConv === conv.id ? "text-violet-200" : "text-slate-400 dark:text-slate-500"
                              }`}>
                                <Clock className="w-3 h-3" />
                                {formatDateTime(conv.last_message_at)}
                              </div>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-all ${
                              selectedConv === conv.id 
                                ? "text-white translate-x-0 opacity-100" 
                                : "text-slate-300 dark:text-slate-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            }`} />
                          </div>

                          {/* Unread Indicator */}
                          {conv.status === 'active' && selectedConv !== conv.id && (
                            <span className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div 
            className="animate-[fadeInRight_0.6s_ease-out] lg:h-[calc(100vh-180px)]"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            {selectedConv ? (
              <div className="h-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-600/10 dark:from-violet-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                  <ChatWindow conversationId={selectedConv} currentUserId={userId} />
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex items-center justify-center relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-purple-600/10 dark:from-violet-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 rounded-3xl blur-xl" />
                <div className="relative w-full h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] flex items-center justify-center">
                  <div className="text-center animate-[fadeIn_0.5s_ease-out]">
                    {/* Animated Icon */}
                    <div className="relative mx-auto w-28 h-28 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-20 dark:opacity-30 animate-[ping_2s_ease-in-out_infinite]" />
                      <div className="absolute inset-4 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-full opacity-30 dark:opacity-40 animate-[ping_2s_ease-in-out_infinite_0.5s]" />
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50 rounded-full flex items-center justify-center border border-violet-200/50 dark:border-violet-700/50">
                        <MessageCircle className="w-12 h-12 text-violet-500 dark:text-violet-400 animate-[bounce_2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 mb-6 max-w-xs mx-auto">
                      Choose an existing conversation or start a new one to begin messaging
                    </p>
                    
                    <button
                      onClick={() => setShowNew(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-violet-500/30 dark:hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-5 h-5" />
                      Start New Conversation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
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
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        
        /* Custom Scrollbar - Light Mode */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        
        /* Custom Scrollbar - Dark Mode */
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #334155;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        
        /* Smooth color transitions for theme switch */
        * {
          transition-property: background-color, border-color, color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        
        /* Prevent transition on animations */
        [style*="animation"] {
          transition: none;
        }
      `}</style>
    </div>
  );
}