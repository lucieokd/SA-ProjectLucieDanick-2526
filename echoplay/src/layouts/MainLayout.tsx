import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddPopup from "../pages/AddPopup";

const MainLayout: React.FC = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <div className="flex-grow-1">
        <Outlet />
      </div>

      {/* Navbar met Add-knop */}
      <Navbar onAddClick={() => setShowAddPopup(true)} />

      {/* Add-popup */}
      <AddPopup show={showAddPopup} onClose={() => setShowAddPopup(false)} />
    </div>
  );
};

export default MainLayout;
