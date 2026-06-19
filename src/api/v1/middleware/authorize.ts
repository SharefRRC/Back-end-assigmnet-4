import { NextFunction, Request, Response } from "express";
import { ERROR_CODES } from "../../../constants/error-codes";
import { AuthorizationError } from "../errors/authorization-error";
import { UserRole } from "../types/auth.types";

export const authorize = (allowedRoles: UserRole[]) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.user?.role;

    if (!role) {
      return next(
        new AuthorizationError(
          "Forbidden: Role not found",
          ERROR_CODES.ROLE_NOT_FOUND
        )
      );
    }

    if (!allowedRoles.includes(role)) {
      return next(
        new AuthorizationError(
          "Forbidden: Insufficient role",
          ERROR_CODES.INSUFFICIENT_ROLE
        )
      );
    }

    return next();
  };
};