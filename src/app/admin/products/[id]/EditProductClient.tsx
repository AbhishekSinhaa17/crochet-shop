"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { slugify, getProductImages } from "@/lib/utils";
import { uploadProductImage } from "@/actions/uploadImage";
import { updateProductAction } from "@/actions/product";
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
  Edit,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Category, Product } from "@/types";

interface EditProductClientProps {
  product: Product;
  categories: Category[];
}

export default function EditProductClient({ product, categories }: EditProductClientProps) {
  const [name, setName] = useState(product.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(product.price.toString() || "");
  const [comparePrice, setComparePrice] = useState(product.compare_price?.toString() || "");
  const [stock, setStock] = useState(product.stock.toString() || "");
  const [categoryId, setCategoryId] = useState(product.category_id || "");
  const [tags, setTags] = useState(product.tags?.join(", ") || "");
  const [isFeatured, setIsFeatured] = useState(product.is_featured || false);
  const [isActive, setIsActive] = useState(product.is_active ?? true);
  
  // Existing images (URLs)
  const [existingImages, setExistingImages] = useState<string[]>(getProductImages(product.images));
  // New images to upload (Files)
  const [newImages, setNewImages] = useState<File[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const toastId = toast.loading("Uploading new images...");

    try {
      const uploadedUrls: string[] = [];
      
      // 1. Upload new images if any
      for (const file of newImages) {
        const formData = new FormData();
        formData.append("file", file);
        
        const { url, error } = await uploadProductImage(formData);

        if (error || !url) {
          throw new Error(`Image ${file.name} upload failed: ${error || "Unknown error"}`);
        }

        uploadedUrls.push(url);
      }

      // Combine existing images (that weren't removed) and newly uploaded ones
      const finalImages = [...existingImages, ...uploadedUrls];

      if (finalImages.length === 0) {
        throw new Error("Please provide at least one image.");
      }

      toast.loading("Saving product details...", { id: toastId });

      const productData = {
        name,
        slug: slugify(name) + "-" + Date.now().toString(36),
        description,
        price: parseFloat(price),
        compare_price: comparePrice && parseFloat(comparePrice) > 0 ? parseFloat(comparePrice) : null,
        stock: parseInt(stock) || 0,
        category_id: categoryId || null,
        images: finalImages,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        is_featured: isFeatured,
        is_active: isActive,
      };

      const { success, error } = await updateProductAction(product.id, productData);

      if (error || !success) {
        throw new Error(`Database error: ${error || "Unknown server action error"}`);
      }

      toast.success("Product updated successfully!", { id: toastId });
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Update Error:", err);
      toast.error(err.message || "Failed to update product", { id: toastId });
      setLoading(false); // Explicitly reset on error
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
    setNewImages((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-200/20 dark:bg-violet-800/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pink-200/20 dark:bg-pink-800/10 blur-3xl" />
      </div>

      <Link
        href="/admin/products"
        className="group inline-flex items-center gap-2 text-sm font-medium mb-6 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Products
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-900/30 dark:border-pink-700/50 dark:text-pink-400">
            <Edit className="w-3 h-3" />
            Editing
          </span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Make changes to your product details below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 pb-12">
        {/* Section 1: Basic Info */}
        <div className="rounded-2xl shadow-sm border overflow-hidden bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20 dark:shadow-violet-500/10">
              <Package className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">Basic Information</h2>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-violet-200 focus:border-violet-400 dark:focus:ring-violet-800 dark:focus:border-violet-600 outline-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-violet-200 focus:border-violet-400 dark:focus:ring-violet-800 dark:focus:border-violet-600 outline-none min-h-[120px]"
                rows={4}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  <IndianRupee className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                  required
                  step="0.01"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  <IndianRupee className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Compare Price
                </label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                  step="0.01"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  <BoxSelect className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm border bg-white border-gray-200 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-white outline-none"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <div className="flex items-center gap-2">
                  <Star className={isFeatured ? "text-amber-500 fill-amber-500 w-4 h-4" : "text-gray-400 w-4 h-4"} />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Featured</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Active / Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Images */}
        <div className="rounded-2xl shadow-sm border overflow-hidden bg-white border-gray-100/60 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20 dark:shadow-pink-500/10">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-display font-semibold text-gray-900 dark:text-white">Product Images</h2>
          </div>

          <div className="p-6">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Current Images</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {existingImages.map((img, i) => (
                    <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-800">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg flex items-center justify-center bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drop zone for new images */}
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 cursor-pointer transition-all duration-300 ${dragOver ? "border-violet-400 bg-violet-50/50" : "border-gray-200 hover:border-violet-300"} group`}
            >
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-violet-500 mb-4" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Add more images</p>
              <input type="file" multiple accept="image/*" onChange={(e) => setNewImages(prev => [...prev, ...Array.from(e.target.files || [])])} className="hidden" />
            </label>

            {/* New Image previews */}
            {newImages.length > 0 && (
              <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {newImages.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-violet-100 dark:border-violet-800">
                    <img src={URL.createObjectURL(img)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg flex items-center justify-center bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
            {loading ? "Updating..." : "Update Product"}
          </button>
          
          <Link href="/admin/products" className="px-6 py-3.5 rounded-xl text-sm font-semibold border text-gray-600 border-gray-200 bg-white hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
