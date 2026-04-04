"use client";

import { useState, useEffect, useRef } from "react";
import { drand } from "@/lib/drand";
import { createClient } from "@/lib/supabase/client";
import { submitCustomOrderAction } from "@/actions/customOrder";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Upload,
  Send,
  Sparkles,
  Palette,
  Ruler,
  Calendar,
  IndianRupee,
  FileText,
  X,
  Check,
  ChevronRight,
  ImagePlus,
  Wand2,
  Heart,
  Clock,
  Shield,
  MessageSquare,
  ArrowRight,
  Loader2,
  Info,
  Star,
  Zap,
  Gift,
  Moon,
  Sun,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface FormStep {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const formSteps: FormStep[] = [
  { id: 1, title: "Basic Info", description: "Title & description", icon: FileText },
  { id: 2, title: "Preferences", description: "Colors & size", icon: Palette },
  { id: 3, title: "Budget", description: "Budget & timeline", icon: IndianRupee },
  { id: 4, title: "References", description: "Upload images (Optional)", icon: ImagePlus },
];

export default function CustomOrderPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [sizeDetails, setSizeDetails] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Generate image previews
  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = [...images, ...newFiles].slice(0, 5);
      setImages(totalFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith("image/")
      );
      const totalFiles = [...images, ...newFiles].slice(0, 5);
      setImages(totalFiles);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(10); // Show early progress

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (colors) formData.append("preferredColors", colors);
      if (sizeDetails) formData.append("sizeDetails", sizeDetails);
      if (budgetMin) formData.append("budgetMin", budgetMin);
      if (budgetMax) formData.append("budgetMax", budgetMax);
      if (deadline) formData.append("deadline", deadline);
      
      images.forEach((file) => {
        formData.append("images", file);
      });
      
      setUploadProgress(30);
      
      const result = await submitCustomOrderAction(formData);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setUploadProgress(100);
      setIsSubmitted(true);
      toast.success("Custom order request submitted!");
      
      setTimeout(() => {
        router.push("/orders");
      }, 3000);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Calculate form completion percentage
  const completionPercentage = () => {
    let completed = 0;
    const total = 4;
    
    if (title && description) completed++;
    if (colors || sizeDetails) completed++;
    if (budgetMin || budgetMax || deadline) completed++;
    if (images.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (isSubmitted) {
    return <SuccessScreen />;
  }

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
          <span className="text-gray-900 dark:text-white font-medium">Custom Order</span>
        </nav>

        {/* Header */}
        <div 
          className={`text-center mb-12 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Animated Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
            <div className="relative w-20 h-20 bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 dark:shadow-purple-500/20 animate-float">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
            
            {/* Floating Sparkles */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg dark:shadow-gray-900/50 flex items-center justify-center animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="absolute -bottom-1 -left-2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg dark:shadow-gray-900/50 flex items-center justify-center animate-bounce animation-delay-500">
              <Heart className="w-3 h-3 text-pink-500" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="bg-linear-to-r from-purple-600 via-pink-600 to-orange-500 dark:from-purple-400 dark:via-pink-400 dark:to-orange-400 bg-clip-text text-transparent">
              Custom Crochet Order
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg">
            Have something unique in mind? Describe your dream crochet piece and 
            we'll bring it to life with love and care! ✨
          </p>
        </div>

        {/* Progress Steps */}
        <div 
          className={`mb-10 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="hidden md:flex items-center justify-between max-w-2xl mx-auto">
            {formSteps.map((step, idx) => {
              const isCompleted = idx < currentStep - 1 || 
                (idx === 0 && title && description) ||
                (idx === 1 && (colors || sizeDetails)) ||
                (idx === 2 && (budgetMin || budgetMax || deadline)) ||
                (idx === 3 && images.length > 0);
              const isActive = idx === currentStep - 1;
              const Icon = step.icon;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex flex-col items-center transition-all duration-300",
                      isActive && "scale-105"
                    )}
                  >
                    <div 
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-500",
                        isCompleted 
                          ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20"
                          : isActive
                          ? "bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 animate-pulse"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-500 dark:text-gray-400"
                    )}>
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{step.description}</span>
                  </button>
                  
                  {idx < formSteps.length - 1 && (
                    <div className="w-16 h-1 mx-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500",
                          isCompleted ? "w-full" : "w-0"
                        )}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStep} of {formSteps.length}
              </span>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {completionPercentage()}% complete
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${completionPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div 
            className={`lg:col-span-2 transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tell us about your dream creation</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Title */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span>Title</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                        placeholder="e.g., Custom Amigurumi Cat, Baby Blanket, Cozy Cardigan"
                        required
                        onFocus={() => setCurrentStep(1)}
                      />
                      {title && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Check className="w-5 h-5 text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Give your creation a memorable name
                    </p>
                  </div>

                  {/* Description */}
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span>Description</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white resize-none"
                        rows={5}
                        placeholder="Describe your dream crochet piece in detail. What style are you looking for? Any specific patterns or textures? The more details you provide, the better we can bring your vision to life!"
                        required
                        onFocus={() => setCurrentStep(1)}
                      />
                      <div className="absolute right-3 bottom-3 text-xs text-gray-400 dark:text-gray-500">
                        {description.length}/500
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Design Preferences</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help us match your style</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Colors */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Palette className="w-4 h-4 text-amber-500" />
                        Preferred Colors
                      </label>
                      <input
                        type="text"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                        placeholder="e.g., Pastel pink, cream, sage green"
                        onFocus={() => setCurrentStep(2)}
                      />
                      
                      {/* Color Suggestions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Pink", "Blue", "Green", "Purple", "Natural"].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setColors(colors ? `${colors}, ${color}` : color)}
                            className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Ruler className="w-4 h-4 text-amber-500" />
                        Size Details
                      </label>
                      <input
                        type="text"
                        value={sizeDetails}
                        onChange={(e) => setSizeDetails(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                        placeholder="e.g., 30cm tall, fits 6-month baby"
                        onFocus={() => setCurrentStep(2)}
                      />
                      
                      {/* Size Suggestions */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {["Small (15cm)", "Medium (30cm)", "Large (50cm)"].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSizeDetails(size)}
                            className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/50 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget & Timeline Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <IndianRupee className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Budget & Timeline</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Set your expectations</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid sm:grid-cols-3 gap-5">
                    {/* Min Budget */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Min Budget (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          className="w-full pl-8 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                          placeholder="500"
                          onFocus={() => setCurrentStep(3)}
                        />
                      </div>
                    </div>

                    {/* Max Budget */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Budget (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-medium">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          className="w-full pl-8 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                          placeholder="2000"
                          onFocus={() => setCurrentStep(3)}
                        />
                      </div>
                    </div>

                    {/* Deadline */}
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        Deadline
                      </label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-900 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-none transition-all duration-300 text-gray-900 dark:text-white scheme-light dark:scheme-dark"
                        min={new Date().toISOString().split("T")[0]}
                        onFocus={() => setCurrentStep(3)}
                      />
                    </div>
                  </div>

                  {/* Budget Guide */}
                  {(budgetMin || budgetMax) && (
                    <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-100 dark:border-emerald-900">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                        <div className="text-sm text-emerald-700 dark:text-emerald-300">
                          <p className="font-medium">Budget Range Selected</p>
                          <p className="text-emerald-600 dark:text-emerald-400 mt-1">
                            ₹{budgetMin || "0"} - ₹{budgetMax || "∞"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reference Images Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <ImagePlus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reference Images (Optional)</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help us visualize your idea (Max 5)</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Upload Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onFocus={() => setCurrentStep(4)}
                    className={cn(
                      "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300",
                      dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-[1.02]"
                        : "border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    
                    <div className="relative inline-block mb-4">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300",
                        dragActive
                          ? "bg-blue-500 text-white"
                          : "bg-blue-100 dark:bg-blue-900/50 text-blue-500 dark:text-blue-400"
                      )}>
                        <Upload className="w-8 h-8" />
                      </div>
                      {dragActive && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                      {dragActive ? "Drop your images here!" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      PNG, JPG up to 5MB each • {5 - images.length} slots remaining
                    </p>
                  </div>

                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Uploaded Images ({images.length}/5)
                        </p>
                        <button
                          type="button"
                          onClick={() => setImages([])}
                          className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
                        >
                          Remove all
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {imagePreviews.map((preview, i) => (
                          <div 
                            key={i} 
                            className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-sm hover:shadow-lg dark:shadow-gray-950/50 transition-all duration-300"
                          >
                            <Image
                              src={preview}
                              alt={`Reference ${i + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute top-2 right-2 w-7 h-7 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white text-gray-700 dark:text-gray-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              {images[i]?.name.slice(0, 15)}...
                            </div>
                          </div>
                        ))}
                        
                        {/* Add More Button */}
                        {images.length < 5 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors"
                          >
                            <ImagePlus className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs text-gray-400 dark:text-gray-500">Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !title || !description}
                  className={cn(
                    "w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center justify-center gap-3",
                    loading
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      : "bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-xl shadow-purple-500/30 dark:shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40 dark:hover:shadow-purple-500/30 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Submitting... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6" />
                      Submit Custom Order Request
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Upload Progress */}
                {loading && (
                  <div className="mt-4">
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                      Creating your order...
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div 
            className={`space-y-6 transition-all duration-700 delay-400 ${
              isLoaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Completion Card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Form Completion
              </h3>
              
              <div className="relative mb-4">
                <svg className="w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-100 dark:text-gray-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${completionPercentage() * 2.51} 251`}
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-500"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {completionPercentage()}%
                    </span>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Complete</span>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {[
                  { label: "Title & Description", done: title && description },
                  { label: "Design Preferences", done: colors || sizeDetails },
                  { label: "Budget & Timeline", done: budgetMin || budgetMax || deadline },
                  { label: "Reference Images", done: images.length > 0 },
                ].map((item, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg transition-colors",
                      item.done 
                        ? "bg-emerald-50 dark:bg-emerald-950/50" 
                        : "bg-gray-50 dark:bg-gray-800/50"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      item.done 
                        ? "bg-emerald-500 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                    )}>
                      {item.done ? <Check className="w-4 h-4" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span className={cn(
                      "text-sm font-medium",
                      item.done 
                        ? "text-emerald-700 dark:text-emerald-400" 
                        : "text-gray-500 dark:text-gray-400"
                    )}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Custom Order */}
            <div className="bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-6 text-white">
              <Gift className="w-10 h-10 mb-4 text-white/80" />
              <h3 className="font-bold text-lg mb-2">Why Custom Order?</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>100% unique, made just for you</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Choose your colors & size</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Direct communication with artisan</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Quality craftsmanship guaranteed</span>
                </li>
              </ul>
            </div>

            {/* Process Timeline */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-100/50 dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                How it Works
              </h3>
              
              <div className="space-y-4">
                {[
                  { step: 1, title: "Submit Request", desc: "Fill out this form", time: "Now" },
                  { step: 2, title: "Review & Quote", desc: "We review and send quote", time: "24-48h" },
                  { step: 3, title: "Confirm & Pay", desc: "Approve and make payment", time: "1 day" },
                  { step: 4, title: "Crafting", desc: "Artisan creates your piece", time: "7-14 days" },
                  { step: 5, title: "Delivery", desc: "Shipped with love!", time: "10 days" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-amber-500/20">
                        {item.step}
                      </div>
                      {i < 4 && (
                        <div className="w-0.5 h-full bg-linear-to-b from-amber-200 dark:from-amber-800 to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: "Secure", sublabel: "Payment" },
                { icon: Heart, label: "Made with", sublabel: "Love" },
                { icon: MessageSquare, label: "24/7", sublabel: "Support" },
                { icon: Star, label: "5 Star", sublabel: "Reviews" },
              ].map((badge, i) => (
                <div 
                  key={i}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:shadow-gray-950/50 transition-shadow"
                >
                  <badge.icon className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{badge.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{badge.sublabel}</p>
                </div>
              ))}
            </div>
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
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Success Screen Component with Dark Mode
function SuccessScreen() {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950/30 flex items-center justify-center px-4 transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {showConfetti && (
          <>
            {[...Array(50)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-3 h-3 animate-confetti"
                style={{
                  left: `${drand(i, 120) * 100}%`,
                  top: `-10%`,
                  backgroundColor: ["#a855f7", "#ec4899", "#f97316", "#10b981", "#3b82f6"][Math.floor(drand(i, 121) * 5)],
                  animationDelay: `${drand(i, 122) * 3}s`,
                  animationDuration: `${3 + drand(i, 123) * 2}s`,
                  borderRadius: drand(i, 124) > 0.5 ? "50%" : "0",
                  transform: `rotate(${drand(i, 125) * 360}deg)`,
                }}
              />
            ))}
          </>
        )}
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Success Icon */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative w-32 h-32 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 dark:shadow-emerald-500/20">
            <Check className="w-16 h-16 text-white animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg dark:shadow-gray-950/50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Order Request Submitted! 🎉
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8">
          Thank you for your custom order request! Our artisan will review your details 
          and get back to you within 24-48 hours with a quote.
        </p>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl dark:shadow-gray-950/50 border border-gray-100 dark:border-gray-800 mb-8">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">What happens next?</h3>
          <div className="space-y-3 text-left">
            {[
              "We'll review your requirements carefully",
              "You'll receive a detailed quote via email",
              "Once approved, we'll start crafting your piece",
              "Regular updates throughout the process",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold border-2 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}