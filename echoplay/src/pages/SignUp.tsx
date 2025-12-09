import React, { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

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

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 90;

  const onGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      setError("Google authentication failed. Please try again.");
    }
  };

  const onSignUpClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError("Please fill in all required fields.");
      return;
    }

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
      navigate("/home");
    } catch (err: any) {
      console.error(err);
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
        style={{ maxWidth: "400px", borderRadius: "20px" }}
      >
        <div className="text-center mb-4">
          <img src="/logo.png" alt="EchoPlay Logo" style={{ width: "70px" }} />
          <h5 className="fw-bold">Create your echoplay account</h5>
        </div>

        <form onSubmit={onSignUpClick}>
          {/* ... jouw bestaande form hier ... */}

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

        {/* ✔️ GOOGLE BUTTON */}
        <button
          type="button"
          onClick={onGoogleSignup}
          className="btn btn-light border w-100 rounded-pill mb-3 d-flex align-items-center justify-content-center"
          style={{ gap: "10px" }}
        >
          <img src="/google-icon.webp" alt="Google" style={{ width: "20px" }} />
          Continue with Google
        </button>

        <p className="text-center text-muted mb-0">
          Already have an account?{" "}
          <button
            className="btn btn-link fw-semibold p-0"
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
