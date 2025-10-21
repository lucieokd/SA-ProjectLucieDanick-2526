import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TrendingSounds from "../components/Home/TrendingSounds";

const Home = () => {
  return (
    <div className="container-fluid px-4 py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: "#6c2bd9" }}>
          Welcome to Echoplay
        </h1>
        <p className="lead text-muted">
          Your gateway to seamless audio experiences.
        </p>
      </div>
      <TrendingSounds title={"🔥 Trending"} />
    </div>
  );
};

export default Home;
