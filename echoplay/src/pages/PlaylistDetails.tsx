import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  subscribePlaylists,
  Playlist,
  removeTrackFromPlaylist,
  deletePlaylist,
  renamePlaylist,
} from "../services/playlistService";
import "../styles/PlaylistDetails.css";
import ModalMenu from "../components/Playlist/ModalMenu";

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [activeTrackModal, setActiveTrackModal] = useState<any | null>(null);
  const [activePlaylistModal, setActivePlaylistModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const PROTECTED = ["favorites", "my songs"];

  /* -----------------------------
     Realtime playlist updates
  ----------------------------- */
  useEffect(() => {
    const unsub = subscribePlaylists((items) => setAllPlaylists(items));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    setPlaylist(allPlaylists.find((p) => p.id === id) || null);
  }, [allPlaylists, id]);

  /* -----------------------------
     Play / Pause track
  ----------------------------- */
  const togglePlay = (url?: string | null) => {
    if (!url) return;

    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.crossOrigin = "anonymous";
    audio.onended = () => setPlayingUrl(null);
    audio.play().then(() => setPlayingUrl(url));
  };

  /* -----------------------------
     Track modal handlers
  ----------------------------- */
  const openTrackModal = (track: any) => setActiveTrackModal(track);
  const closeTrackModal = () => setActiveTrackModal(null);

  const handleRemoveTrack = async () => {
    if (!playlist || !activeTrackModal) return;
    await removeTrackFromPlaylist(playlist.id, activeTrackModal);
    closeTrackModal();
  };

  /* -----------------------------
     Playlist modal handlers
  ----------------------------- */
  const openPlaylistModal = () => setActivePlaylistModal(true);
  const closePlaylistModal = () => setActivePlaylistModal(false);

  const handleRenamePlaylist = async () => {
    if (!playlist || PROTECTED.includes(playlist.name.toLowerCase())) return;

    const newName = window.prompt("Nieuwe naam voor playlist:", playlist.name);
    if (!newName || !newName.trim()) return;

    await renamePlaylist(playlist.id, newName.trim());
    closePlaylistModal();
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    if (!window.confirm(`Verwijder playlist "${playlist.name}"?`)) return;

    await deletePlaylist(playlist.id);
    navigate("/library");
  };

  if (!playlist) return <p>Playlist laden...</p>;

  const isProtected = PROTECTED.includes(playlist.name.toLowerCase());

  return (
    <div className="playlist-details-container">
      {/* Back button */}
      <button className="btn" onClick={() => navigate(-1)}>
        &lt;
      </button>

      {/* Playlist header */}
      <div className="playlist-header">
        <div className="cover-large">
          {playlist.imageUrl ? (
            <img src={playlist.imageUrl} alt={playlist.name} />
          ) : (
            <div className="cover-placeholder-large">
              <i className="bi bi-music-note-beamed"></i>
            </div>
          )}
        </div>

        <div className="playlist-meta">
          <h2 className="playlist-name">{playlist.name}</h2>
          <p className="playlist-desc">{playlist.description}</p>
          <div className="playlist-stats">
            {playlist.tracks?.length ?? 0} nummers
          </div>
        </div>

        {/* Playlist 3-dots */}
        {!isProtected && (
          <button
            className="btn btn-outline-secondary"
            onClick={openPlaylistModal}
          >
            <i className="bi bi-three-dots"></i>
          </button>
        )}
      </div>

      {/* Track list */}
      <div className="track-list">
        {(playlist.tracks ?? []).map((t, idx) => (
          <div
            key={t.id || idx}
            className="track-row"
            onClick={() => t.preview_url && togglePlay(t.preview_url)}
          >
            <div className="track-index">{idx + 1}</div>
            <div className="track-thumb">
              {t.album?.images?.[0]?.url ? (
                <img src={t.album.images[0].url} alt={t.name} />
              ) : (
                <div className="thumb-placeholder">
                  <i className="bi bi-music-note"></i>
                </div>
              )}
            </div>
            <div className="track-meta">
              <div className="track-name">{t.name}</div>
              <div className="track-artist">
                {(t.artists || []).map((a: any) => a.name).join(", ")}
              </div>
            </div>

            {/* Track 3-dots */}
            {!isProtected && (
              <button
                className="track-menu-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openTrackModal(t);
                }}
              >
                <i className="bi bi-three-dots"></i>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Playlist Modal */}
      <ModalMenu
        show={activePlaylistModal}
        onClose={closePlaylistModal}
        onRename={handleRenamePlaylist}
        onDelete={handleDeletePlaylist}
        disableRename={isProtected}
      />

      {/* Track Modal */}
      <ModalMenu
        show={!!activeTrackModal}
        onClose={closeTrackModal}
        onDelete={handleRemoveTrack} // geen onRename
      />
    </div>
  );
};

export default PlaylistDetails;
