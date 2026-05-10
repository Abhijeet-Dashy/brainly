import { Router } from "express";
import { registerUser, loginUser, googleAuth } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

export default router;