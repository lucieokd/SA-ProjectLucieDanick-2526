import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";

const HeaderBar = () => {
  const location = useLocation();

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

  const navigate = useNavigate();
  const handleProfileNaviagtion = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/profile");
  }

  return (
  <nav className="fixed-top d-flex justify-content-between align-items-center border-bottom shadow-sm px-3 py-2 bg-white" style={{ zIndex: 1002, height: '56px' }}>
    <h1 className="h4 fw-bold mb-0 text-dark">{getPageTitle()}</h1>
    <form onSubmit={handleProfileNaviagtion}>
       <button
      className="btn btn-link p-2 text-decoration-none rounded-circle"
      style={{
        color: "#6c2bd9",
        backgroundColor: "rgba(108, 43, 217, 0.1)",
        border: "none",
        width: "40px",
        height: "40px",
      }}
      title="Profile"
      type="submit">
        <AiOutlineUser size={20} />
      </button>
    </form>
   
  </nav>
  );
};

export default HeaderBar;
