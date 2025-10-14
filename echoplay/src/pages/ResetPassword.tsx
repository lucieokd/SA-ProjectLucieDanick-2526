import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const onCheckPassword = (e: React.FormEvent<HTMLFormElement>) => {
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
      navigate("/");
    } catch (err) {
      const error = err as any;
      console.error("Password reset failed:", error?.message || error);
    }
  };

  return (
    <div className="reset-password-page">
      <h1>Reset Password</h1>

      <form onSubmit={onCheckPassword}>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Confirm Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
