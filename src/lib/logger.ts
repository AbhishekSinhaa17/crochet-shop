type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  module?: string;
  userId?: string;
  action?: string;
  [key: string]: unknown;
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return { raw: String(error) };
}

export class Logger {
  private static format(level: LogLevel, message: string, context?: LogContext | unknown) {
    const timestamp = new Date().toISOString();
    const env = typeof process !== "undefined" ? process.env.NODE_ENV : "unknown";

    // If context is an Error, serialize it
    const serializedContext =
      context instanceof Error ? { error: serializeError(context) } : context;

    return {
      timestamp,
      level,
      env,
      message,
      ...(serializedContext && typeof serializedContext === "object"
        ? serializedContext
        : serializedContext
        ? { context: serializedContext }
        : {}),
    };
  }

  static info(message: string, context?: LogContext) {
    console.info(JSON.stringify(this.format("info", message, context)));
  }

  static warn(message: string, context?: LogContext) {
    console.warn(JSON.stringify(this.format("warn", message, context)));
  }

  static error(message: string, error?: unknown, context?: LogContext) {
    const payload = {
      ...this.format("error", message, context),
      ...(error ? { error: serializeError(error) } : {}),
    };
    console.error(JSON.stringify(payload));
  }

  static debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === "development") {
      console.debug(JSON.stringify(this.format("debug", message, context)));
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
