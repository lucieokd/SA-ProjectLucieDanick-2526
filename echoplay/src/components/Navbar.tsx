import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { IoMusicalNotesSharp } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation();
  
  const items = [
    {
      linkToPage: "/home",
      label: "Home",
      icon: <AiFillHome />,
    },
    {
      linkToPage: "/search",
      label: "Search",
      icon: <AiOutlineSearch />,
    },
    {
      linkToPage: "/add",
      label: "Add",
      icon: <AiOutlinePlusCircle />,
    },
    {
      linkToPage: "/library",
      label: "Playlist",
      icon: <IoMusicalNotesSharp />,
    },
  ];

  return (
    <nav
      className="fixed-bottom d-flex justify-content-around align-items-center bg-white border-top shadow-sm"
      role="navigation"
      aria-label="Bottom navigation"
      style={{
        height: "64px",
        zIndex: 1000,
        borderTop: "1px solid rgba(0, 0, 0, 0.08)"
      }}
    >
      {items.map((it) => {
        const active = location.pathname === it.linkToPage;
        return (
          <Link
            key={it.linkToPage}
            to={it.linkToPage}
            className={`d-flex flex-column align-items-center justify-content-center text-decoration-none ${
              active ? "" : "text-muted"
            }`}
            aria-current={active ? "page" : undefined}
            style={{
              gap: "4px",
              fontSize: "12px",
              fontWeight: active ? "600" : "400",
              color: active ? "#6c2bd9" : undefined
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
