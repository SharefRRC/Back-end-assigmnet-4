import { NextFunction, Request, Response } from "express";
import { UserRole } from "../types/auth.types";

export const authorize = (allowedRoles: UserRole[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user?.role) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Forbidden: Role not found",
          code: "ROLE_NOT_FOUND"
        },
        timestamp: new Date().toISOString()
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: "Forbidden: Insufficient role",
          code: "INSUFFICIENT_ROLE"
        },
        timestamp: new Date().toISOString()
      });
    }

    return next();
  };
};