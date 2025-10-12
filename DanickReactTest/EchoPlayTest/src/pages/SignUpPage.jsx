import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

function SignupPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    async function onSignUpClick(e){
        e.preventDefault();
        if(!email|| !password  || !confirmPassword ){
            console.log("Please fill in all fields");
            setError("Please fill in all fields");
            return;
        }
        if(password !== confirmPassword){
            console.log("Passwords do not match");
            setError("Passwords do not match");
            return;
        }
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            console.log("Signup successful")
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
                default:
                setError("Something went wrong. Please try again.");
            }
        } 
    }

  return (
    <div>
      <div>
        <div className="header">
            <img src="./" alt="EchoPlay Logo"></img>
            <h2 className="Big-font">Create Your Account Here</h2>
        </div>

        <div className="input-container">
            <form onSubmit={onSignUpClick} className="form">
                <input type="email" placeholder="Email" value={email} 
                onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} 
                onChange={(e) => setPassword(e.target.value)} /> 
                <input type="password" placeholder="bevestig wachtwoord" value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} /> 
                <button type="submit">Sign Up</button>
            </form>
            <ErrorMessage text={error} />  
        </div>
        <div className="links">
            <p>
                I already have an account? <Link to="/" className="text-grey-500">SignIn</Link>
            </p>
        </div>
    </div>
    </div>
  );
}
export default SignupPage;