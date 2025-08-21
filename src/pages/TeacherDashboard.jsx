// src/pages/TeacherDashboard.jsx
import React from "react";

export default function TeacherDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          📚 Teacher Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome, Teacher! Here you can add assignments, upload resources, and view student progress.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
          Create Assignment
        </button>
      </div>
    </div>
  );
}
