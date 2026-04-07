import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  viewMode?: "grid" | "list";
  className?: string;
}

export function ProductCardSkeleton({ 
  viewMode = "grid", 
  className 
}: ProductCardSkeletonProps) {
  if (viewMode === "list") {
    return (
      <div className={cn(
        "flex gap-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 h-[210px]",
        className
      )}>
        {/* Image Skeleton */}
        <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-xl shrink-0" />
        
        {/* Content Skeleton */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" /> {/* Category */}
            <Skeleton className="h-6 w-3/4" /> {/* Title */}
            <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-1/2" /> {/* Description line 2 */}
            <div className="flex gap-1 mt-3">
               {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-4 h-4 rounded-full" />
               ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-8 w-24" /> {/* Price */}
            <div className="flex gap-2">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-[24px] overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800",
      className
    )}>
      {/* Image Skeleton - aspect-3/4 */}
      <Skeleton className="aspect-3/4 w-full rounded-none" />
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-4">
        <div>
          <Skeleton className="h-3 w-16 mb-2" /> {/* Category */}
          <Skeleton className="h-5 w-full mb-1" /> {/* Title 1 */}
          <Skeleton className="h-5 w-2/3" /> {/* Title 2 */}
        </div>
        
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3 rounded-full" />
          ))}
        </div>
        
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" /> {/* Price */}
            <Skeleton className="h-4 w-16" /> {/* Savings */}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, viewMode = "grid" }: { count?: number; viewMode?: "grid" | "list" }) {
  return (
    <div className={cn(
      viewMode === "grid" 
        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" 
        : "space-y-4"
    )}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
