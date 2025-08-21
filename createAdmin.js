import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "./db.js";
import Admin from "./models/admin.js";

dotenv.config();

// Connect to DB
connectDB();

const createAdmin = async () => {
  try {
    const email = "admin@example.com";
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10); // 🔑 Plain password ko hash karo

    const admin = new Admin({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
