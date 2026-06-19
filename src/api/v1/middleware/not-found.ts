import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found-error";
import { ERROR_CODES } from "../../../constants/error-codes";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError("Route not found", ERROR_CODES.ROUTE_NOT_FOUND));
};