import React from 'react';

const LoadingSpinner = ({ message = "Laden..." }) => {
  return (
    <div className="song-preview loading">
      <div className="loading-spinner">{message}</div>
      <style>{`
        .song-preview.loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        
        .loading-spinner {
          text-align: center;
          color: #666;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;