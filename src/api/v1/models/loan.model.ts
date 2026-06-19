export type LoanStatus = "pending" | "under_review" | "flagged";

export interface LoanApplication {
  id: number;
  applicant: string;
  amount: number;
  status: LoanStatus;
  createdAt: string;
}