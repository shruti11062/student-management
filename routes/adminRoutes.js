import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin dashboard data route
router.get("/admin-dashboard", verifyToken("admin"), async (req, res) => {
  try {
    // req.user me id, email, role available hai
    res.json({ message: "Welcome to admin dashboard", admin: req.user.email });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
