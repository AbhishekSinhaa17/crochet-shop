import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonLoaderProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

const sizes = {
  xs: "w-3 h-3 border-2",
  sm: "w-4 h-4 border-2",
  md: "w-5 h-5 border-2",
  lg: "w-6 h-6 border-3",
};

export function ButtonLoader({ className, size = "sm" }: ButtonLoaderProps) {
  return (
    <Loader2 
      className={cn(
        "animate-spin text-current",
        sizes[size],
        className
      )} 
    />
  );
}
