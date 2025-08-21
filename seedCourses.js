import mongoose from "mongoose";
import Course from "./models/course.js"; 
import Student from "./models/student.js"; 

const MONGO_URI = "mongodb://127.0.0.1:27017/UserDB"; // apna DB name

const coursesData = [
  {
    title: "B.Tech Computer Science",
    description: "CS 1st Year",
    semesters: [
      {
        number: 1,
        subjects: [
          { name: "Physics", code: "PHY101" },
          { name: "Maths", code: "MTH101" },
          { name: "English", code: "ENG101" }
        ]
      },
      {
        number: 2,
        subjects: [
          { name: "Physics 2", code: "PHY201" },
          { name: "Maths 2", code: "MTH201" }
        ]
      }
    ]
  },
  {
    title: "B.Tech Mechanical",
    description: "ME 1st Year",
    semesters: [
      {
        number: 1,
        subjects: [
          { name: "Mechanics", code: "MEC101" },
          { name: "Maths", code: "MTH101" },
          { name: "English", code: "ENG101" }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB Connected");

    // Clear existing courses
    await Course.deleteMany({});
    console.log("Existing courses deleted");

    // Insert new courses
    const createdCourses = await Course.insertMany(coursesData);
    console.log("Courses seeded:", createdCourses.map(c => c.title));

    // Find the student
    const student = await Student.findOne({ email: "shruti110603@gmail.com" });

    if (student) {
      // Add only "B.Tech Computer Science" course
      const csCourse = createdCourses.find(c => c.title === "B.Tech Computer Science");
      if (csCourse) {
        // 1️⃣ Add course to student
        if (!student.courses.includes(csCourse._id)) {
          student.courses.push(csCourse._id);
          await student.save();
          console.log("Course added to student:", csCourse.title);
        }

        // 2️⃣ Add student to course
        if (!csCourse.students.includes(student._id)) {
          csCourse.students.push(student._id);
          await csCourse.save();
          console.log("Student added to course:", student.name);
        }
      }
    }

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.error("SeedDB Error:", err);
  }
};

seedDB();
