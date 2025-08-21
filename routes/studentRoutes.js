// studentRoutes.js
import express from "express";
import { 
  getStudentInfo, 
  getStudentCourses,
  getStudentSubjects  // ✅ Import new controller function
} from "../controllers/studentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { assignCourseToStudent } from "../controllers/studentController.js";

const router = express.Router();

router.get("/info", verifyToken("student"), getStudentInfo);
// Student courses
router.get("/courses", verifyToken("student"), getStudentCourses);

// ✅ Subjects of current semester
router.get("/subjects", verifyToken("student"), getStudentSubjects);

// Assign course
router.put("/:studentId/assign-course", verifyToken("admin"), assignCourseToStudent);

export default router;
