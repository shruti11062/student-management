import express from "express";
import { sendOtpGmail, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();
router.post("/send-otp",sendOtpGmail);
router.post("/verify-otp", verifyOtp);
export default router;