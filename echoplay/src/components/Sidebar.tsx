import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineSetting,
  AiOutlinePlusCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { BsMusicNoteList } from "react-icons/bs";
import "./Sidebar.css";

interface SidebarProps {
  onAddClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/home", label: "Home", icon: <AiOutlineHome /> },
    { path: "/search", label: "Search", icon: <AiOutlineSearch /> },
    { path: "/library", label: "Playlists", icon: <BsMusicNoteList /> },
    { path: "/profile", label: "Profile & Settings", icon: <AiOutlineSetting /> },
    { path: "/about", label: "About", icon: <AiOutlineInfoCircle /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sidebar">
      {menuItems.map((item) => {
        const active = isActive(item.path);
        return (
          <div
            key={item.path + item.label}
            className={`sidebar-item ${active ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </div>
        );
      })}
      {onAddClick && (
        <div
          className="sidebar-item sidebar-add-button"
          onClick={onAddClick}
        >
          <span className="sidebar-icon">
            <AiOutlinePlusCircle />
          </span>
          <span className="sidebar-label">Add</span>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;

