import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code
      },
      timestamp: new Date().toISOString()
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
      code: "INTERNAL_SERVER_ERROR"
    },
    timestamp: new Date().toISOString()
  });
};