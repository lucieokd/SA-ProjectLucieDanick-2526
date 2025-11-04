import React from 'react';

interface ErrormessageProps {
  error?: any;
  message?: string;
}

const Errormessage: React.FC<ErrormessageProps> = ({ error, message }) => {
  const displayMessage = error || message || "Geen tracks gevonden";
  
  return (
    <div className="song-preview error">
      <p>Fout: {displayMessage}</p>
      <style>{`
        .song-preview.error {
          color: #ff6b6b;
          text-align: center;
          padding: 40px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default Errormessage;