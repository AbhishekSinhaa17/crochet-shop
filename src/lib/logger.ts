type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  module?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

/**
 * 🔒 Safe Stringify — prevents circular reference crashes.
 * Especially useful for complex Supabase/Network error objects.
 */
function safeStringify(obj: unknown): string {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) return "[Circular]";
      cache.add(value);
    }
    return value;
  });
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  
  // 🛡️ Handle Supabase / Postgrest Errors
  if (error && typeof error === 'object') {
    const err = error as any;
    if (err.message || err.details || err.hint || err.code) {
      return {
        message: err.message || 'Unknown Supabase Error',
        details: err.details,
        hint: err.hint,
        code: err.code
      };
    }
  }

  return { raw: String(error) };
}

export class Logger {
  private static format(level: LogLevel, message: string, context?: LogContext | unknown) {
    const timestamp = new Date().toISOString();
    
    // 🌐 Browser-safe environment check
    let env = "unknown";
    try {
      if (typeof process !== "undefined" && process.env) {
        env = process.env.NODE_ENV || "unknown";
      }
    } catch {
      // In some environments, accessing process might throw
    }

    // If context is an Error, serialize it
    const serializedContext =
      context instanceof Error ? { error: serializeError(context) } : context;

    return {
      timestamp,
      level,
      env,
      message,
      ...(serializedContext && typeof serializedContext === "object"
        ? (serializedContext as any)
        : serializedContext
        ? { context: serializedContext }
        : {}),
    };
  }

  static info(message: string, context?: LogContext) {
    console.info(safeStringify(this.format("info", message, context)));
  }

  static warn(message: string, context?: LogContext) {
    console.warn(safeStringify(this.format("warn", message, context)));
  }

  static error(message: string, error?: unknown, context?: LogContext) {
    try {
      const payload = {
        ...this.format("error", message, context),
        ...(error ? { error: serializeError(error) } : {}),
      };
      console.error(safeStringify(payload));
    } catch (e) {
      // Emergency fallback if even safeStringify fails
      console.error("Logger crash while logging error:", message);
    }
  }

  static debug(message: string, context?: LogContext) {
    try {
      if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
        console.debug(safeStringify(this.format("debug", message, context)));
      }
    } catch {
      // Silent in production if process check fails
    }
  }

  // ---- Domain-specific helpers ----

  static authFailure(reason: string, context?: { userId?: string; email?: string }) {
    this.warn("Authentication failure", { module: "auth", action: "auth_failure", ...context, reason } as LogContext);
  }

  static adminAction(adminId: string, action: string, details?: Record<string, unknown>) {
    this.info("Admin action performed", { module: "admin", userId: adminId, action, ...details } as LogContext);
  }

  static apiError(route: string, error: unknown, context?: LogContext) {
    this.error(`API error on ${route}`, error, { module: "api", action: route, ...context });
  }

  static storeError(store: string, action: string, error: unknown) {
    this.error(`Store error [${store}/${action}]`, error, { module: "store", action });
  }
}
