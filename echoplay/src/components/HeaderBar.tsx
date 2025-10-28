import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";

const HeaderBar = () => {
  const navigate = useNavigate();

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/profile");
  }

  const handleTitleName = () => {
    switch (window.location.pathname) {
      case "/home":
        return "Home";
      case "/search":
        return "Search";
      case "/library":
        return "Your Library";
      case "/profile":
        return "Profile";
      default:
        return "Unknown Page";
    }
  }

  return (
    <header className="bg-white border-bottom shadow-sm px-4 py-3 w-100">
      <div className="d-flex justify-content-between align-items-center w-100">
        {/* Paginatitel links */}
        <h1 className="h4 fw-bold mb-0 text-dark">
          {handleTitleName()}
        </h1>
        
        {/* Profiel icoon rechts */}
        <form onSubmit={handleNavigation} className="d-flex align-items-center">
          <button className="btn btn-link p-2 text-decoration-none rounded-circle"
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
        </form>
      </div>
    </header>
  );
};

export default HeaderBar;
