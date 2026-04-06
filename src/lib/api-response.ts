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

  static internalError(message = "Internal Server Error") {
    return this.error(message, 500);
  }

  static tooManyRequests(message = "Too Many Requests") {
    return this.error(message, 429);
  }
}
