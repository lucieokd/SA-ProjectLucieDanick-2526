import React, { useState, FormEvent } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { createUser } from "../services/userService";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Maak eerst de auth gebruiker aan
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Maak nu het user document aan in Firestore
      await createUser({
        authId: user.uid, // ⬅️ Voeg authId toe
        email: email,
        firstName: firstName,
        lastName: lastName,
        favArtists: [], // ⬅️ Lege array voor favoriteArtist
      });

      console.log("Signup successful");
      navigate("/startup");
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
        style={{
          maxWidth: "400px",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mb-4">
          <img src="/logo.png" alt="EchoPlay Logo" style={{ width: "70px" }} />
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
