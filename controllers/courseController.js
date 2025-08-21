import Course from "../models/Course.js";

// Create a new Course
export const createCourse = async (req, res) => {
  try {
    const { name, duration } = req.body;

    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res.status(400).json({ message: "Course already exists" });
    }

    // Auto create semesters (empty subjects initially)
    const semesters = [];
    for (let i = 1; i <= duration; i++) {
      semesters.push({ number: i, subjects: [] });
    }

    const course = new Course({ name, duration, semesters });
    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};// Add Subject in a Semester
export const addSubjectToSemester = async (req, res) => {
  try {
    const { courseId, semesterNumber } = req.params;
    const { name, code } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Find semester
    const semester = course.semesters.find(
      (sem) => sem.number === parseInt(semesterNumber)
    );

    if (!semester) return res.status(404).json({ message: "Semester not found" });

    // Push new subject
    semester.subjects.push({ name, code });
    await course.save();

    res.json({ message: "Subject added successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Subject in a Semester
export const updateSubjectInSemester = async (req, res) => {
  try {
    const { courseId, semesterNumber, subjectId } = req.params;
    const { name, code } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Find semester
    const semester = course.semesters.find(
      (sem) => sem.number === parseInt(semesterNumber)
    );
    if (!semester) return res.status(404).json({ message: "Semester not found" });

    // Find subject
    const subject = semester.subjects.id(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    // Update
    if (name) subject.name = name;
    if (code) subject.code = code;

    await course.save();

    res.json({ message: "Subject updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

