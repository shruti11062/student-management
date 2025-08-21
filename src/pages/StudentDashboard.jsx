// src/pages/StudentDashboard.jsximport React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance"; 

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [semester, setSemester] = useState(1); // Selected semester
  const [subjects, setSubjects] = useState([]); // Subjects of selected semester

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Student info
        const resStudent = await axiosInstance.get("/student/info");
        setStudent(resStudent.data);
        setSemester(resStudent.data.currentSemester || 1);

        // Courses
        const resCourses = await axiosInstance.get("/student/courses");
        setCourses(resCourses.data);

        // Grades
        const resGrades = await axiosInstance.get("/student/grades");
        setGrades(resGrades.data);

        // Attendance
        const resAttendance = await axiosInstance.get("/student/attendance");
        setAttendance(resAttendance.data);

        // Notifications
        const resNotifications = await axiosInstance.get("/student/notifications");
        setNotifications(resNotifications.data);

        // Assignments
        const resAssignments = await axiosInstance.get("/student/assignments");
        setAssignments(resAssignments.data);

        // Subjects for current semester
        const resSubjects = await axiosInstance.get("/student/subjects", {
          params: { semester: resStudent.data.currentSemester || 1 }
        });
        setSubjects(resSubjects.data);

      } catch (err) {
        console.error("Dashboard error:", err);
        alert("Session expired or unauthorized!");
      }
    };
    fetchData();
  }, [token]);

  // Fetch subjects when semester changes
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const resSubjects = await axiosInstance.get("/student/subjects", { params: { semester } });
        console.log("Subjects fetched:", resSubjects.data);
        setSubjects(resSubjects.data);
      } catch (err) {
        console.error("Failed to fetch subjects", err);
      }
    };
    if(student) fetchSubjects();
  }, [semester, student]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Welcome Banner */}
        {student && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-center hover:shadow-xl transition duration-300">
            <h1 className="text-3xl font-bold text-indigo-700 mb-2">
              👋 Welcome, {student.name}!
            </h1>
            <p className="text-gray-600">Here's your dashboard overview</p>
          </div>
        )}

        {/* Profile Card */}
        {student && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 flex items-center space-x-6 hover:shadow-xl transition duration-300">
            <div className="w-20 h-20 bg-indigo-200 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-indigo-700">{student.name}</h2>
              <p className="text-gray-600">{student.email}</p>
              <p className="text-gray-500">Roll No: {student.rollNumber}</p>
            </div>
          </div>
        )}

        {/* Semester Selector & Subjects */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-xl transition duration-300">
          <label className="block text-gray-700 mb-2">Select Semester</label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-md"
          >
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Semester {i + 1}
              </option>
            ))}
          </select>

          {/* Subjects */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Subjects for Semester {semester}</h2>
            <ul className="space-y-2">
              {subjects.map((sub) => (
                <li key={sub._id} className="border p-3 rounded hover:bg-indigo-50 transition duration-300">
                  {sub.name} {sub.code && `(${sub.code})`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course._id} className="border p-4 rounded-lg hover:bg-indigo-50 transition duration-300">
                <h3 className="font-semibold text-indigo-700">{course.name}</h3>
                <p className="text-gray-600">Teacher: {course.teacherName}</p>
                <p className="text-gray-500">Schedule: {course.schedule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Grades */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">My Grades</h2>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-indigo-100">
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.courseId} className="hover:bg-indigo-50 transition duration-200">
                  <td className="px-4 py-2 border">{g.courseName}</td>
                  <td className="px-4 py-2 border">{g.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Attendance</h2>
          {attendance.map((a) => (
            <div key={a.courseId} className="mb-3">
              <div className="flex justify-between mb-1">
                <span>{a.courseName}</span>
                <span>{a.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{ width: `${a.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Notifications</h2>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n._id} className="border p-3 rounded hover:bg-indigo-50 transition duration-300">
                {n.message}
              </li>
            ))}
          </ul>
        </div>

        {/* Assignments */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Assignments</h2>
          <ul className="space-y-2">
            {assignments.map((ass) => (
              <li
                key={ass._id}
                className={`border p-3 rounded flex justify-between items-center transition duration-300
                  ${ass.status === "pending" ? "bg-yellow-50" : "bg-green-50"} hover:shadow-md`}
              >
                <span>{ass.title}</span>
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  ass.status === "pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"
                }`}>
                  {ass.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
