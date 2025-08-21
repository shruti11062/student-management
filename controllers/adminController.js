import Teacher from "../models/teacher.js";
import Student from "../models/student.js";
import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import bcrypt from "bcryptjs";

// ---------------- EXISTING CONTROLLERS ----------------

// Admin info
export const getAdminInfo = (req, res) => {
  res.json({ admin: req.user });
};

// Teacher list with optional search
export const getTeachers = async (req, res) => {
  const search = req.query.search;
  const query = search ? { $or: [
    { name: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } }
  ] } : {};
  const teachers = await Teacher.find(query);
  res.json(teachers);
};

// Student list with optional search
export const getStudents = async (req, res) => {
  const search = req.query.search;
  const query = search ? { $or: [
    { name: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } }
  ] } : {};
  const students = await Student.find(query);
  res.json(students);
};

// Add teacher
export const addTeacher = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const teacher = new Teacher({ name, email, password: hashedPassword });
  await teacher.save();
  res.json({ message: "Teacher added", teacher });
};

// Edit teacher
export const editTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const teacher = await Teacher.findByIdAndUpdate(id, { name, email }, { new: true });
  res.json({ message: "Teacher updated", teacher });
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  await Teacher.findByIdAndDelete(id);
  res.json({ message: "Teacher deleted" });
};

// ---------------- NEW: Course CRUD (Admin) ----------------

export const addCourse = async (req, res) => {
  try {
    const { name, semester } = req.body;
    const course = new Course({ name, semester });
    await course.save();
    res.json({ message: "Course added", course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("subjects");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, semester } = req.body;
    const course = await Course.findByIdAndUpdate(id, { name, semester }, { new: true });
    res.json({ message: "Course updated", course });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- NEW: Subject CRUD (Admin) ----------------

export const addSubject = async (req, res) => {
  try {
    const { name, courseId, semester } = req.body;
    const subject = new Subject({ name, course: courseId, semester });
    await subject.save();

    // Add subject to course
    await Course.findByIdAndUpdate(courseId, { $push: { subjects: subject._id } });

    res.json({ message: "Subject added", subject });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("course");
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, courseId, semester } = req.body;
    const subject = await Subject.findByIdAndUpdate(
      id,
      { name, course: courseId, semester },
      { new: true }
    );
    res.json({ message: "Subject updated", subject });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);

    // Remove subject from course
    await Course.findByIdAndUpdate(subject.course, { $pull: { subjects: subject._id } });

    res.json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
