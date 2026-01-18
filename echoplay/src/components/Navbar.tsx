import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlinePlusCircle,
  AiOutlineCompass
} from "react-icons/ai";
import { IoMusicalNotesSharp } from "react-icons/io5";

interface NavbarProps {
  onAddClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddClick }) => {
  const location = useLocation();

  const items = [
    { to: "/home", label: "Start", icon: <AiFillHome /> },
    { to: "/search", label: "Zoeken", icon: <AiOutlineSearch /> },
    { to: "/discover", label: "Ontdekken", icon: <AiOutlineCompass /> },
    { to: "", label: "Toevoegen", icon: <AiOutlinePlusCircle />, isAdd: true },
    { to: "/library", label: "Bibliotheek", icon: <IoMusicalNotesSharp /> },
  ];

  return (
    <nav
      className="fixed-bottom d-flex justify-content-around align-items-center border-top shadow-sm navbar-mobile"
      style={{
        height: "64px",
        zIndex: 1000,
        backgroundColor: "var(--color-header-footer)",
        color: "var(--color-text)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {items.map((it) => {
        const active = location.pathname === it.to;

        if (it.isAdd) {
          return (
            <div
              key="add"
              onClick={onAddClick}
              className="add-button d-flex flex-column align-items-center justify-content-center text-decoration-none"
              style={{
                cursor: "pointer",
                color: "var(--color-text)",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 600,
                transition: "color 0.2s ease",
              }}
            >
              <span style={{ fontSize: "24px" }}>{it.icon}</span>
              <span>{it.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={it.to}
            to={it.to}
            className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${
              active ? "" : "text-muted"
            }`}
            style={{
              gap: "4px",
              fontSize: "12px",
              fontWeight: active ? "600" : "400",
              color: active ? "#6c2bd9" : "var(--color-text-muted)",
            }}
          >
            <span style={{ fontSize: "20px" }}>{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        );
      })}

      {/* Hover effect via CSS */}
      <style>
        {`
          .add-button:hover {
            color: #6c2bd9;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;
