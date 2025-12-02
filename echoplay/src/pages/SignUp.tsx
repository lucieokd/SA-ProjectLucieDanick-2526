import React, { useState, FormEvent, ChangeEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { createUser } from "../services/userService";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // huidige jaartal
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 90; // maximaal 90 jaar geleden

  const onSignUpClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }

    // check dag, maand, jaar
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (
      isNaN(dayNum) ||
      dayNum < 1 ||
      dayNum > 31 ||
      isNaN(monthNum) ||
      monthNum < 1 ||
      monthNum > 12 ||
      isNaN(yearNum) ||
      yearNum < minYear ||
      yearNum > currentYear
    ) {
      setError("Please enter a valid date of birth.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup successful");
      navigate("/home");
    } catch (err: any) {
      console.error("Signup failed:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        case "auth/weak-password":
          setError("Password should be at least 6 characters.");
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center w-100 vh-100 bg-light">
      <div
        className="card shadow p-4 w-100"
        style={{
          maxWidth: "400px",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="logo.png"
            alt="EchoPlay Logo"
            className="img-fluid mb-2"
            style={{ width: "70px" }}
          />
          <h5 className="fw-bold">Create your echoplay account</h5>
        </div>

        <form onSubmit={onSignUpClick}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="d-flex gap-2 mb-3">
            <input
              type="number"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Day"
              min={1}
              max={31}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
            <input
              type="number"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Month"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
            <input
              type="number"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Year"
              min={minYear}
              max={currentYear}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="form-control form-control-lg rounded-pill text-center"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <ErrorMessage text={error} />}

          <button
            type="submit"
            className="btn btn-lg rounded-pill w-100 fw-semibold mb-3"
            style={{
              backgroundColor: "#6c2bd9",
              border: "none",
              color: "white",
            }}
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-muted mb-0">
          Already have an account?{" "}
          <button
            type="button"
            className="btn btn-link fw-semibold p-0"
            style={{ color: "#6c2bd9" }}
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
