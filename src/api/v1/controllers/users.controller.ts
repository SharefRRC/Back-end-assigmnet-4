import { NextFunction, Request, Response } from "express";
import { auth } from "../../../config/firebase";
import { UserRole } from "../types/auth.types";

export const getMe = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = res.locals.user?.uid;

    if (!uid) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Unauthorized: No authenticated user",
          code: "TOKEN_INVALID"
        },
        timestamp: new Date().toISOString()
      });
    }

    const userRecord = await auth.getUser(uid);

    return res.status(200).json({
      uid: userRecord.uid,
      email: userRecord.email,
      role: userRecord.customClaims?.role ?? null,
      customClaims: userRecord.customClaims ?? {},
      decodedRole: res.locals.decodedToken?.role ?? null
    });
  } catch (error) {
    return next(error);
  }
};

export const setUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid, role } = req.body as { uid: string; role: UserRole };

    const allowedRoles: UserRole[] = ["officer", "manager", "admin"];

    if (!uid || !role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Invalid uid or role",
          code: "VALIDATION_ERROR"
        },
        timestamp: new Date().toISOString()
      });
    }

    await auth.setCustomUserClaims(uid, { role });

    return res.status(200).json({
      message: "User role updated",
      data: {
        uid,
        role
      }
    });
  } catch (error) {
    return next(error);
  }
};