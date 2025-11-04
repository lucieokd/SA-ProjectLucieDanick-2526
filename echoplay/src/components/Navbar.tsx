import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { IoMusicalNotesSharp } from "react-icons/io5";

interface NavbarProps {
  onAddClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddClick }) => {
  const location = useLocation();

  const items = [
    { to: "/home", label: "Home", icon: <AiFillHome /> },
    { to: "/search", label: "Search", icon: <AiOutlineSearch /> },
    { to: "", label: "Add", icon: <AiOutlinePlusCircle />, isAdd: true }, // 🔹 speciale knop
    { to: "/library", label: "Playlist", icon: <IoMusicalNotesSharp /> },
  ];

  return (
    <nav
      className="fixed-bottom d-flex justify-content-around align-items-center bg-white border-top shadow-sm"
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        height: "64px",
        zIndex: 1000,
        borderTop: "1px solid rgba(0, 0, 0, 0.08)",
      }}
    >
      {items.map((it) => {
        const active = location.pathname === it.to;

        // 🔹 de Add-knop is GEEN link
        if (it.isAdd) {
          return (
            <div
              key="add"
              onClick={onAddClick}
              className="d-flex flex-column align-items-center justify-content-center text-decoration-none"
              style={{
                cursor: "pointer",
                color: "#6c2bd9",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: "24px" }}>{it.icon}</span>
              <span>{it.label}</span>
            </div>
          );
        }

        // 🔹 normale navigatie-items
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
              color: active ? "#6c2bd9" : undefined,
            }}
          >
            <span style={{ fontSize: "20px" }}>{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
