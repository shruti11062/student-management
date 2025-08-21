import express from "express";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";

  // or bcrypt

import { sendOtpGmail, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

router.post("/send-otp", sendOtpGmail);
router.post("/verify-otp", verifyOtp);
// Step 3: Reset password with OTP
router.post("/reset-password-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check expiry manually (5 minutes from createdAt)
    const expiryTime = new Date(otpRecord.createdAt).getTime() + 5 * 60 * 1000;
    if (Date.now() > expiryTime) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Student.updateOne({ email }, { password: hashedPassword });

    // await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ message: "password updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

export default router;
