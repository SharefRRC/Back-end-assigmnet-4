import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { ERROR_CODES } from "../../../constants/error-codes";

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = process.env.FIREBASE_WEB_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: {
          message: "Firebase Web API key is missing",
          code: "CONFIG_MISSING"
        },
        timestamp: new Date().toISOString()
      });
    }

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: req.body.email,
          password: req.body.password,
          returnSecureToken: true
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        error: {
          message: `Unauthorized: ${data?.error?.message || "Invalid credentials"}`,
          code: ERROR_CODES.INVALID_CREDENTIALS
        },
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      idToken: data.idToken,
      email: data.email,
      localId: data.localId,
      expiresIn: data.expiresIn,
      refreshToken: data.refreshToken
    });
  } catch (error) {
    return next(error);
  }
};