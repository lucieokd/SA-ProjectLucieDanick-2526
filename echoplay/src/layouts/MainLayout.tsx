import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeaderBar from "../components/HeaderBar";

const MainLayout = () => {
  return (
    <div className="with-bottom-nav" style={{ paddingBottom: "128px" }}>
      {/*header bar bovenaan */}
      <div className="w-100">
        <HeaderBar />
      </div>
      
      {/*pagina-inhoud */}
      <Outlet />

      {/*bottom navigation (mobile) - onder de player */}
      <Navbar />
    </div>
  );
};

export default MainLayout;
