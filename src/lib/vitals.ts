/**
 * 📊 Web Vitals — lightweight performance monitoring.
 *
 * Reports Core Web Vitals (CLS, LCP, FID/INP, TTFB, FCP)
 * to structured logs. Batches and throttles to avoid log spam.
 */

import { Logger } from "./logger";

interface WebVitalMetric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
}

// Batch buffer — flushes every 5 seconds or when 10 entries are collected
const buffer: WebVitalMetric[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flush() {
  if (buffer.length === 0) return;

  const metrics = [...buffer];
  buffer.length = 0;

  Logger.info("Web Vitals batch", {
    module: "vitals",
    action: "report",
    metrics: metrics.map((m) => ({
      name: m.name,
      value: Math.round(m.value * 100) / 100,
      rating: m.rating,
    })),
  } as any);
}

/**
 * Call this from `app/layout.tsx` or a client-side provider.
 * Pass each metric from Next.js `reportWebVitals`.
 */
export function reportWebVital(metric: WebVitalMetric) {
  buffer.push(metric);

  // Flush when buffer is full
  if (buffer.length >= 10) {
    flush();
    return;
  }

  // Debounce flush to every 5 seconds
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 5000);
}

/**
 * Standalone: call once on page load to automatically
 * collect vitals via the `web-vitals` library pattern.
 */
export function initWebVitals() {
  if (typeof window === "undefined") return;

  // Use PerformanceObserver for basic metrics if web-vitals is not installed
  try {
    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as any;
      if (last) {
        const value = last.startTime;
        reportWebVital({
          id: `lcp-${Date.now()}`,
          name: "LCP",
          value,
          rating: value < 2500 ? "good" : value < 4000 ? "needs-improvement" : "poor",
          delta: value,
        });
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });

    // Report CLS on page hide
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && clsValue > 0) {
        reportWebVital({
          id: `cls-${Date.now()}`,
          name: "CLS",
          value: clsValue,
          rating: clsValue < 0.1 ? "good" : clsValue < 0.25 ? "needs-improvement" : "poor",
          delta: clsValue,
        });
      }
    });
  } catch {
    // PerformanceObserver not supported — silently degrade
  }
}
