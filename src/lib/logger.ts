type LogLevel = "info" | "warn" | "error";

export class Logger {
  private static format(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...(context && { context }),
    };
  }

  static info(message: string, context?: any) {
    console.info(JSON.stringify(this.format("info", message, context)));
  }

  static warn(message: string, context?: any) {
    console.warn(JSON.stringify(this.format("warn", message, context)));
  }

  static error(message: string, context?: any) {
    // Also include error stack if context is an Error
    if (context instanceof Error) {
      context = {
        name: context.name,
        message: context.message,
        stack: context.stack,
      };
    }
    console.error(JSON.stringify(this.format("error", message, context)));
  }

  static authFailure(userId?: string, reason?: string) {
    this.warn("Authentication failure", { userId, reason });
  }

  static adminAction(adminId: string, action: string, details?: any) {
    this.info("Admin action performed", { adminId, action, details });
  }
}
