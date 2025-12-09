import React, { useState } from "react";
import { getToken } from "../../API/SpotifyCred";
import { AiOutlineSearch } from "react-icons/ai";
import ErrorMessage from "../ErrorMessage";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";


interface Artist {
  id: string;
  name: string;
  genres: Array<string>;
  images: Array<{ url: string }>;
  followers: {
    total: number;
  };
  popularity: number;
}

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { name: string; images: Array<{ url: string }> };
  artists: Array<{ id: string; name: string }>;
}

const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArtistSearch = async (artistName: string) => {
    try {
      setLoading(true);
      setError(null);

      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          artistName
        )}&type=artist`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tokenData.access_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Voor test: log de naam van de artiest in de console
      console.log("Geselecteerde artiest:", artistName);
      const data = await response.json();
      const artistNameFromSpotify = data.artists.items[0]?.name || artistName;
      
      navigate(`/Artistinfo?artist=${encodeURIComponent(artistNameFromSpotify)}`);
    } catch (error) {
      console.error("Fout bij het ophalen van artiestgegevens:", error);
      setError('Er is een fout opgetreden bij het zoeken naar artiesten');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTracks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tokenData.access_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const spotifyTracks = data.tracks.items;

      setTracks(spotifyTracks);
    } catch (err) {
      setError(err.message || "Er is een fout opgetreden bij het zoeken");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    performSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleNavigateToTrack = (track: Track) => {
    // Serializeer track data naar JSON en encodeer voor URL
    const trackData = encodeURIComponent(JSON.stringify(track));
    // Stuur zowel track als query mee zodat je terug kunt naar de resultaten
    const queryParam = query ? `&query=${encodeURIComponent(query)}` : '';
    navigate(`/search-details?track=${trackData}${queryParam}`);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Zoek liedjes, artiesten..."
            value={query}
            onChange={handleInputChange}
            aria-label="Zoek liedjes, artiesten..."
          />
          <button 
            className="btn btn-outline-secondary" 
            type="submit" 
            disabled={loading}
            aria-label="Zoeken"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <AiOutlineSearch size={20} />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-3">
          <ErrorMessage text={error} />
        </div>
      )}

      <div className="row g-3">
        {tracks.length > 0
          ? tracks.map((track) => (
              <div key={track.id} className="col-12">
                <div className="card shadow-sm h-100">
                  <div className="card-body">  
                    <div className="d-flex align-items-center gap-3">
                      {track.album.images.length > 0 && (
                        <img
                          src={
                            track.album.images[2]?.url || track.album.images[0]?.url
                          }
                          alt={`Cover van ${track.album.name}`}
                          className="img-thumbnail"
                          style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1 fw-semibold">
                          {track.name}
                        </h5>
                        <p className="card-text text-muted mb-1 small">
                          {track.artists.map((artist, index) => (
                            <span key={artist.id}>
                              <span
                                onClick={() => handleArtistSearch(artist.name)}
                                className="text-decoration-none link-primary"
                                style={{ cursor: 'pointer' }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleArtistSearch(artist.name);
                                  }
                                }}
                              >
                                {artist.name}
                              </span>
                              {index < track.artists.length - 1 && ", "}
                            </span>
                          ))}
                        </p>
                        <p className="card-text text-muted small mb-0">
                          {track.album.name}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleNavigateToTrack(track)} 
                        className="btn btn-primary"
                        aria-label="Bekijk details"
                      >
                        Bekijk details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-12">
                <div className="text-center text-muted py-5">
                  <p className="mb-0">
                    {query
                      ? "Geen resultaten gevonden — probeer iets anders"
                      : ""}
                  </p>
                </div>
              </div>
            )}
        {loading && (
          <div className="col-12">
            <div className="text-center text-muted py-5">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
              <p className="mb-0">Zoeken naar "{query}"...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
