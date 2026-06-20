import { NextFunction, Request, Response } from "express";
import { auth } from "../../../config/firebase";
import { UserRole } from "../types/auth.types";

export const getMe = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = res.locals.user?.uid!;
    const user = await auth.getUser(uid);

    return res.status(200).json({
      uid: user.uid,
      email: user.email,
      customClaims: user.customClaims ?? {}
    });
  } catch (error) {
    return next(error);
  }
};

export const setUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid, role } = req.body as { uid: string; role: UserRole };

    await auth.setCustomUserClaims(uid, { role });

    return res.status(200).json({
      message: "User role updated",
      data: { uid, role }
    });
  } catch (error) {
    return next(error);
  }
};