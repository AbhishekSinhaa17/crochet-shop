"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Eye, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getProductImages } from "@/lib/utils";
import { deleteProductAction } from "@/actions/product-actions";

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
      const result = await deleteProductAction(product.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Product deleted successfully (Soft Delete)");
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
