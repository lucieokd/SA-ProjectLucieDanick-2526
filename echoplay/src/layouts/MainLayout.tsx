import React from "react";
import { Outlet } from "react-router-dom";
import { Player } from "../components/Player";
import Navbar from "../components/Navbar";
import HeaderBar from "../components/HeaderBar";

const MainLayout: React.FC = () => {
  return (
    <div className="with-bottom-nav" style={{ paddingBottom: "128px" }}>
      {/*header bar bovenaan */}
      <div className="w-100">
        <HeaderBar />
      </div>
      
      {/*pagina-inhoud */}
      <Outlet />

      {/*player staat boven de navbar */}
      <Player />

      {/*bottom navigation (mobile) - onder de player */}
      <Navbar />
    </div>
  );
};

export default MainLayout;
