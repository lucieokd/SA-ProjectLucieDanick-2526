import { useNavigate } from "react-router-dom";

function ResetPasswordPage() {
    const navigation = useNavigate();
    const [password, setPassword] = "";
    const [confirmPassword, setConfirmPassword] = "";
    function onCheckPassword (e){
        e.preventDefault();
        if (password === "" || confirmPassword === "") {
            console.log("Please fill in all fields");
            return;
        }
        if (password !== confirmPassword) {
            console.log("Passwords do not match");
            return;
        }
        try {
            console.log("Password reset successful");
            navigation("/");
        } catch (err) {
            console.error("Password reset failed:", err.message);
        }
    }
  return (
    <div className="reset-password-page">
      <h1>Reset Password</h1>
      <form onSubmit={onCheckPassword}>
            <input type="password" value={password} placeholder="password"
            onClick={(e) => setPassword(e.target.value)} />
            <input type="password" value={confirmPassword}placeholder="Confirm password" 
            onClick={(e) =>setConfirmPassword(e.target.value)}/>
        <button type="submit">Confirm Password</button>
      </form>
    </div>
  );
}

export default ResetPasswordPage;