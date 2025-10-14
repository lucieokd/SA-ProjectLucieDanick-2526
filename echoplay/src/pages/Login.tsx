import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful!");
      navigate("/home");
    } catch (err: any) {
      console.error("Login failed:", err.message);
      switch (err.code) {
        case "auth/user-not-found":
          setError("No account found for this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
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

          {error && (
            <p className="text-danger text-center fw-semibold">{error}</p>
          )}

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
            <button
              type="button"
              className="btn btn-link text-decoration-none"
              style={{ color: "#6c2bd9" }}
              onClick={() => navigate("/reset-password")}
            >
              Forgot your password?
            </button>
          </div>
        </form>

        <p className="text-center mt-4 mb-0 text-muted">
          Don’t have an account?{" "}
          <button
            type="button"
            className="btn btn-link fw-semibold p-0"
            style={{ color: "#6c2bd9" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
