import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "api/userApi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const email = queryParams.get("email");

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (!password || !confirmPassword) {
      toast.error("Password and Confirm Password are required!");
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await resetPassword(email, token, password, confirmPassword);
      if (!response.success) {
        
        throw new Error(response.message || 'Something went wrong');
      }
  
     
      toast.success(response.message || "Password reset successfully!");
      navigate("/login"); // Chuyển hướng người dùng đến trang đăng nhập sau khi reset password thành công
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="reset-password-component">
      <div className="container" id="container">
        <form onSubmit={handleResetPassword}>
          <h1 className="reset_password">RESET PASSWORD</h1>
          <span>Enter your new password</span>
          <input
            type="password"
            value={password}
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="resetPasswordBtn">
            {loading ? <ClipLoader size={15} color="#fff" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
