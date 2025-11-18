import React, { useEffect, useState } from "react";
import { subscribePlaylists, Playlist } from "../services/playlistService";
import { AiOutlineSearch } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Library.css";

const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState("Playlists");

  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

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

      {/* Playlist Grid */}
      {playlists.length === 0 ? (
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
      )}
    </div>
  );
};

export default Library;
