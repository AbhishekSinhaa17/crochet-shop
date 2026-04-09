/**
 * 🛡️ Security — Input Sanitization
 * 
 * Prevents Basic XSS and injection by stripping unsafe characters.
 */

export function sanitizeString(input: string): string {
  if (!input || typeof input !== "string") return "";
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove <script> tags
    .replace(/<[^>]*>?/gm, "") // Remove all other HTML tags
    .replace(/[<>]/g, ""); // Final catch for any remaining < or >
}

/**
 * Recursively sanitizes all strings in an object
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === "string") {
    return sanitizeString(obj) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }
  
  if (typeof obj === "object") {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}
