import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";

export const verifyToken = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
      }

      const token = authHeader.split(" ")[1];
      console.log("TOKEN MILA:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("DECODED:", decoded);

      // Role ke hisaab se user fetch karo
      let user;
      if (decoded.role === "student") {
        user = await Student.findById(decoded.id).select("-password");
      } else if (decoded.role === "teacher") {
        user = await Teacher.findById(decoded.id).select("-password");
      } else if (decoded.role === "admin") {
        user = await Admin.findById(decoded.id).select("-password");
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      console.log("USER SET:", req.user.email);

      // Role check
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
