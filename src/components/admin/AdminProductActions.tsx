"use client";

import { useState } from "react";
import { Eye, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProductAction } from "@/actions/product-actions";

interface AdminProductActionsProps {
  product: {
    id: string;
    slug?: string;
    images?: any;
  };
  onPreview?: () => void;
}

export default function AdminProductActions({ product, onPreview }: AdminProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteProductAction(product.id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("An error occurred while deleting the product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* View publicly / Preview */}
      <button
        onClick={onPreview}
        className="group/btn p-2 rounded-xl border transition-all duration-300
          bg-white border-gray-200 text-gray-500
          hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400
          dark:hover:border-violet-600 dark:hover:bg-violet-900/20 
          dark:hover:text-violet-400
          hover:shadow-sm hover:-translate-y-0.5"
        title="Quick view product"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Edit product */}
      <Link
        href={`/admin/products/edit/${product.id}`}
        className="group/btn p-2 rounded-xl border transition-all duration-300
          bg-white border-gray-200 text-gray-500
          hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600
          dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400
          dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20 
          dark:hover:text-indigo-400
          hover:shadow-sm hover:-translate-y-0.5"
        title="Edit product"
      >
        <Edit2 className="w-4 h-4" />
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
          hover:shadow-sm hover:-translate-y-0.5 disabled:opacity-50"
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
