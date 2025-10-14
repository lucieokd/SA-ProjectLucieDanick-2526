import React from "react";
import { Outlet } from "react-router-dom";
import { Player } from "../components/Player";

const MainLayout: React.FC = () => {
  return (
    <div>
      {/*pagina-inhoud */}
      <Outlet />

      {/*player staat vast onderaan */}
      <Player />
    </div>
  );
};

export default MainLayout;
