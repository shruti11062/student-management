import nodemailer from "nodemailer";
import Otp from "../models/Otp.js";

// 📤 Send OTP
export const sendOtpGmail = async (req, res) => {
  const { email } = req.body;
  console.log("📨 Sending OTP to:", email);

  if (!email.endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail addresses are allowed" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await Otp.create({ email, otp });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting password is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ Error sending OTP:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err });
  }
};

// ✅ Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, enteredOtp } = req.body;

  try {
    const record = await Otp.findOne({ email, otp: enteredOtp });

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    //await Otp.deleteOne({ _id: record._id }); // One-time use OTP
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });
  }
};
