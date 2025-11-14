import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AddPopup from "../pages/AddPopup";
import HeaderBar from "../components/HeaderBar";


const MainLayout: React.FC = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ 
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <HeaderBar/>
      
      <div className="flex-grow-1" style={{ paddingTop: '56px' }}>
        <Outlet />
      </div>
      <Navbar onAddClick={() => setShowAddPopup(true)} />
      {/* Add-popup */}
      <AddPopup show={showAddPopup} onClose={() => setShowAddPopup(false)} />
    </div>
  );
};

export default MainLayout;
