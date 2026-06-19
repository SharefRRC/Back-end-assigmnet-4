import { NextFunction, Request, Response } from "express";
import { auth } from "../../../config/firebase";
import { ERROR_CODES } from "../../../constants/error-codes";
import { AuthenticationError } from "../errors/authentication-error";
import { UserRole } from "../types/auth.types";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(
      new AuthenticationError(
        "Unauthorized: No token provided",
        ERROR_CODES.TOKEN_NOT_FOUND
      )
    );
  }

  const token = header.split(" ")[1];

  try {
    const decoded = await auth.verifyIdToken(token);

    res.locals.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role as UserRole | undefined
    };

    return next();
  } catch {
    return next(
      new AuthenticationError(
        "Unauthorized: Invalid token",
        ERROR_CODES.TOKEN_INVALID
      )
    );
  }
};