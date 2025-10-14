import React, { useState } from "react";

const VerifyEmail: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !confirmEmail) {
      console.log("Please fill in both fields");
      return;
    }

    if (email !== confirmEmail) {
      console.log("Emails do not match");
      return;
    }

    try {
      console.log(`Verification email sent to ${email}`);
      // Hier kan later Firebase of API-call komen
    } catch (err) {
      const error = err as any;
      console.error(
        "Failed to send verification email:",
        error?.message || error
      );
    }
  };

  return (
    <div className="verify-email-page">
      <h1>Verify Email</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="test.test@test.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="email"
          placeholder="confirm test.test@test.com"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
        />

        <button type="submit">Send Verification Email</button>
      </form>
    </div>
  );
};

export default VerifyEmail;
