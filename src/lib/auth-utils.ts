/**
 * 🛡️ Auth Utilities
 * Consistent role-based checks for the whole application.
 */

export type UserRole = "admin" | "user" | null;

/**
 * Checks if a given role string is 'admin'.
 * Handles casing and potential whitespace for production robustness.
 */
export const isAdmin = (role: string | null | undefined): boolean => {
  if (!role) return false;
  return role.toLowerCase().trim() === "admin";
};

/**
 * Checks if a given role is a standard 'user'.
 */
export const isUser = (role: string | null | undefined): boolean => {
  if (!role) return false;
  return role.toLowerCase().trim() === "user";
};
