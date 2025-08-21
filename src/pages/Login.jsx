import axios from "axios";
import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // TODO: API call here
    try{
        const res=await axios.post('http://localhost:5000/api/login',formData);
           console.log("Login response:", res.data)
          // console.log("Server Response:", res.data); 
        if (res.data.token) {
      localStorage.setItem("token", res.data.token); // ✅ token save
       localStorage.setItem("role", res.data.user.role); // admin/student

       // ✅ Debug: check what got saved
  console.log("Token saved:", localStorage.getItem("token"));
  console.log("Role saved:", localStorage.getItem("role"));
       console.log("Login response:", res.data);
// ✅ Role ke hisaab se redirect
      const role = res.data.user?.role;
          // ✅ Redirect based on role
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher") navigate("/teacher-dashboard");
        else navigate("/student-dashboard");

        alert(res.data.message || "Login successful!");
      } else {
        alert("Invalid credentials");
      }
    }catch(error){
      console.log("Error",error);
          alert(error.response?.data?.message || "Login failed"); // agar error mila, error message dikhao
    
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Don’t have an account?</span>
            <a href="/register" className="text-indigo-500 hover:underline">Sign up</a>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <a href="/forgetpassword" className="text-sm text-indigo-600 hover:underline">
              Forget Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;