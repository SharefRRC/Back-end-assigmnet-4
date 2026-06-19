import { Router } from "express";
import {
  createLoan,
  deleteLoan,
  getLoanById,
  getLoans,
  updateLoan
} from "../controllers/loans.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/loans", authenticate, authorize(["officer", "manager", "admin"]), getLoans);
router.get("/loans/:id", authenticate, authorize(["officer", "manager", "admin"]), getLoanById);
router.post("/loans", authenticate, authorize(["manager", "admin"]), createLoan);
router.put("/loans/:id", authenticate, authorize(["manager", "admin"]), updateLoan);
router.delete("/loans/:id", authenticate, authorize(["admin"]), deleteLoan);

export default router;