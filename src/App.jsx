import React,{ useState } from 'react'
import Login from './pages/Login'
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ForgetPassword from './pages/ForgetPassword';
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
// import ResetPasswordPage from './pages/ResetPasswordPage';

import './App.css'

function App() {
  

  return (
    <> <Router>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/teacher-dashboard" element={<TeacherDashboard />} />
<Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
        {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
      </Routes>
    </Router>

    </>
  )
}

export default App
