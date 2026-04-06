"use client";

import { useState, useEffect } from "react";
import { uploadProductImage } from "@/actions/uploadImage";
import { createProductAction } from "@/actions/product";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import {
  Upload,
  Save,
  ArrowLeft,
  Sparkles,
  Package,
  Tag,
  IndianRupee,
  Layers,
  Image as ImageIcon,
  X,
  Star,
  GripVertical,
  Info,
  CheckCircle2,
  Loader2,
  FileText,
  Hash,
  BoxSelect,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Category } from "@/types";

export default function NewProductClient({ categories }: { categories: Category[] }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const toastId = toast.loading("Uploading images...");

    try {
      const imageUrls: string[] = [];
      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);
        
        const { url, error } = await uploadProductImage(formData);

        if (error || !url) {
          throw new Error(`Image ${file.name} upload failed: ${error || "Unknown error"}`);
        }

        imageUrls.push(url);
      }

      if (images.length > 0 && imageUrls.length === 0) {
        throw new Error("No images were successfully uploaded.");
      }

      toast.loading("Saving product details...", { id: toastId });

      const slug = slugify(name) + "-" + Date.now().toString(36);

      const productData = {
        name,
        slug,
        description,
        price: parseFloat(price),
        compare_price: comparePrice && parseFloat(comparePrice) > 0 ? parseFloat(comparePrice) : null,
        stock: parseInt(stock) || 0,
        category_id: categoryId || null,
        images: imageUrls,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_featured: isFeatured,
        is_active: true,
      };

      const { success, error } = await createProductAction(productData);

      if (error || !success) {
        throw new Error(`Database error: ${error || "Unknown server action error"}`);
      }

      toast.success("Product created successfully!", { id: toastId });
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Submit Error:", err);
      toast.error(err.message || "Failed to create product", { id: toastId });
      setLoading(false); // Explicitly reset loading on error if needed
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const discount =
    comparePrice && price
      ? Math.round(
          ((parseFloat(comparePrice) - parseFloat(price)) /
            parseFloat(comparePrice)) *
            100,
        )
      : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ── Background blobs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 -right-24 h-96 w-96 rounded-full 
            bg-violet-200/20 dark:bg-violet-800/10 blur-3xl"
        />
        <div
          className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full 
            bg-pink-200/20 dark:bg-pink-800/10 blur-3xl"
        />
        <div
          className="absolute top-1/2 right-1/3 h-64 w-64 rounded-full 
            bg-amber-200/10 dark:bg-amber-800/5 blur-3xl"
        />
      </div>

      {/* ══════════════════════════════════════════
          BACK LINK
         ══════════════════════════════════════════ */}
      <Link
        href="/admin/products"
        className="group inline-flex items-center gap-2 text-sm font-medium mb-6
          text-gray-500 hover:text-violet-600
          dark:text-gray-400 dark:hover:text-violet-400
          transition-colors duration-300
          animate-fade-in-down"
        style={{ animationDelay: "0ms" }}
      >
        <ArrowLeft
          className="w-4 h-4 group-hover:-translate-x-1 
            transition-transform duration-300"
        />
        Back to Products
      </Link>

      {/* ══════════════════════════════════════════
          HEADER
         ══════════════════════════════════════════ */}
      <div
        className="mb-8 animate-fade-in-down"
        style={{ animationDelay: "50ms" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Add New Product
          </h1>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 
              text-[11px] font-semibold border
              bg-violet-50 border-violet-200 text-violet-600
              dark:bg-violet-900/30 dark:border-violet-700/50 dark:text-violet-400"
          >
            <Sparkles className="w-3 h-3" />
            New
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Fill in the details below to add a new product to your catalog
        </p>
      </div>

      {/* ══════════════════════════════════════════
          FORM
         ══════════════════════════════════════════ */}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-12">
        {/* ─── Section 1: Basic Info ─── */}
        <div
          className="animate-fade-in-up rounded-2xl shadow-sm border overflow-hidden
            bg-white border-gray-100/60
            dark:bg-gray-900 dark:border-gray-800"
          style={{ animationDelay: "100ms" }}
        >
          {/* Section header */}
          <div
            className="flex items-center gap-3 px-6 py-4 border-b
              border-gray-100 dark:border-gray-800"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl
                bg-linear-to-br from-violet-500 to-purple-600 
                shadow-lg shadow-violet-500/20 dark:shadow-violet-500/10"
            >
              <Package className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Product name, description, and pricing
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Product Name */}
            <div className="group">
              <label
                className="flex items-center gap-1.5 text-sm font-semibold mb-2
                  text-gray-700 dark:text-gray-300"
              >
                <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Product Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Handmade Crochet Teddy Bear"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-300
                  bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                  dark:placeholder:text-gray-500
                  dark:focus:ring-violet-800 dark:focus:border-violet-600
                  hover:border-gray-300 dark:hover:border-gray-600"
                required
              />
              {name && (
                <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Slug: {slugify(name)}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                className="flex items-center gap-1.5 text-sm font-semibold mb-2
                  text-gray-700 dark:text-gray-300"
              >
                <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product in detail..."
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-300
                  resize-none
                  bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                  dark:placeholder:text-gray-500
                  dark:focus:ring-violet-800 dark:focus:border-violet-600
                  hover:border-gray-300 dark:hover:border-gray-600"
                rows={4}
              />
              <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500 text-right">
                {description.length} characters
              </p>
            </div>

            {/* Price Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label
                  className="flex items-center gap-1.5 text-sm font-semibold mb-2
                    text-gray-700 dark:text-gray-300"
                >
                  <IndianRupee className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Price
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm 
                      text-gray-400 dark:text-gray-500 font-medium"
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm border transition-all duration-300
                      bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                      dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                      dark:placeholder:text-gray-500
                      dark:focus:ring-violet-800 dark:focus:border-violet-600
                      hover:border-gray-300 dark:hover:border-gray-600"
                    required
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label
                  className="flex items-center gap-1.5 text-sm font-semibold mb-2
                    text-gray-700 dark:text-gray-300"
                >
                  <IndianRupee className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Compare Price
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm 
                      text-gray-400 dark:text-gray-500 font-medium"
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm border transition-all duration-300
                      bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                      dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                      dark:placeholder:text-gray-500
                      dark:focus:ring-violet-800 dark:focus:border-violet-600
                      hover:border-gray-300 dark:hover:border-gray-600"
                    step="0.01"
                  />
                </div>
                {discount > 0 && (
                  <p
                    className="mt-1.5 text-[11px] font-semibold 
                      text-emerald-600 dark:text-emerald-400 
                      flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {discount}% discount
                  </p>
                )}
              </div>

              <div>
                <label
                  className="flex items-center gap-1.5 text-sm font-semibold mb-2
                    text-gray-700 dark:text-gray-300"
                >
                  <BoxSelect className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Stock
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-300
                    bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                    dark:placeholder:text-gray-500
                    dark:focus:ring-violet-800 dark:focus:border-violet-600
                    hover:border-gray-300 dark:hover:border-gray-600"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                className="flex items-center gap-1.5 text-sm font-semibold mb-2
                  text-gray-700 dark:text-gray-300"
              >
                <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Category
              </label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm border 
                    transition-all duration-300 cursor-pointer
                    bg-white border-gray-200 text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                    dark:bg-gray-800 dark:border-gray-700 dark:text-white
                    dark:focus:ring-violet-800 dark:focus:border-violet-600
                    hover:border-gray-300 dark:hover:border-gray-600"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <Layers
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 
                    text-gray-400 dark:text-gray-500 pointer-events-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label
                className="flex items-center gap-1.5 text-sm font-semibold mb-2
                  text-gray-700 dark:text-gray-300"
              >
                <Tag className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="cute, gift, baby, handmade"
                className="w-full px-4 py-3 rounded-xl text-sm border transition-all duration-300
                  bg-white border-gray-200 text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400
                  dark:bg-gray-800 dark:border-gray-700 dark:text-white 
                  dark:placeholder:text-gray-500
                  dark:focus:ring-violet-800 dark:focus:border-violet-600
                  hover:border-gray-300 dark:hover:border-gray-600"
              />
              {tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full 
                          text-[11px] font-semibold border
                          bg-violet-50 border-violet-200 text-violet-600
                          dark:bg-violet-900/30 dark:border-violet-700/50 dark:text-violet-400"
                      >
                        <Hash className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Featured toggle */}
            <label
              className="group flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer
                transition-all duration-300
                border-gray-200 hover:border-violet-300
                dark:border-gray-700 dark:hover:border-violet-600
                hover:bg-violet-50/50 dark:hover:bg-violet-900/10"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-10 h-6 rounded-full transition-colors duration-300
                    bg-gray-200 peer-checked:bg-linear-to-r 
                    peer-checked:from-violet-500 peer-checked:to-purple-500
                    dark:bg-gray-700"
                />
                <div
                  className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full 
                    bg-white shadow-sm transition-transform duration-300
                    peer-checked:translate-x-4"
                />
              </div>
              <div className="flex items-center gap-2">
                <Star
                  className={`w-4 h-4 transition-colors duration-300 ${
                    isFeatured
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Featured Product
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    Show this product in featured sections
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* ─── Section 2: Images ─── */}
        <div
          className="animate-fade-in-up rounded-2xl shadow-sm border overflow-hidden
            bg-white border-gray-100/60
            dark:bg-gray-900 dark:border-gray-800"
          style={{ animationDelay: "200ms" }}
        >
          {/* Section header */}
          <div
            className="flex items-center gap-3 px-6 py-4 border-b
              border-gray-100 dark:border-gray-800"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl
                bg-linear-to-br from-pink-500 to-rose-600 
                shadow-lg shadow-pink-500/20 dark:shadow-pink-500/10"
            >
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-gray-900 dark:text-white">
                Product Images
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Upload high-quality images of your product
              </p>
            </div>
          </div>

          <div className="p-6">
            {/* Drop zone */}
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center 
                border-2 border-dashed rounded-2xl p-10 cursor-pointer
                transition-all duration-300
                ${
                  dragOver
                    ? "border-violet-400 bg-violet-50/50 dark:border-violet-500 dark:bg-violet-900/20 scale-[1.01]"
                    : "border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600"
                }
                hover:bg-violet-50/30 dark:hover:bg-violet-900/10
                group`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                  transition-all duration-300 group-hover:scale-110
                  ${
                    dragOver
                      ? "bg-violet-100 dark:bg-violet-900/40"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
              >
                <Upload
                  className={`w-6 h-6 transition-colors duration-300
                    ${
                      dragOver
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-gray-400 dark:text-gray-500"
                    }
                    group-hover:text-violet-500 dark:group-hover:text-violet-400`}
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {dragOver
                  ? "Drop images here"
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                PNG, JPG, WEBP up to 5MB each
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImages((prev) => [
                    ...prev,
                    ...Array.from(e.target.files || []),
                  ])
                }
                className="hidden"
              />

              {/* Corner decoration */}
              <div className="absolute top-3 right-3">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg 
                    text-[10px] font-semibold
                    bg-gray-100 text-gray-400
                    dark:bg-gray-800 dark:text-gray-500"
                >
                  <Info className="w-3 h-3" />
                  Max 10 images
                </span>
              </div>
            </label>

            {/* Image previews */}
            {images.length > 0 && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                    selected
                  </p>
                  <button
                    type="button"
                    onClick={() => setImages([])}
                    className="text-[11px] font-semibold text-red-500 hover:text-red-600
                      dark:text-red-400 dark:hover:text-red-300
                      transition-colors duration-300"
                  >
                    Remove all
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group/img relative aspect-square rounded-xl overflow-hidden 
                        border-2 transition-all duration-300
                        border-gray-100 dark:border-gray-800
                        hover:border-violet-300 dark:hover:border-violet-600
                        shadow-sm hover:shadow-md"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-full object-cover 
                          group-hover/img:scale-110 transition-transform duration-500"
                      />

                      {/* Primary badge */}
                      {i === 0 && (
                        <div
                          className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md
                            bg-violet-600/90 text-[9px] font-bold text-white 
                            backdrop-blur-sm"
                        >
                          PRIMARY
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg
                          flex items-center justify-center
                          bg-red-500/90 text-white backdrop-blur-sm
                          opacity-0 group-hover/img:opacity-100
                          hover:bg-red-600 transition-all duration-300
                          scale-75 group-hover/img:scale-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {/* Drag handle */}
                      <div
                        className="absolute bottom-1.5 left-1/2 -translate-x-1/2
                          opacity-0 group-hover/img:opacity-70
                          transition-opacity duration-300"
                      >
                        <GripVertical className="w-4 h-4 text-white drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Submit Button ─── */}
        <div
          className="flex items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
        >
          <button
            type="submit"
            disabled={loading}
            className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 
              rounded-xl text-sm font-semibold text-white
              transition-all duration-300
              bg-linear-to-r from-violet-600 to-purple-600 
              hover:from-violet-700 hover:to-purple-700
              shadow-lg shadow-violet-500/25 dark:shadow-violet-500/15
              hover:shadow-xl hover:shadow-violet-500/30
              hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-60 disabled:cursor-not-allowed 
              disabled:hover:translate-y-0 disabled:hover:shadow-lg
              overflow-hidden"
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 
                transition-opacity duration-500"
            >
              <div
                className="absolute inset-0 bg-linear-to-r from-transparent 
                  via-white/10 to-transparent animate-shimmer"
                style={{ backgroundSize: "200% 100%" }}
              />
            </div>

            <span className="relative flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Product...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  Create Product
                </>
              )}
            </span>
          </button>

          <Link
            href="/admin/products"
            className="px-6 py-3.5 rounded-xl text-sm font-semibold
              border transition-all duration-300
              text-gray-600 border-gray-200 bg-white
              hover:bg-gray-50 hover:border-gray-300
              dark:text-gray-400 dark:border-gray-700 dark:bg-gray-900
              dark:hover:bg-gray-800 dark:hover:border-gray-600
              hover:-translate-y-0.5 hover:shadow-sm"
          >
            Cancel
          </Link>
        </div>

        {/* ─── Helper tip ─── */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl border animate-fade-in-up
            bg-amber-50/50 border-amber-200/50
            dark:bg-amber-900/10 dark:border-amber-700/30"
          style={{ animationDelay: "400ms" }}
        >
          <Info
            className="w-4 h-4 text-amber-500 dark:text-amber-400 
              flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Pro Tip
            </p>
            <p className="text-[11px] text-amber-600/80 dark:text-amber-500/80 mt-0.5 leading-relaxed">
              Add a compare price higher than the selling price to show a
              discount badge. Use high-quality square images for the best
              display. The first image will be used as the primary product
              image.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
