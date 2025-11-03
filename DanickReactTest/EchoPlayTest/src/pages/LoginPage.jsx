import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import ErrorMessage from "../components/ErrorMessage";
import Headerlogo from "../components/Headerlogo";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    async function onLoginClick(e) {
        e.preventDefault();
        if (email === "" || password === "") {
            console.log("Please fill in all fields");
            setError("Please fill in all fields!");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log("Login successful")
            navigate("/home");
        }catch (err) {
        console.error("Login failed:", err.message);
        switch (err.code) {
                case "auth/user-not-found":
                setError("No account found for this email.");
                break;
                case "auth/wrong-password":
                setError("Incorrect password. Try again.");
                break;
                case "auth/invalid-email":
                setError("Invalid email format.");
                break;
                case "auth/invalid-credential":
                setError("Invalid credential.");
                break;
                default:
                setError("Something went wrong. Please try again.");
            }
        } 
    }

  return (
    <div>
        <div className="header">
            <Headerlogo/>
            <h2 className="Big-font">Login</h2>
        </div>
        <form onSubmit={onLoginClick} className="form">
            <input type="email" placeholder="Email" value={email} 
            onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} 
            onChange={(e) => setPassword(e.target.value)} /> 
            <button type="submit">Login</button>
            <ErrorMessage text={error} />

        </form>
        <div className="input-container">
             
        </div>

        <div className="links">
            <p>
                Forgot your password?  <Link to="/" className="text-grey-500">Click here</Link>
            </p>
            <p>
                Don’t have an account? <Link to="/signup" className="text-grey-500">Sign up</Link>
            </p>
        </div>

    </div>
      
  );
}


export default LoginPage;