import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";

const RequestCode: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }

    setLoading(true);

    // Genereer 6-cijferige code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`otp_${email}`, code); // tijdelijk opslaan voor verificatie

    try {
      const templateParams = {
        email: email,
        passcode: code,
      };

      await emailjs.send(
        "service_sx0wwuq", // EmailJS service ID
        "template_w9b5r1r", // EmailJS template ID
        templateParams,
        "YsGZDvpXiYEq0BrgL" // EmailJS public key
      );

      setMessage(`A 6-digit code has been sent to ${email}.`);
      setTimeout(() => navigate("/verifycode", { state: { email } }), 1500);
    } catch (error) {
      console.error(error);
      setMessage("Error sending email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 w-100"
      style={{ background: "linear-gradient(135deg, #6c2bd9, #9b59b6)" }}
    >
      <div
        className="card shadow p-4 text-center"
        style={{
          maxWidth: "380px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <h3 className="fw-bold mb-3">Login without password</h3>
        <p className="text-muted mb-4">
          Enter your email to receive a 6-digit code.
        </p>

        <form onSubmit={handleSendCode}>
          <input
            type="email"
            className="form-control form-control-lg rounded-pill text-center mb-3"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-lg rounded-pill w-100 fw-semibold"
            style={{
              backgroundColor: "#6c2bd9",
              border: "none",
              color: "white",
            }}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Code"}
          </button>
        </form>

        {message && (
          <p
            className="mt-3 text-center text-muted"
            style={{ fontSize: "0.9rem" }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RequestCode;
