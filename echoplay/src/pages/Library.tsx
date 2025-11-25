// src/pages/Library.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscribePlaylists, Playlist } from "../services/playlistService";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Library.css";
import AddPopup from "../pages/AddPopup"; // verbeterde addpopup (zie verder)

const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState("Playlists");
  const [showAddPopup, setShowAddPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

  const tabs = ["Playlists", "Artists"];

  // Zoek pinned favorites (case-insensitive)
  const pinnedName = "Favorites";
  const favorites = playlists.find(
    (p) => p.name?.toLowerCase() === pinnedName.toLowerCase()
  );

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">Playlists</h1>

        <div className="header-actions">
          <div className="header-icons">
            <AiOutlineSearch className="header-icon" size={22} />
            <BsThreeDotsVertical className="header-icon" size={22} />
          </div>

          <button
            className="btn add-main-btn"
            onClick={() => setShowAddPopup(true)}
            aria-label="Add"
            type="button"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

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

      {/* Pinned favorites card (bovenaan) */}
      {favorites && (
        <div
          className="favorites-card"
          onClick={() => navigate(`/playlist/${favorites.id}`)}
          role="button"
          tabIndex={0}
        >
          <div className="favorites-artwork" />
          <div className="favorites-info">
            <div className="favorites-title">Favorites</div>
            <div className="favorites-sub">
              {favorites.tracks?.length ?? 0} nummers
            </div>
          </div>
          <div className="favorites-icon">
            <i className="bi bi-heart-fill"></i>
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      {playlists.length === 0 ? (
        <div className="text-center empty-state">
          <p>No playlists yet. Create one using the + button.</p>
        </div>
      ) : (
        <div className="playlist-grid">
          {playlists.map((p) => {
            // Skip pinned favorites (we already show it)
            if (p.name?.toLowerCase() === pinnedName.toLowerCase()) return null;

            return (
              <div
                key={p.id}
                className="playlist-card"
                onClick={() => navigate(`/playlist/${p.id}`)}
                role="button"
                tabIndex={0}
              >
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="playlist-image"
                  />
                ) : (
                  <div className="playlist-image-placeholder">
                    <i className="bi bi-music-note-beamed"></i>
                  </div>
                )}
                <div className="playlist-info">
                  <p className="playlist-title">{p.name}</p>
                  <small className="playlist-subtitle">
                    {p.description || "Echoplay"}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddPopup show={showAddPopup} onClose={() => setShowAddPopup(false)} />
    </div>
  );
};

export default Library;
