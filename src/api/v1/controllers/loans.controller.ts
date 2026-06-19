import { Request, Response } from "express";
import { loans } from "../utils/loans-store";

export const getLoans = (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Loan applications retrieved",
    count: loans.length,
    data: loans
  });
};

export const getLoanById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const loan = loans.find((item) => item.id === id);

  if (!loan) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Loan application not found",
        code: "LOAN_NOT_FOUND"
      },
      timestamp: new Date().toISOString()
    });
  }

  return res.status(200).json({
    message: "Loan application retrieved",
    data: loan
  });
};

export const createLoan = (req: Request, res: Response) => {
  const { applicant, amount } = req.body;

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

export const updateLoan = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const loan = loans.find((item) => item.id === id);

  if (!loan) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Loan application not found",
        code: "LOAN_NOT_FOUND"
      },
      timestamp: new Date().toISOString()
    });
  }

  loan.status = req.body.status ?? loan.status;

  return res.status(200).json({
    message: "Loan application updated",
    data: loan
  });
};

export const deleteLoan = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = loans.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Loan application not found",
        code: "LOAN_NOT_FOUND"
      },
      timestamp: new Date().toISOString()
    });
  }

  loans.splice(index, 1);

  return res.status(200).json({
    message: "Loan application deleted"
  });
};