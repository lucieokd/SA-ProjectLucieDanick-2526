import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface AddPopupProps {
  show: boolean;
  onClose: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        backgroundColor: "rgba(0,0,0,0.15)",
        backdropFilter: "blur(2px)",
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      {/* Popup sheet */}
      <div
        className="position-absolute start-50 translate-middle-x bg-white shadow-lg p-3"
        style={{
          bottom: 0,
          width: "100%",
          maxWidth: "450px",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
          animation: "slideUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()} // voorkomt dat klik buiten popup sluit
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0 fw-semibold">What would you like to add?</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="d-grid gap-2">
          <button className="custom-btn d-flex align-items-center gap-2 py-2">
            <i className="bi bi-music-note"></i> Add Song
          </button>
          <button className="custom-btn d-flex align-items-center gap-2 py-2">
            <i className="bi bi-list-ul"></i> Create Playlist
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }

          /* Custom button styling */
          .custom-btn {
            border: 2px solid #6c2bd9;
            color: #6c2bd9;
            border-radius: 8px;
            background-color: white;
            font-weight: 500;
            transition: all 0.2s ease;
            justify-content: center;
          }

          .custom-btn:hover {
            background-color: #6c2bd9;
            color: white;
          }

          .custom-btn i {
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default AddPopup;
