import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100">
      <div
        className="card shadow p-4 w-100"
        style={{
          maxWidth: "380px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/src/assets/logo.png"
            alt="Echoplay Logo"
            className="img-fluid mb-2"
            style={{ width: "80px" }}
          />
          <h2 className="fw-bold">Sign In</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-lg rounded-pill w-100 fw-semibold mb-3"
            style={{
              backgroundColor: "#6c2bd9",
              border: "none",
              color: "white",
            }}
          >
            Sign In
          </button>

          <div className="text-center">
            <a
              href="#"
              className="text-decoration-none"
              style={{ color: "#6c2bd9" }}
            >
              Forgot your password?
            </a>
          </div>
        </form>

        <p className="text-center mt-4 mb-0 text-muted">
          Don’t have an account?{" "}
          <a href="#" className="fw-semibold" style={{ color: "#6c2bd9" }}>
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
