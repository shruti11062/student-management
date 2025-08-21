import jwt from "jsonwebtoken";


import crypto from "crypto";
import express from "express";
import connectDB from "./db.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import otpRoutes from "./routes/otpRoutes.js";
import bcrypt from 'bcrypt';
import Admin from './models/admin.js';

import sendMail from "./utils/sendMail.js";

import Student from "./models/Student.js";
import Otp from "./models/Otp.js";
import otpForget from "./routes/otpForget.js"
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js"
import adminsRoutes from "./routes/adminsRoutes.js";
import Course from "./models/course.js"; // ✅ correct path dalna

import courseRoutes from "./routes/courseRoutes.js";

 // Student Model
const router = express.Router();
dotenv.config();

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();
app.use("/api", otpRoutes);
app.use("/api", otpForget);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminsRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/courses", courseRoutes);

// ✅ Register API
// ✅ Register API
app.post("/api/register", async (req, res) => {
  const { name, email, password, currentSemester } = req.body;

  try {
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Only valid Gmail addresses are allowed!" });
    }

    // Check if student exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Create student object
    const newStudent = new Student({
      name,
      email,
      password: hashedPassword,
      role: "student",
      currentSemester: currentSemester || 1,
    });

    // Step 2: Assign all courses
    const allCourses = await Course.find({});
    newStudent.courses = allCourses.map(c => c._id);

    // Step 3: Assign subjects for current semester
    const subjectsForSemester = allCourses.flatMap(course => {
      const sem = course.semesters.find(s => s.number === newStudent.currentSemester);
      return sem ? sem.subjects : [];
    });

    newStudent.subjects = subjectsForSemester.map(s => s._id);

    // Step 4: Save student
    await newStudent.save();

    res.status(201).json({
      message: "Student registered successfully with courses and subjects!",
      student: newStudent
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Database me check karo
    let user = await Student.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
console.log("Password from request:", `"${password}"`);
console.log("Password from DB:", `"${user.password}"`);
    // Password verify
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Do they match?", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // JWT token generate
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Response
    console.log("token", token);
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// });
app.post("/api/reset-password-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (otpRecord.expireAt < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Student.updateOne({ email }, { password: hashedPassword });

    await Otp.deleteOne({ _id: otpRecord._id });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
