import React from "react";
import { Outlet } from "react-router-dom";
import { Player } from "../components/Player";
import Navbar from "../components/Navbar";
import HeaderBar from "../components/HeaderBar";

const MainLayout: React.FC = () => {
  return (
    <div className="with-bottom-nav" style={{ paddingBottom: "128px", paddingTop: "56px" }}>
      {/*header bar bovenaan */}
      <HeaderBar />
      
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
