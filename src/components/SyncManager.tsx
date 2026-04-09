"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Logger } from "@/lib/logger";

export default function SyncManager() {
  const { user, initialized } = useAuthStore();
  const flushCartQueue = useCartStore((s) => s.flushCartQueue);
  const flushWishlistQueue = useWishlistStore((s) => s.flushWishlistQueue);

  useEffect(() => {
    if (!initialized || !user) return;

    const handleSync = () => {
      if (navigator.onLine) {
        Logger.info("Online detected, triggering background sync...", { module: "sync-manager" });
        flushCartQueue(user.id);
        flushWishlistQueue(user.id);
      }
    };

    // 1. Sync on "online" event
    window.addEventListener("online", handleSync);

    // 2. Interval-based sync (every 5 minutes) as a fallback
    const interval = setInterval(() => {
      if (navigator.onLine) {
        handleSync();
      }
    }, 1000 * 60 * 5);

    // Initial sync check on mount
    handleSync();

    return () => {
      window.removeEventListener("online", handleSync);
      clearInterval(interval);
    };
  }, [user, initialized, flushCartQueue, flushWishlistQueue]);

  return null; // This is a logic-only component
}
