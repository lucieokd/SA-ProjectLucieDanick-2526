import React from "react";
import { useNavigate } from "react-router-dom";
import ArtistSelection from "../components/Startup/ArtistSelection";
import { useFavouriteArtists } from "../contexts/FavouriteArtistsContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ErrorMessage from "../components/ErrorMessage";
import logo from "/assets/logo.png";
const Startupscreen = () => {
  const navigate = useNavigate();
  const { favArtists } = useFavouriteArtists();
  const [errorMessage,setErrorMessage] = React.useState("");

  const handleContinue = () => {
    if (favArtists.length > 0) {
      navigate("/home");
    } else {
      setErrorMessage("Selecteer minimaal 1 artiest om door te gaan.");
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-5 w-100"
        style={{
          maxWidth: "600px",
          borderRadius: "20px",
        }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="EchoPlay Logo"
            className="img-fluid mb-3"
            style={{ width: "80px" }}
          />
          <h1 className="h2 mb-3 fw-bold">Welkom bij EchoPlay!</h1>
          <p className="text-muted mb-4">
            Om jouw ervaring te optimaliseren en het juiste algoritme te hebben voor jouw
            favoriete liedjes, willen we graag jouw top 3 artiesten weten.
          </p>
        </div>

        <ArtistSelection />

        <div className="d-flex gap-3 mt-4">
          <button
            className="btn btn-outline-secondary flex-grow-1 rounded-pill"
            onClick={handleSkip}
          >
            Overslaan
          </button>
          <button
            className="btn flex-grow-1 rounded-pill fw-semibold text-white"
            style={{ backgroundColor: "#6c2bd9", border: "none" }}
            onClick={handleContinue}
            disabled={favArtists.length === 0}
          >
            Doorgaan
          </button>
          <ErrorMessage text={errorMessage} />
        </div>
      </div>
    </div>
  );
};

export default Startupscreen;
