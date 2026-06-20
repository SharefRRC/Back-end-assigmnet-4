import { Router } from "express";
import { getMe, setUserRole } from "../controllers/users.controller";
import { authenticate } from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/users/me", authenticate, getMe);
router.post("/users/claims", authenticate, authorize(["admin"]), setUserRole);

export default router;