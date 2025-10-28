import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";

const HeaderBar: React.FC = () => {
  const location = useLocation();

  // Functie om paginatitel te bepalen op basis van de huidige route
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/Home":
        return "Home";
      case "/search":
        return "Search";
      case "/add":
        return "Add Track";
      case "/library":
        return "My Playlists";
      default:
        return "Echoplay";
    }
  };

  return (
    <header className="bg-white border-bottom shadow-sm py-3 px-4 w-100">
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Paginatitel links */}
        <h1 className="h4 fw-bold mb-0 text-dark">
          {getPageTitle()}
        </h1>
        
        {/* Profiel icoon rechts */}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link p-2 text-decoration-none rounded-circle"
            style={{ 
              color: "#6c2bd9",
              backgroundColor: "rgba(108, 43, 217, 0.1)",
              border: "none",
              width: "40px",
              height: "40px"
            }}
            title="Profile"
          >
            <AiOutlineUser size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
