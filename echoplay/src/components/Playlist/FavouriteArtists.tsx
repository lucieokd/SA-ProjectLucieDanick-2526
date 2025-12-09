import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavouriteArtists } from "../../contexts/FavouriteArtistsContext";
import "bootstrap/dist/css/bootstrap.min.css";

const FavouriteArtists = () => {
  const { favArtists  } = useFavouriteArtists();
  const navigate = useNavigate();

  const handleArtistClick = (artistName: string) => {
    navigate(`/Artistinfo?artist=${encodeURIComponent(artistName)}`);
  };

  if (favArtists.length === 0) {
    return (
      <div className="container py-4">
        <h3 className="fw-semibold mb-4">Favoriete Artiesten</h3>
        <p className="text-muted">Je volgt nog geen artiesten. Begin met het volgen van artiesten om ze hier te zien!</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-semibold mb-4">Favoriete Artiesten</h3>
      <p className="text-muted mb-4">Aantal artiesten: {favArtists.length}</p>
      
      <div className="row g-4">
        {favArtists.map((artist) => (
          <div
            key={artist.id}
            className="col-md-3 col-sm-6 col-12"
            style={{ cursor: "pointer" }}
            onClick={() => handleArtistClick(artist.name)}
          >
            <div
              className="card h-100 shadow-sm"
              style={{
                transition: "transform 0.2s, box-shadow 0.2s",
                borderRadius: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div className="card-body text-center p-3">
                {artist.images && artist.images.length > 0 ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="img-fluid rounded-circle mb-3"
                    style={{
                      width: "500px",
                      height: "220px",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      backgroundColor: "#6c2bd9",
                      color: "white",
                      fontSize: "3rem",
                    }}
                  >
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h5 className="card-title mb-0" style={{ fontSize: "1rem" }}>
                  {artist.name}
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavouriteArtists;

