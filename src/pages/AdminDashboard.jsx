// dekho mai apna ui bht sundar bana chate hu jaise animation hower effect  dom manipulation throught tailwind css tho mujhe ek bht aacha ui do intractive mere dashbod ko 
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "" });
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: ""});
  const [editingCourse, setEditingCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: "", course: "", semester: 1 });
  const [editingSubject, setEditingSubject] = useState(null);
  


  const token = localStorage.getItem("token");

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axiosInstance.get("/admin/courses");
        const subjectRes = await axiosInstance.get("/admin/subjects");
        const adminRes = await axiosInstance.get("/admin/info");
        const teacherRes = await axiosInstance.get("/admin/teachers");
        const studentRes = await axiosInstance.get("/admin/students");

        setCourses(courseRes.data);
        setSubjects(subjectRes.data);
        setAdmin(adminRes.data.admin);
        setTeachers(teacherRes.data);
        setStudents(studentRes.data);
      } catch (err) {
        console.error(err);
        alert("Unauthorized or session expired");
      }
    };
    fetchData();
  }, [token]);

  // ---------------- Teacher CRUD ----------------
  const handleAddTeacher = async () => {
    try {
      const res = await axiosInstance.post("/admin/teacher", newTeacher);
      alert(res.data.message);
      setTeachers([...teachers, res.data.teacher]);
      setNewTeacher({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding teacher");
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure to delete this teacher?")) return;
    try {
      await axiosInstance.delete(`/admin/teacher/${id}`);
      setTeachers(teachers.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting teacher");
    }
  };

  const handleEditTeacher = async (id, updatedTeacher) => {
    try {
      const res = await axiosInstance.put(`/admin/teacher/${id}`, updatedTeacher);
      setTeachers(teachers.map((t) => (t._id === id ? res.data.teacher : t)));
      setEditingTeacher(null);
    } catch (err) {
      console.error(err);
      alert("Error updating teacher");
    }
  };

  // ---------------- Student CRUD ----------------
  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure to delete this student?")) return;
    try {
      await axiosInstance.delete(`/admin/student/${id}`);
      setStudents(students.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting student");
    }
  };

  const handleEditStudent = async (id, updatedStudent) => {
    try {
      const res = await axiosInstance.put(`/admin/student/${id}`, updatedStudent);
      setStudents(students.map((s) => (s._id === id ? res.data.student : s)));
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
      alert("Error updating student");
    }
  };

  // ---------------- Course CRUD ----------------
const handleAddCourse = async () => {
  try {
    const res = await axiosInstance.post("/admin/courses", newCourse, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert(res.data.message);
    setCourses([...courses, res.data.course]);
    setNewCourse({ title: "", description: "" }); // reset correctly
  } catch (err) {
    console.error(err);
    alert("Error adding course");
  }
};

  const handleEditCourse = async (id, updatedCourse) => {
    try {
      const res = await axiosInstance.put(`/admin/courses/${id}`, updatedCourse);
      setCourses(courses.map((c) => (c._id === id ? res.data.course : c)));
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
      alert("Error updating course");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure to delete this course?")) return;
    try {
      await axiosInstance.delete(`/admin/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting course");
    }
  };

  // ---------------- Subject CRUD ----------------
  const handleAddSubject = async () => {
    try {
      const res = await axiosInstance.post("/admin/subjects", newSubject);
      alert(res.data.message);
      setSubjects([...subjects, res.data.subject]);
      setNewSubject({ name: "" });
    } catch (err) {
      console.error(err);
      alert("Error adding subject");
    }
  };

  const handleEditSubject = async (id, updatedSubject) => {
    try {
      const res = await axiosInstance.put(`/admin/subjects/${id}`, updatedSubject);
      setSubjects(subjects.map((s) => (s._id === id ? res.data.subject : s)));
      setEditingSubject(null);
    } catch (err) {
      console.error(err);
      alert("Error updating subject");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure to delete this subject?")) return;
    try {
      await axiosInstance.delete(`/admin/subjects/${id}`);
      setSubjects(subjects.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting subject");
    }
  };

  // ---------------- Filtered Lists ----------------
  const filteredTeachers = teachers.filter(
    (t) =>
      (t.name?.toLowerCase() || "").includes(searchTeacher.toLowerCase()) ||
      (t.email?.toLowerCase() || "").includes(searchTeacher.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      (s.name?.toLowerCase() || "").includes(searchStudent.toLowerCase()) ||
      (s.email?.toLowerCase() || "").includes(searchStudent.toLowerCase())
  );



  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-400 to-purple-500 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Admin Info */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">👑 Admin Dashboard</h1>
          {admin && <p className="text-gray-600">Welcome, <span className="font-semibold">{admin.email}</span></p>}
        </div>

        {/* Add Teacher */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Add New Teacher</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Name"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            />
            <input
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Email"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            />
            <input
              className="border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="password"
              placeholder="Password"
              value={newTeacher.password}
              onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
            />
          </div>
          <button
            onClick={handleAddTeacher}
            className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Add Teacher
          </button>
        </div>

        {/* Edit Forms */}
        {editingTeacher && (
          <div className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="font-semibold mb-2">Edit Teacher</h3>
            <input
              value={editingTeacher.name}
              onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
              placeholder="Name"
              className="border rounded px-2 py-1 mb-2 w-full"
            />
            <input
              value={editingTeacher.email}
              onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
              placeholder="Email"
              className="border rounded px-2 py-1 mb-2 w-full"
            />
            <button
              onClick={() => handleEditTeacher(editingTeacher._id, editingTeacher)}
              className="bg-green-500 text-white px-4 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditingTeacher(null)}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {editingStudent && (
          <div className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="font-semibold mb-2">Edit Student</h3>
            <input
              value={editingStudent.name}
              onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
              placeholder="Name"
              className="border rounded px-2 py-1 mb-2 w-full"
            />
            <input
              value={editingStudent.email}
              onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
              placeholder="Email"
              className="border rounded px-2 py-1 mb-2 w-full"
            />
            <button
              onClick={() => handleEditStudent(editingStudent._id, editingStudent)}
              className="bg-green-500 text-white px-4 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditingStudent(null)}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Search Teachers */}
        <div className="mb-4">
          <input
            placeholder="Search Teacher..."
            className="border rounded-xl px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={searchTeacher}
            onChange={(e) => setSearchTeacher(e.target.value)}
          />
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Teachers List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((t) => (
                  <tr key={t._id} className="hover:bg-indigo-50">
                    <td className="px-4 py-2 border">{t.name}</td>
                    <td className="px-4 py-2 border">{t.email}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => setEditingTeacher(t)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(t._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <input
  type="text"
  value={newCourse.title}
  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
  placeholder="Course Title"
/>

<input
  type="text"
  value={newCourse.description}
  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
  placeholder="Course Description"
/>

         {/* Add Course */}
<div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
  <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Add New Course</h2>
  <div className="flex gap-4 mb-4">
    <input
      placeholder="Course Name"
      value={newCourse.name}
      onChange={(e) => setNewCourse({ name: e.target.value })}
      className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
    <button
      onClick={handleAddCourse}
      className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition duration-300"
    >
      Add
    </button>
  </div>

  {/* Courses Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-indigo-100">
          <th className="px-4 py-2 border">Name</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((c) => (
          <tr key={c._id} className="hover:bg-indigo-50">
            <td className="px-4 py-2 border">{c.name}</td>
            <td className="px-4 py-2 border space-x-2">
              <button
                onClick={() => setEditingCourse(c)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCourse(c._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>


  {/* Edit Course */}
  {editingCourse && (
    <div className="bg-gray-100 p-4 mt-4 rounded shadow">
      <input
        value={editingCourse.name}
        onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
        placeholder="Course Name"
      />
      <button
        onClick={() => handleEditCourse(editingCourse._id, editingCourse)}
        className="bg-green-500 text-white px-4 py-1 rounded mr-2"
      >
        Save
      </button>
      <button
        onClick={() => setEditingCourse(null)}
        className="bg-gray-500 text-white px-4 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  )}
</div>
{/* Add Subject */}
<div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
  <h2 className="text-2xl font-semibold text-purple-600 mb-4">Add New Subject</h2>
  <div className="flex gap-4 mb-4">
    <input
      placeholder="Subject Name"
      value={newSubject.name}
      onChange={(e) => setNewSubject({ name: e.target.value })}
      className="border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
    />
    <button
      onClick={handleAddSubject}
      className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition duration-300"
    >
      Add
    </button>
  </div>

  {/* Subjects Table */}
  <div className="overflow-x-auto">
    <table className="min-w-full table-auto border-collapse">
      <thead>
        <tr className="bg-purple-100">
          <th className="px-4 py-2 border">Name</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((s) => (
          <tr key={s._id} className="hover:bg-purple-50">
            <td className="px-4 py-2 border">{s.name}</td>
            <td className="px-4 py-2 border space-x-2">
              <button
                onClick={() => setEditingSubject(s)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSubject(s._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Edit Subject */}
  {editingSubject && (
    <div className="bg-gray-100 p-4 mt-4 rounded shadow">
      <input
        value={editingSubject.name}
        onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
        className="border rounded px-2 py-1 mb-2 w-full"
        placeholder="Subject Name"
      />
      <button
        onClick={() => handleEditSubject(editingSubject._id, editingSubject)}
        className="bg-green-500 text-white px-4 py-1 rounded mr-2"
      >
        Save
      </button>
      <button
        onClick={() => setEditingSubject(null)}
        className="bg-gray-500 text-white px-4 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  )}
</div>


        {/* Search Students */}
        <div className="mb-4">
          <input
            placeholder="Search Student..."
            className="border rounded-xl px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
          />
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Students List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-purple-100">
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-purple-50">
                    <td className="px-4 py-2 border">{s.name}</td>
                    <td className="px-4 py-2 border">{s.email}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => setEditingStudent(s)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
