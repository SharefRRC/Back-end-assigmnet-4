import { AuthenticatedUser } from "./auth.types";

declare global {
  namespace Express {
    interface Locals {
      user?: AuthenticatedUser;
    }
  }
}

export {};