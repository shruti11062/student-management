// studentController.js
// controllers/studentController.js
import Student from "../models/Student.js";
import Course from "../models/Course.js";

// Student info
export const getStudentInfo = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Error in getStudentInfo:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Student Courses
export const getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).populate("courses");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json(student.courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Student Subjects for current semester
export const getStudentSubjects = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).populate({
      path: "courses",
      select: "title semesters", // course ka title aur semesters chahiye
    });
    
    
    
    
    if (!student) return res.status(404).json({ message: "Student not found" });

    const currentSemester = student.currentSemester;
    const subjects = student.courses.flatMap(course => {
      const sem = course.semesters.find(s => s.number === currentSemester);
      return sem ? sem.subjects : [];
    });

    res.json(subjects); // frontend ko bhej do
  console.log(subjects)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign course & semester to student
export const assignCourseToStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, semester } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    student.courses.push(courseId); // multiple courses ke liye array
    student.currentSemester = semester || 1;
    await student.save();

    res.json({ message: "Course assigned successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
