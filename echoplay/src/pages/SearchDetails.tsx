import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchedSong from "../components/Search/SearchedSong";
import ErrorMessage from "../components/ErrorMessage";
import Searchbar from "../components/Search/Searchbar";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { name: string; images: Array<{ url: string }> };
  artists: Array<{ id: string; name: string }>;
}

const SearchDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const trackParam = searchParams.get("track");
    
    if (!trackParam) {
      setError("Geen track informatie gevonden.");
      return;
    }

    try {
      // Decodeer en parseer track data uit URL
      const decodedTrack = JSON.parse(decodeURIComponent(trackParam));
      setTrack(decodedTrack);
      setError(null);
    } catch (err: any) {
      setError("Fout bij het laden van track informatie.");
      console.error("Error parsing track data:", err);
    }
  }, [searchParams]);

  const handleBack = () => {
    // Navigeer terug naar SearchResults met de query behouden
    if (query) {
      navigate(`/search-results?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <div className="container-fluid px-4 py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-outline-secondary"
              onClick={handleBack}
              aria-label="Terug naar zoekresultaten"
            >
              <i className="bi bi-arrow-left"></i> Terug
            </button>
            <h1 className="h2 mb-0 fw-bold">Track details</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
          {error && (
            <div className="mb-3">
              <ErrorMessage text={error} />
            </div>
          )}

          {track && (
            <div className="row g-3 mt-3">
              <SearchedSong key={track.id} track={track} />
            </div>
          )}

          {!track && !error && (
            <div className="text-center text-muted py-5">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
              <p className="mb-0">Track informatie laden...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDetails;

