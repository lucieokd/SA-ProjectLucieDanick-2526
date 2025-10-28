import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {

  return (
    <div style={{ 
      padding: "20px", 
      backgroundColor: "white", 
      minHeight: "100vh",
      color: "black"
    }}>
      <div style={{ 
        backgroundColor: "#6c2bd9", 
        color: "white", 
        padding: "20px", 
        borderRadius: "10px",
        margin: "20px 0"
      }}>
        <h2>Echoplay Music App</h2>
        <p>Welkom bij je muziek app!</p>
      </div>
    </div>
  );
};

export default Home;
