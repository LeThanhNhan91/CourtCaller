import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { forgetPassword } from "api/userApi";
import "./style.scss";
import ClipLoader from "react-spinners/ClipLoader";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await forgetPassword(email);
      if (response.success) {
        setSuccess(response.message);
        setError("");
      } else {
        setError(response.message);
        setSuccess("");
      }
    } catch (error) {
      console.log("error in forget password", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-box">
      <div className="forgot-container">
        <div style={{ height: "45vh" }}>
          <div className="forgot-title">Forget Password</div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && (
            <p style={{ color: "green", display: "flex", textAlign: "center" }}>
              {success}
            </p>
          )}
          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <p style={{ marginBottom: 10, fontSize: "larger" }}>Email</p>
              <input
                className="forgot-input"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required="Please enter your email"
              />
            </div>
            <button className="forgot-submit-btn" type="submit">
              {loading ? (
                <ClipLoader size={15} color="#fff" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <>
            <p style={{ fontSize: "large" }} classNames="signup-link">
              Don't have an account?
              <Link style={{ textDecoration: "none" }} to="/login">
                <a href="#" className="signup-link link">
                  {" "}
                  Sign up now
                </a>
              </Link>
            </p>
          </>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
