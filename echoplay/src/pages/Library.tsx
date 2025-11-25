import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { subscribePlaylists, Playlist } from "../services/playlistService";
import { useFavouriteArtists } from "../contexts/FavouriteArtistsContext";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Laad opgeslagen tab uit localStorage
    const savedTab = localStorage.getItem("libraryActiveTab");
    return savedTab || "Playlists";
  });
  const { favourite_artists } = useFavouriteArtists();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

  // Sla activeTab op in localStorage wanneer het verandert
  useEffect(() => {
    localStorage.setItem("libraryActiveTab", activeTab);
  }, [activeTab]);

  const handleArtistClick = (artistName: string) => {
    navigate(`/Artistinfo?artist=${encodeURIComponent(artistName)}`);
  };

  const tabs = ["Playlists", "Artists"];

  return (
    <div className="library-container">
      {/* Header Section */}
      <div className="library-header">
        <h1 className="library-title">Playlists</h1>
        <div className="header-icons">
          <AiOutlineSearch className="header-icon" size={24} />
          <BsThreeDotsVertical className="header-icon" size={24} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="library-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === "Playlists" ? (
        /* Playlist Grid */
        playlists.length === 0 ? (
          <div className="text-center text-muted empty-state">
            <p>No playlists yet. Create one using the + button.</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {playlists.map((p) => (
              <div key={p.id} className="playlist-card">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="playlist-image" />
                ) : (
                  <div className="playlist-image-placeholder">🎵</div>
                )}
                <div className="playlist-info">
                  <p className="playlist-title">{p.name}</p>
                  <small className="playlist-subtitle">
                    {p.description || "Echoplay"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Artists Grid */
        favourite_artists.length === 0 ? (
          <div className="text-center text-muted empty-state">
            <p>Je volgt nog geen artiesten. Begin met het volgen van artiesten om ze hier te zien!</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {favourite_artists.map((artist) => (
              <div
                key={artist.id}
                className="playlist-card"
                onClick={() => handleArtistClick(artist.name)}
              >
                {artist.images && artist.images.length > 0 ? (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="playlist-image"
                  />
                ) : (
                  <div className="playlist-image-placeholder">
                    {artist.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="playlist-info">
                  <p className="playlist-title">{artist.name}</p>
                  <small className="playlist-subtitle">Artiest</small>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Library;
