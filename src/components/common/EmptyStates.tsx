import { cn } from "@/lib/utils";
import { PackageOpen, Heart, ShoppingBag, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface EmptyStateProps {
  variant: "products" | "wishlist" | "cart" | "search" | "orders";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const variants = {
  products: {
    icon: PackageOpen,
    title: "No products found",
    description: "We couldn't find any products in this category at the moment. Check back soon for new arrivals!",
    actionText: "Browse All Products",
    actionHref: "/products",
    color: "amber"
  },
  wishlist: {
    icon: Heart,
    title: "Your wishlist is empty",
    description: "Keep track of items you love by adding them to your wishlist. They'll wait for you here!",
    actionText: "Continue Shopping",
    actionHref: "/products",
    color: "rose"
  },
  cart: {
    icon: ShoppingBag,
    title: "Your cart is empty",
    description: "Looks like you haven't added anything to your cart yet. Time to fill it up with some handmade joy!",
    actionText: "Shop Now",
    actionHref: "/products",
    color: "orange"
  },
  search: {
    icon: Search,
    title: "No results matched your search",
    description: "Try adjusting your filters or use different keywords to find what you're looking for.",
    actionText: "Clear All Filters",
    actionHref: "/products",
    color: "blue"
  },
  orders: {
    icon: Sparkles,
    title: "No orders yet",
    description: "You haven't placed any orders yet. Once you do, you can track them right here!",
    actionText: "Start Shopping",
    actionHref: "/products",
    color: "indigo"
  }
};

export function EmptyState({ 
  variant, 
  title, 
  description, 
  actionText, 
  actionHref, 
  onAction,
  className 
}: EmptyStateProps) {
  const config = variants[variant];
  const Icon = config.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center py-20 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-black/20",
        className
      )}
    >
      <div className="relative mb-8">
        <div className={cn(
          "absolute inset-0 blur-2xl rounded-full animate-pulse",
          `bg-${config.color}-500/20`
        )} />
        <div className={cn(
          "relative w-24 h-24 rounded-full flex items-center justify-center",
          `bg-linear-to-br from-${config.color}-100 to-${config.color}-200 dark:from-${config.color}-900/40 dark:to-${config.color}-900/40`
        )}>
          <Icon className={cn("w-12 h-12", `text-${config.color}-500`)} />
        </div>
      </div>
      
      <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
        {title || config.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">
        {description || config.description}
      </p>
      
      {actionHref ? (
        <Link
          href={actionHref}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
            `bg-linear-to-r from-${config.color}-500 to-orange-500 hover:shadow-${config.color}-500/30`
          )}
        >
          {actionText || config.actionText}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className={cn(
            "inline-flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
            `bg-linear-to-r from-${config.color}-500 to-orange-500 hover:shadow-${config.color}-500/30`
          )}
        >
          {actionText || config.actionText}
        </button>
      ) : null}
    </motion.div>
  );
}
