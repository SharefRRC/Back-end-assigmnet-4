export type UserRole = "officer" | "manager" | "admin";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  role?: UserRole;
}