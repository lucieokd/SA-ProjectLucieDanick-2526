import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyCode: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    const savedCode = localStorage.getItem(`otp_${email}`);

    if (!code) {
      setMessage("Please enter the 6-digit code.");
      return;
    }

    if (code === savedCode) {
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1500);
    } else {
      setMessage("Invalid code. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 w-100"
      style={{ background: "linear-gradient(135deg, #6c2bd9, #9b59b6)" }}
    >
      <div
        className="card shadow p-4 text-center"
        style={{
          maxWidth: "380px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <h3 className="fw-bold mb-3">Verify your code</h3>
        <p className="text-muted mb-4">
          We’ve sent a 6-digit code to <strong>{email}</strong>.
        </p>

        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            className="form-control form-control-lg rounded-pill text-center mb-3"
            placeholder="Enter your code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-lg rounded-pill w-100 fw-semibold"
            style={{
              backgroundColor: "#6c2bd9",
              border: "none",
              color: "white",
            }}
          >
            Verify Code
          </button>
        </form>

        {message && (
          <p
            className="mt-3 text-center text-muted"
            style={{ fontSize: "0.9rem" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;
