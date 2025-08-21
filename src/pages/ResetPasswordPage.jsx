// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function ResetPasswordPage() {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get email and otp from previous step
//   const { email, otp } = location.state || {};

//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (newPassword !== confirmPassword) {
  //     setMessage("Passwords do not match");
  //     return;
  //   }

  //   try {
  //     const res = await axios.post("http://localhost:5000/api/reset-password-otp", {
  //       email,
  //       otp,
  //       newPassword
  //     });

  //     setMessage(res.data.message || "✅ Password is updated successfully!");

  //     setTimeout(() => {
  //       navigate('/login');
  //     }, 3000);

  //   } catch (err) {
  //     setMessage(err.response?.data?.message || "❌ Something went wrong");
  //   }
  // };

//   return (
//     <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
//       <h2>🔐 Reset Password</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="Enter new password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//           style={{ display: 'block', width: '100%', marginBottom: '10px' }}
//         />
//         <input
//           type="password"
//           placeholder="Confirm new password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//           style={{ display: 'block', width: '100%', marginBottom: '10px' }}
//         />
//         <button type="submit" style={{ width: '100%' }}>Reset</button>
//       </form>
//       {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
//     </div>
//   );
// }

// export default ResetPasswordPage;
