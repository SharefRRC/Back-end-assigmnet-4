import { NextFunction, Request, Response } from "express";
import { auth } from "../../../config/firebase";
import { AuthenticatedUser, UserRole } from "../types/auth.types";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized: No token provided",
          code: "TOKEN_NOT_FOUND"
        },
        timestamp: new Date().toISOString()
      });
    }

    const token = authorization.split(" ")[1];
    const decoded = await auth.verifyIdToken(token);

    const user: AuthenticatedUser = {
      uid: decoded.uid,
      email: decoded.email,
      role: (decoded.role as UserRole | undefined) ?? undefined
    };

    res.locals.user = user;
    res.locals.decodedToken = decoded;

    return next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Unauthorized: Invalid token",
        code: "TOKEN_INVALID"
      },
      timestamp: new Date().toISOString()
    });
  }
};