"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/useAuthStore";
import { Profile } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera,
  Shield,
  Settings,
  Bell,
  CreditCard,
  Package,
  Heart,
  LogOut,
  ChevronRight,
  Check,
  Edit3,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  Calendar,
  ShoppingBag,
  Star,
  Loader2,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Home,
  Building,
  Navigation,
  Hash,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProfileStats {
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  reviewsGiven: number;
}

export default function ProfilePage() {
  const { user: authUser, profile: authProfile, loading: authLoading } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "address" | "security">("profile");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [stats, setStats] = useState<ProfileStats>({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    reviewsGiven: 0,
  });
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!authUser) {
      router.push("/auth/login?redirect=/profile");
      return;
    }

    const loadProfileData = async () => {
      setLoading(true);
      setEmail(authUser.email || "");
      
      if (authProfile) {
        setProfile(authProfile);
        if (authProfile.avatar_url) {
          setAvatarPreview(authProfile.avatar_url);
        }
      }

      // Load stats
      const [ordersRes, wishlistRes, reviewsRes] = await Promise.all([
        supabase.from("orders").select("total").eq("user_id", authUser.id),
        supabase.from("wishlist").select("id").eq("user_id", authUser.id),
        supabase.from("reviews").select("id").eq("user_id", authUser.id),
      ]);

      setStats({
        totalOrders: ordersRes.data?.length || 0,
        totalSpent: ordersRes.data?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
        wishlistItems: wishlistRes.data?.length || 0,
        reviewsGiven: reviewsRes.data?.length || 0,
      });

      setLoading(false);
      setTimeout(() => setIsLoaded(true), 100);
    };
    
    loadProfileData();
  }, [authUser, authProfile, authLoading, router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !profile) return;
    
    setUploadingAvatar(true);
    
    try {
      const ext = avatarFile.name.split(".").pop();
      const path = `avatars/${profile.id}/${Date.now()}.${ext}`;
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);
        
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", profile.id);
        
      if (updateError) throw updateError;
      
      setProfile({ ...profile, avatar_url: urlData.publicUrl });
      setAvatarFile(null);
      toast.success("Avatar updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
    }
    
    setUploadingAvatar(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error(error.message);
    } else {
      setShowSaveSuccess(true);
      toast.success("Profile updated successfully!");
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }
    
    setSaving(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    setChangingPassword(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully!");
      setShowPasswordChange(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    
    setChangingPassword(false);
  };

  const handleLogout = async () => {
    try {
      await useAuthStore.getState().signOut();
      router.push("/");
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return null;
  }

  const addr = (profile.address || {}) as Record<string, string>;
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-linear-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-linear-to-r from-amber-200/30 to-orange-200/30 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-linear-to-r from-blue-200/30 to-cyan-200/30 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav 
          className={`flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-purple-400 dark:bg-purple-500 rounded-full" />
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 dark:text-white font-medium">My Profile</span>
        </nav>

        {/* Header */}
        <div 
          className={`mb-8 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div 
            className={`lg:col-span-1 space-y-6 transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
              {/* Cover Gradient */}
              <div className="h-24 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 relative">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
              </div>
              
              {/* Avatar Section */}
              <div className="px-6 pb-6">
                <div className="relative -mt-12 mb-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-xl">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar"
                          width={88}
                          height={88}
                          className="w-full h-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-linear-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 flex items-center justify-center">
                          <User className="w-10 h-10 text-purple-500 dark:text-purple-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Camera Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg flex items-center justify-center transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Upload Button */}
                  {avatarFile && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={uploadAvatar}
                        disabled={uploadingAvatar}
                        className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(profile.avatar_url || null);
                        }}
                        className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profile.full_name || "User"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {email}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                      profile.role === "admin" 
                        ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400"
                        : "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"
                    )}>
                      {profile.role}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <Calendar className="w-3 h-3" />
                      Since {memberSince}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShoppingBag, label: "Orders", value: stats.totalOrders, color: "from-blue-500 to-cyan-500" },
                { icon: Heart, label: "Wishlist", value: stats.wishlistItems, color: "from-pink-500 to-rose-500" },
                { icon: Star, label: "Reviews", value: stats.reviewsGiven, color: "from-amber-500 to-orange-500" },
                { icon: Award, label: "Points", value: Math.floor(stats.totalSpent / 10), color: "from-purple-500 to-indigo-500" },
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-950/50 transition-all duration-300 group"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl bg-linear-to-br flex items-center justify-center mb-3 group-hover:scale-110 transition-transform",
                    stat.color
                  )}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-400" />
                  Quick Links
                </h3>
              </div>
              <div className="p-2">
                {[
                  { icon: Package, label: "My Orders", href: "/orders", color: "text-blue-500" },
                  { icon: Heart, label: "Wishlist", href: "/wishlist", color: "text-pink-500" },
                  { icon: CreditCard, label: "Payment Methods", href: "/payment", color: "text-emerald-500" },
                  { icon: Bell, label: "Notifications", href: "/notifications", color: "text-amber-500" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <link.icon className={cn("w-5 h-5", link.color)} />
                    <span className="flex-1 text-gray-700 dark:text-gray-300 font-medium">
                      {link.label}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
              
              <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl w-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group text-left"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span className="flex-1 text-red-600 dark:text-red-400 font-medium">
                    Log Out
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div 
            className={`lg:col-span-2 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "address", label: "Address", icon: MapPin },
                { id: "security", label: "Security", icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all",
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Personal Information
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your personal details
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <User className="w-4 h-4 text-purple-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.full_name || ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email (Read Only) */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        readOnly
                        className="w-full px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border-2 border-transparent rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Phone className="w-4 h-4 text-purple-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                      "w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300",
                      showSaveSuccess
                        ? "bg-emerald-500"
                        : "bg-linear-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5"
                    )}
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : showSaveSuccess ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : showSaveSuccess ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}

            {/* Address Tab */}
            {activeTab === "address" && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Shipping Address
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage your delivery address
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Address Line 1 */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Home className="w-4 h-4 text-emerald-500" />
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={addr.line1 || ""}
                      onChange={(e) => setProfile({ ...profile, address: { ...addr, line1: e.target.value } })}
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="House/Flat No., Building Name"
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Building className="w-4 h-4 text-emerald-500" />
                      Address Line 2 (Optional)
                    </label>
                    <input
                      type="text"
                      value={addr.line2 || ""}
                      onChange={(e) => setProfile({ ...profile, address: { ...addr, line2: e.target.value } })}
                      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Street, Area, Landmark"
                    />
                  </div>

                  {/* City & State */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Navigation className="w-4 h-4 text-emerald-500" />
                        City
                      </label>
                      <input
                        type="text"
                        value={addr.city || ""}
                        onChange={(e) => setProfile({ ...profile, address: { ...addr, city: e.target.value } })}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        State
                      </label>
                      <input
                        type="text"
                        value={addr.state || ""}
                        onChange={(e) => setProfile({ ...profile, address: { ...addr, state: e.target.value } })}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  {/* Pincode & Country */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Hash className="w-4 h-4 text-emerald-500" />
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={addr.pincode || ""}
                        onChange={(e) => setProfile({ ...profile, address: { ...addr, pincode: e.target.value } })}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={addr.country || "India"}
                        onChange={(e) => setProfile({ ...profile, address: { ...addr, country: e.target.value } })}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder="Enter country"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={cn(
                      "w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300",
                      showSaveSuccess
                        ? "bg-emerald-500"
                        : "bg-linear-to-r from-emerald-500 to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                    )}
                  >
                    {saving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : showSaveSuccess ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    {saving ? "Saving..." : showSaveSuccess ? "Saved!" : "Save Address"}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Password Section */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Password & Security
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Manage your password and security settings
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {!showPasswordChange ? (
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Password</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ••••••••••••
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordChange(true)}
                          className="px-4 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* New Password */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white pr-12"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white"
                            placeholder="Confirm new password"
                          />
                        </div>

                        {/* Password Requirements */}
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-100 dark:border-amber-900">
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">
                            Password Requirements
                          </p>
                          <ul className="space-y-1">
                            {[
                              { met: newPassword.length >= 6, text: "At least 6 characters" },
                              { met: newPassword === confirmPassword && newPassword.length > 0, text: "Passwords match" },
                            ].map((req, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                {req.met ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-amber-500" />
                                )}
                                <span className={req.met ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"}>
                                  {req.text}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={handlePasswordChange}
                            disabled={changingPassword || newPassword.length < 6 || newPassword !== confirmPassword}
                            className="flex-1 py-3 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {changingPassword ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Check className="w-5 h-5" />
                            )}
                            {changingPassword ? "Changing..." : "Change Password"}
                          </button>
                          <button
                            onClick={() => {
                              setShowPasswordChange(false);
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Account Actions
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Sign Out All Devices */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Sign Out All Devices</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Sign out from all devices except this one
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                        Sign Out
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium text-red-900 dark:text-red-300">Delete Account</p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            Permanently delete your account and all data
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
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
            transform: translate(30px, 30px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 15s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

// Loading Skeleton Component
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-5 w-64 bg-gray-100 dark:bg-gray-800 rounded mt-3 animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="h-24 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 animate-pulse" />
              <div className="px-6 pb-6">
                <div className="-mt-12 mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
                </div>
                <div className="text-center space-y-3">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded mx-auto animate-pulse" />
                  <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded mx-auto animate-pulse" />
                  <div className="h-6 w-20 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto animate-pulse" />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse mb-3" />
                  <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded mt-2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-56 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                    <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                <div className="h-12 w-36 bg-purple-200 dark:bg-purple-900 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Loading profile...</span>
        </div>
      </div>
    </div>
  );
}