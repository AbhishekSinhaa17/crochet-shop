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
    Logger.info(`[Analytics] ${event.category}:${event.action}`, {
      module: "analytics",
      action: event.action,
      userId: event.userId,
      category: event.category,
      label: event.label,
      value: event.value,
    });
  }

  // ---- Convenience helpers ----

  static login(userId: string, method: "email" | "google" = "email") {
    this.track({ category: "auth", action: "login", label: method, userId });
  }

  static register(userId: string, method: "email" | "google" = "email") {
    this.track({ category: "auth", action: "register", label: method, userId });
  }

  static logout(userId?: string) {
    this.track({ category: "auth", action: "logout", userId });
  }

  static addToCart(productId: string, price: number, userId?: string) {
    this.track({ category: "cart", action: "add_to_cart", label: productId, value: price, userId });
  }

  static removeFromCart(productId: string, userId?: string) {
    this.track({ category: "cart", action: "remove_from_cart", label: productId, userId });
  }

  static addToWishlist(productId: string, userId?: string) {
    this.track({ category: "wishlist", action: "add_to_wishlist", label: productId, userId });
  }

  static removeFromWishlist(productId: string, userId?: string) {
    this.track({ category: "wishlist", action: "remove_from_wishlist", label: productId, userId });
  }

  static beginCheckout(cartTotal: number, itemCount: number, userId?: string) {
    this.track({ category: "checkout", action: "begin_checkout", value: cartTotal, label: `${itemCount} items`, userId });
  }

  static pageView(path: string, userId?: string) {
    this.track({ category: "navigation", action: "page_view", label: path, userId });
  }
}

export { Analytics };
export type { AnalyticsEvent, EventCategory };
