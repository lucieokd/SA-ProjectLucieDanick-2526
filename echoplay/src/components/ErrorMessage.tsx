import React from "react";

interface ErrorMessageProps {
  text?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ text }) => {
  if (!text) return null;

  return (
    <p
      style={{
        color: "red",
        fontWeight: "bold",
      }}
    >
      {text}
    </p>
  );
};

export default ErrorMessage;
