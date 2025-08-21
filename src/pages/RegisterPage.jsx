import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  dob: "",
  course: "",
  sem: ""   // 🔹 yaha sem add karna hai
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // form -> otp
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/send-otp", {
        email: formData.email,
      });

      setMessage(res.data.message);
      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Step 2: Verify OTP + Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        enteredOtp: otp,
          phone: formData.phone,
  dob: formData.dob,
  course: formData.course,
  sem: formData.currentSemester
      });

      setMessage("Registered successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {message && (
          <p className="mb-4 text-center text-sm text-blue-600">{message}</p>
        )}

        {step === "form" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

<div>
  <label className="block text-gray-700">Phone</label>
  <input
    type="text"
    name="phone"
    value={formData.phone || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md"
  />
</div>

<div>
  <label className="block text-gray-700">Date of Birth</label>
  <input
    type="date"
    name="dob"
    value={formData.dob || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md"
  />
</div>

<div>
  <label className="block text-gray-700">Course</label>
  <select
    name="course"
    required
    value={formData.course || ""}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md"
  >
    <option value="">-- Select Course --</option>
    <option value="B.Tech CSE">B.Tech CSE</option>
    <option value="B.Tech IT">B.Tech IT</option>
    <option value="BCA">BCA</option>
    <option value="MCA">MCA</option>
  </select>
</div>
<div>
  <label className="block text-gray-700">Semester</label>
  <select
    name="sem"
    required
    value={formData.sem}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-md"
  >
    <option value="">-- Select Semester --</option>
    <option value="1">1st Semester</option>
    <option value="2">2nd Semester</option>
    <option value="3">3rd Semester</option>
    <option value="4">4th Semester</option>
    <option value="5">5th Semester</option>
    <option value="6">6th Semester</option>
    <option value="7">7th Semester</option>
    <option value="8">8th Semester</option>
  </select>
</div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyAndRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Verify OTP & Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
