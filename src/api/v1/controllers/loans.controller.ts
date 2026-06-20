import { NextFunction, Request, Response } from "express";
import { ERROR_CODES } from "../../../constants/error-codes";
import { NotFoundError } from "../errors/not-found-error";
import { ValidationError } from "../errors/validation-error";
import { loans } from "../utils/loans-store";

export const getLoans = (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Loan applications retrieved",
    count: loans.length,
    data: loans
  });
};

export const getLoanById = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const loan = loans.find((item) => item.id === id);

  if (!loan) {
    return next(new NotFoundError("Loan application not found", ERROR_CODES.LOAN_NOT_FOUND));
  }

  return res.status(200).json({
    message: "Loan application retrieved",
    data: loan
  });
};

export const createLoan = (req: Request, res: Response, next: NextFunction) => {
  const { applicant, amount } = req.body;

  if (!applicant || typeof applicant !== "string" || typeof amount !== "number") {
    return next(new ValidationError("Invalid loan payload", ERROR_CODES.VALIDATION_ERROR));
  }

  const newLoan = {
    id: loans.length ? Math.max(...loans.map((loan) => loan.id)) + 1 : 1,
    applicant,
    amount,
    status: "pending" as const,
    createdAt: new Date().toISOString()
  };

  loans.push(newLoan);

  return res.status(201).json({
    message: "Loan application created",
    data: newLoan
  });
};

export const updateLoan = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const loan = loans.find((item) => item.id === id);

  if (!loan) {
    return next(new NotFoundError("Loan application not found", ERROR_CODES.LOAN_NOT_FOUND));
  }

  if (req.body.status && !["pending", "under_review", "flagged"].includes(req.body.status)) {
    return next(new ValidationError("Invalid loan status", ERROR_CODES.VALIDATION_ERROR));
  }

  loan.status = req.body.status ?? loan.status;

  return res.status(200).json({
    message: "Loan application updated",
    data: loan
  });
};

export const deleteLoan = (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);
  const index = loans.findIndex((item) => item.id === id);

  if (index === -1) {
    return next(new NotFoundError("Loan application not found", ERROR_CODES.LOAN_NOT_FOUND));
  }

  loans.splice(index, 1);

  return res.status(200).json({
    message: "Loan application deleted"
  });
};