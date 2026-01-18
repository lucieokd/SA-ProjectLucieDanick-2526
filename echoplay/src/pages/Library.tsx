import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  subscribePlaylists,
  Playlist,
  deletePlaylist,
  renamePlaylist,
} from "../services/playlistService";
import { BsThreeDotsVertical } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Library.css";
import AddPopup from "../pages/AddPopup";
import ModalMenu from "../components/Playlist/ModalMenu";
import FavouriteArtists from "../components/Playlist/FavouriteArtists";
import { auth } from "../firebase/firebaseConfig";

const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeTab, setActiveTab] = useState("Playlists");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [modalPlaylist, setModalPlaylist] = useState<Playlist | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = subscribePlaylists(user.uid, setPlaylists);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const onDocClick = () => setActiveModalId(null);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const openModal = (p: Playlist) => {
    setModalPlaylist(p);
    setActiveModalId(p.id);
  };

  const closeModal = () => {
    setActiveModalId(null);
    setModalPlaylist(null);
  };

  const pinnedName = "Favorites";
  const mySongsName = "My Songs";

  const isRenameDisabled = (name?: string) => {
    if (!name) return false;
    const n = name.toLowerCase();
    return n === pinnedName.toLowerCase() || n === mySongsName.toLowerCase();
  };

  const handleRename = async (p: Playlist) => {
    if (isRenameDisabled(p.name)) {
      alert("Deze playlist-naam kan niet bewerkt worden.");
      closeModal();
      return;
    }
    const newName = window.prompt("Nieuwe naam voor playlist:", p.name ?? "");
    if (!newName || !newName.trim()) {
      closeModal();
      return;
    }
    try {
      await renamePlaylist(p.id, newName.trim());
    } catch (err) {
      console.error(err);
      alert("Kon playlist naam niet bijwerken.");
    } finally {
      closeModal();
    }
  };

  const handleDelete = async (p: Playlist) => {
    const ok = window.confirm(
      `Weet je zeker dat je "${p.name}" wilt verwijderen? Dit kan niet ongedaan gemaakt worden.`,
    );
    if (!ok) {
      closeModal();
      return;
    }
    try {
      await deletePlaylist(p.id);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Kon playlist niet verwijderen.");
    }
  };

  const favorites = playlists.find(
    (p) => p.name?.toLowerCase() === pinnedName.toLowerCase(),
  );
  const mySongs = playlists.find(
    (p) => p.name?.toLowerCase() === mySongsName.toLowerCase(),
  );

  return (
    <div className="library-container">
      <div className="library-header">
        <h1 className="library-title">Bibliotheek</h1>
        <div className="header-actions">
          <button
            className="btn add-main-btn"
            onClick={() => setShowAddPopup(true)}
            aria-label="Toevoegen"
            type="button"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div className="library-tabs">
        {["Playlists", "Artiesten"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Playlists" ? (
        <>
          {favorites && (
            <div
              className="favorites-card"
              onClick={() => navigate(`/playlist/${favorites.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="favorites-artwork" />
              <div className="favorites-info">
                <div className="favorites-title">Favorieten</div>
                <div className="favorites-sub">
                  {favorites.tracks?.length ?? 0} nummers
                </div>
              </div>
              <div className="favorites-icon">
                <i className="bi bi-heart-fill"></i>
              </div>
            </div>
          )}
          {mySongs && (
            <div
              className="favorites-card"
              onClick={() => navigate(`/playlist/${mySongs.id}`)}
              role="button"
              tabIndex={0}
            >
              <div className="favorites-artwork my-songs-artwork" />
              <div className="favorites-info">
                <div className="favorites-title">Mijn nummers</div>
                <div className="favorites-sub">
                  {mySongs.tracks?.length ?? 0} nummers
                </div>
              </div>
              <div className="favorites-icon">
                <i className="bi bi-music-note-beamed"></i>
              </div>
            </div>
          )}

          {playlists.length === 0 ? (
            <div className="text-center empty-state">
              <p>Nog geen playlists. Maak er een aan met de + knop.</p>
            </div>
          ) : (
            <div className="playlist-grid">
              {playlists
                .filter(
                  (p) =>
                    p.name?.toLowerCase() !== pinnedName.toLowerCase() &&
                    p.name?.toLowerCase() !== mySongsName.toLowerCase(),
                )
                .map((p) => (
                  <div key={p.id} className="playlist-card-wrapper">
                    <div
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

                      <div
                        className="playlist-menu-wrapper"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="playlist-menu-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(p);
                          }}
                        >
                          <BsThreeDotsVertical size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      ) : (
        <FavouriteArtists />
      )}

      <AddPopup show={showAddPopup} onClose={() => setShowAddPopup(false)} />

      <ModalMenu
        show={activeModalId !== null}
        onClose={closeModal}
        onRename={() => modalPlaylist && handleRename(modalPlaylist)}
        onDelete={() => modalPlaylist && handleDelete(modalPlaylist)}
        disableRename={
          modalPlaylist ? isRenameDisabled(modalPlaylist.name) : false
        }
      />
    </div>
  );
};

export default Library;
