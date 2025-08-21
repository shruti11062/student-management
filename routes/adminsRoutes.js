import express from "express"; 
import { verifyToken } from "../middleware/authMiddleware.js";
import Teacher from "../models/teacher.js";
import Student from "../models/student.js";
import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import bcrypt from "bcryptjs";
import {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  addSubject,
  getSubjects,
  updateSubject,
  deleteSubject
} from "../controllers/adminController.js";

const router = express.Router();

// ---------------- EXISTING ADMIN CODE ----------------

// 1️⃣ Get admin info
router.get("/info", verifyToken("admin"), (req, res) => {
  res.json({ message: "Admin info", admin: req.user });
});

// 2️⃣ Get teacher list (with optional search)
router.get("/teachers", verifyToken("admin"), async (req, res) => {
  try {
    const search = req.query.search;
    const query = search
      ? { $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ] }
      : {};
    const teachers = await Teacher.find(query);
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3️⃣ Add teacher
router.post("/teacher", verifyToken("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
    });
    await teacher.save();
    res.json({ message: "Teacher added", teacher });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4️⃣ Edit teacher
router.put("/teacher/:id", verifyToken("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    res.json({ message: "Teacher updated", teacher });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Edit student
router.put("/student/:id", verifyToken("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    res.json({ message: "Student updated", student });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 5️⃣ Delete teacher
router.delete("/teacher/:id", verifyToken("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await Teacher.findByIdAndDelete(id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete student
router.delete("/student/:id", verifyToken("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 6️⃣ Get student list (with optional search)
router.get("/students", verifyToken("admin"), async (req, res) => {
  try {
    const search = req.query.search;
    const query = search
      ? { $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } }
        ] }
      : {};
    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------- NEW: Course CRUD (Admin) ----------------
router.post("/courses", verifyToken("admin"), addCourse);
router.get("/courses", verifyToken("admin"), getCourses);
router.put("/courses/:id", verifyToken("admin"), updateCourse);
router.delete("/courses/:id", verifyToken("admin"), deleteCourse);

// ---------------- NEW: Subject CRUD (Admin) ----------------
router.post("/subjects", verifyToken("admin"), addSubject);
router.get("/subjects", verifyToken("admin"), getSubjects);
router.put("/subjects/:id", verifyToken("admin"), updateSubject);
router.delete("/subjects/:id", verifyToken("admin"), deleteSubject);

export default router;
