import mongoose from "mongoose";

// Subject schema (embedded)
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
});

// Semester schema (embedded)
const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  subjects: [subjectSchema], // Subjects of this semester
});

// Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }
  ],
  semesters: [semesterSchema], // ✅ Add semesters here
});

const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
export default Course;
