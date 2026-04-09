/**
 * 📊 Basic Analytics — provider-agnostic event tracking.
 *
 * Logs structured events to the console (and Sentry breadcrumbs when available).
 * Can be extended later with Google Analytics, Plausible, PostHog, etc.
 */

import { Logger } from "./logger";

type EventCategory = "auth" | "cart" | "wishlist" | "checkout" | "navigation" | "admin";

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
}

class Analytics {
  /**
   * Track a structured event.
   */
  static track(event: AnalyticsEvent) {
    // Ensure tracking is non-blocking
    const trackWork = () => {
      Logger.info(`[Analytics] ${event.category}:${event.action}`, {
        module: "analytics",
        action: event.action,
        userId: event.userId,
        category: event.category,
        label: event.label,
        value: event.value,
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      (window as any).requestIdleCallback(trackWork);
    } else {
      setTimeout(trackWork, 0);
    }
  }

  /**
   * 🚀 Generic event tracking utility
   */
  static trackEvent(eventName: string, payload: any = {}) {
    const { userId, category = "general", value, label, ...rest } = payload;
    
    this.track({
      category: category as EventCategory,
      action: eventName.toLowerCase(),
      label: label || JSON.stringify(rest),
      value,
      userId
    });
  }

  // ---- Convenience helpers ----

  static login(userId: string, method: "email" | "google" = "email") {
    this.trackEvent("LOGIN", { category: "auth", method, userId });
  }

  static register(userId: string, method: "email" | "google" = "email") {
    this.trackEvent("REGISTER", { category: "auth", method, userId });
  }

  static logout(userId?: string) {
    this.trackEvent("LOGOUT", { category: "auth", userId });
  }

  static addToCart(productId: string, price: number, userId?: string) {
    this.trackEvent("ADD_TO_CART", { category: "cart", productId, price, value: price, userId });
  }

  static removeFromCart(productId: string, userId?: string) {
    this.trackEvent("REMOVE_FROM_CART", { category: "cart", productId, userId });
  }

  static addToWishlist(productId: string, userId?: string) {
    this.trackEvent("ADD_TO_WISHLIST", { category: "wishlist", productId, userId });
  }

  static removeFromWishlist(productId: string, userId?: string) {
    this.trackEvent("REMOVE_FROM_WISHLIST", { category: "wishlist", productId, userId });
  }

  static beginCheckout(cartTotal: number, itemCount: number, userId?: string) {
    this.trackEvent("BEGIN_CHECKOUT", { category: "checkout", value: cartTotal, label: `${itemCount} items`, userId });
  }

  static pageView(path: string, userId?: string) {
    this.trackEvent("PAGE_VIEW", { category: "navigation", label: path, userId });
  }

  static viewProduct(product: any, userId?: string) {
    this.trackEvent("VIEW_PRODUCT", { 
      category: "navigation", 
      productId: product.id, 
      productName: product.name,
      price: product.price,
      userId 
    });
  }
}

export { Analytics };
export type { AnalyticsEvent, EventCategory };
