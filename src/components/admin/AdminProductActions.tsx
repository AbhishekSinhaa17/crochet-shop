"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Eye, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getProductImages } from "@/lib/utils";

interface AdminProductActionsProps {
  product: {
    id: string;
    slug: string;
    images: string[] | string | any;
  };
}

export default function AdminProductActions({ product }: AdminProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone and will remove all associated images.")) {
      return;
    }

    setIsDeleting(true);
    try {
      // 1. Delete images from Supabase Storage
      const images = getProductImages(product.images);
      if (images.length > 0) {
        // Extract paths from public URLs
        // URL format: https://[PROJECT_ID].supabase.co/storage/v1/object/public/product-images/[FILENAME]
        const paths = images.map(url => {
          const parts = url.split("product-images/");
          return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean) as string[];

        if (paths.length > 0) {
          console.log("Deleting images from storage:", paths);
          const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove(paths);
          
          if (storageError) {
            console.error("Error deleting images:", storageError);
            // We continue even if image deletion fails, 
            // as we want the product row removed.
          }
        }
      }

      // 2. Delete product from database
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Product deleted successfully");
      router.refresh();
    } catch (err: any) {
      console.error("Delete Error:", err);
      toast.error(err.message || "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View publicly */}
      <Link
        href={`/products/${product.slug?.trim() ? product.slug : product.id}`}
        className="group/btn p-2 rounded-xl border transition-all duration-300
          bg-white border-gray-200 text-gray-500
          hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400
          dark:hover:border-violet-600 dark:hover:bg-violet-900/20 
          dark:hover:text-violet-400
          hover:shadow-sm hover:-translate-y-0.5"
        title="View product"
      >
        <Eye className="w-4 h-4" />
      </Link>

      {/* Edit product */}
      <Link
        href={`/admin/products/${product.id}`}
        className="group/btn p-2 rounded-xl border transition-all duration-300
          bg-white border-gray-200 text-gray-500
          hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400
          dark:hover:border-pink-600 dark:hover:bg-pink-900/20 
          dark:hover:text-pink-400
          hover:shadow-sm hover:-translate-y-0.5"
        title="Edit product"
      >
        <Edit className="w-4 h-4" />
      </Link>

      {/* Delete product */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="group/btn p-2 rounded-xl border transition-all duration-300
          bg-white border-gray-200 text-gray-500
          hover:border-red-300 hover:bg-red-50 hover:text-red-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400
          dark:hover:border-red-600 dark:hover:bg-red-900/20 
          dark:hover:text-red-400
          hover:shadow-sm hover:-translate-y-0.5
          disabled:opacity-50 disabled:cursor-not-allowed"
        title="Delete product"
      >
        {isDeleting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
