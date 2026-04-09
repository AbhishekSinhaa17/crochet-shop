import { NextResponse } from "next/server";

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
};

export class Response {
  static success<T = any>(data: T, status = 200, metadata?: any) {
    return NextResponse.json(
      {
        success: true,
        data,
        metadata,
      },
      { status }
    );
  }

  static error(message: string, status = 400) {
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }

  static unauthorized(message = "Unauthorized") {
    return this.error(message, 401);
  }

  static forbidden(message = "Forbidden") {
    return this.error(message, 403);
  }

  static notFound(message = "Not Found") {
    return this.error(message, 404);
  }

  static internalError(message = "Something went wrong") {
    return this.error(message, 500);
  }

  static tooManyRequests(message = "Too many requests") {
    return this.error(message, 429);
  }

  /**
   * 🛡️ Centralized error handler for common security/auth exceptions
   */
  static handle(err: any, route: string) {
    // 1. Auth Errors
    if (err.name === "AuthError") {
      return this.error(err.message, err.status);
    }

    // 2. Rate Limit Errors
    if (err.name === "RateLimitError") {
      return this.tooManyRequests();
    }

    // 3. Zod Errors
    if (err.name === "ZodError" || err.issues) {
      return this.error("Invalid input data", 400);
    }

    // 4. Payload Size Errors
    if (err.message === "Payload too large") {
      return this.error("Request entity too large", 413);
    }

    // 5. Fallback for others (masked for production)
    return this.internalError();
  }
}
