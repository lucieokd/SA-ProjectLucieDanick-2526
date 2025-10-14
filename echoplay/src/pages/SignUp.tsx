import { useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import ErrorMessage from "../components/ErrorMessage";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onSignUpClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      console.log("Please fill in all fields");
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup successful");
      navigate("/home");
    } catch (err: unknown) {
      console.error("Signup failed:", err);

      if (typeof err === "object" && err !== null && "code" in err) {
        const errorCode = (err as { code: string }).code;
        switch (errorCode) {
          case "auth/user-not-found":
            setError("No account found for this email.");
            break;
          case "auth/wrong-password":
            setError("Incorrect password. Try again.");
            break;
          case "auth/invalid-email":
            setError("Invalid email format.");
            break;
          case "auth/email-already-in-use":
            setError("This email is already registered.");
            break;
          default:
            setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Unexpected error. Please try again.");
      }
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleConfirmChange = (e: ChangeEvent<HTMLInputElement>) =>
    setConfirmPassword(e.target.value);

  return (
    <div>
      <div>
        <div className="header">
          <img src="./" alt="EchoPlay Logo" />
          <h2 className="Big-font">Create Your Account Here</h2>
        </div>

        <div className="input-container">
          <form onSubmit={onSignUpClick} className="form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmChange}
            />
            <button type="submit">Sign Up</button>
          </form>

          <ErrorMessage text={error} />
        </div>

        <div className="links">
          <p>
            Already have an account?{" "}
            <Link to="/" className="text-grey-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
