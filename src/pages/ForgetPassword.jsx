// ForgotPassword.jsximport React, { useState } from "react";
import React, { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // 👈 Step 1: Email | 2: OTP | 3: New password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", { email });
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email,
        enteredOtp: otp,
      });

      setMessage("OTP verified. Please enter your new password.");
      setStep(3);
    } catch (error) {
      setMessage(error?.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password-otp", {
        email,
        otp,
        newPassword,
      });

      setMessage(res.data.message || "Password reset successful!");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>

        <form
          onSubmit={
            step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleResetPassword
          }
          className="space-y-5"
        >
          {/* Step 1: Email */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 rounded-lg transition duration-200`}
          >
            {loading
              ? "Please wait..."
              : step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
