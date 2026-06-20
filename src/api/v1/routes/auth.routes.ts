import { Router } from "express";
import { signIn } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/signIn", signIn);

export default router;