import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SongPreview from "../components/Home/SongPreview";

const Home = () => {
  return (
    <div className="container-fluid px-0">
      <SongPreview />
    </div>
  );
};

export default Home;
