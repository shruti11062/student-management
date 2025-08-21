import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,   // extra spaces hata dega
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // email ko hamesha lowercase me store karega
  },
  password: {
    type: String,
    required: true,
    minlength: 6,   // thoda strong password enforce
  },

  // Auth / Role Management
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  resetToken: String,
  resetTokenExpire: Date,

  // Academic Details
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ],
  currentSemester: {
    type: Number,
    default: 1,
  },
  subjects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    }
  ],

  // Optional Future Fields
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
