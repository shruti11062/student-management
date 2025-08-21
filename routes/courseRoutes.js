import express from "express";
import { createCourse, getCourses, getCourseById } from "../controllers/courseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { addSubjectToSemester, updateSubjectInSemester } from "../controllers/courseController.js";


const router = express.Router();

// Admin creates course
router.post("/", verifyToken("admin"), createCourse);

// Get all courses (anyone can see)
router.get("/", getCourses);

// Get specific course
router.get("/:id", getCourseById);
// Add subject to semester
router.post("/:courseId/semester/:semesterNumber/subject", verifyToken("admin"), addSubjectToSemester);

// Update subject
router.put("/:courseId/semester/:semesterNumber/subject/:subjectId", verifyToken("admin"), updateSubjectInSemester);

export default router;
