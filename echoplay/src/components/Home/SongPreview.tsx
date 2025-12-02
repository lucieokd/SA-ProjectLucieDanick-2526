import React, { useState, useEffect, useRef } from "react";
import { getTracksFromITunes } from "../../API/ITunesSearchServices";
import LoadingSpinner from "../Spotify/LoadingSpinner";
import Errormessage from "../Spotify/Errormessage";
import {
  createPlaylist,
  findPlaylistByName,
  addTrackToPlaylist,
  subscribePlaylists,
  Playlist,
} from "../../services/playlistService";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/SongPreview.css";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { name: string; images: Array<{ url: string }> };
  artists: Array<{ name: string }>;
}

const SongPreview = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  // ----------------------------------------------------
  // Fetch iTunes tracks
  // ----------------------------------------------------
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const tracksData = await getTracksFromITunes(
          [
            "Ninho",
            "Aya Nakamura",
            "Damso",
            "Angèle",
            "Stromae",
            "Booba",
            "PNL",
          ],
          [],
          150
        );
        if (!tracksData || tracksData.length === 0) {
          setError("Geen tracks gevonden via iTunes");
          return;
        }
        setTracks(tracksData);
      } catch (err: any) {
        setError(err.message || "Er is een fout opgetreden");
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  // ----------------------------------------------------
  // Subscribe playlists for modal
  // ----------------------------------------------------
  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

  // ----------------------------------------------------
  // Audio reset on track change
  // ----------------------------------------------------
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      if (tracks[currentTrackIndex]?.preview_url) audioRef.current.load();
    }
  }, [currentTrackIndex, tracks]);

  // Navigation
  const goToNextTrack = () => {
    if (currentTrackIndex < tracks.length - 1)
      setCurrentTrackIndex((prev) => prev + 1);
  };
  const goToPreviousTrack = () => {
    if (currentTrackIndex > 0) setCurrentTrackIndex((prev) => prev - 1);
  };

  // Playback
  const togglePlayback = async () => {
    if (!audioRef.current || !currentTrack?.preview_url) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.readyState === 0) audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
      alert("Kon audio niet afspelen.");
    }
  };
  const handleAudioEnded = () => setIsPlaying(false);

  // FAVORITE BUTTON
  const handleFavorite = async () => {
    const favName = "Favorites";
    let favPlaylist = await findPlaylistByName(favName);
    if (!favPlaylist) {
      const newId = await createPlaylist({
        name: favName,
        description: "Your favorite songs",
        imageFile: null,
      });
      favPlaylist = { id: newId } as Playlist;
    }
    await addTrackToPlaylist(favPlaylist.id, currentTrack);
  };

  if (loading) return <LoadingSpinner message="Aanbevelingen laden..." />;
  if (error) return <Errormessage error={error} />;
  if (!tracks.length)
    return <Errormessage message="Geen aanbevelingen gevonden" />;

  return (
    <div className="position w-100 fyp-container">
      {/* Navigation buttons */}
      <button
        className="btn nav-button nav-button-left"
        onClick={goToPreviousTrack}
        disabled={currentTrackIndex === 0}
      >
        <IoChevronBack size={32} />
      </button>
      <button
        className="btn nav-button nav-button-right"
        onClick={goToNextTrack}
        disabled={currentTrackIndex === tracks.length - 1}
      >
        <IoChevronForward size={32} />
      </button>

      <div className="track-item">
        {/* Audio */}
        {currentTrack.preview_url && (
          <audio
            key={currentTrack.id}
            ref={audioRef}
            src={currentTrack.preview_url}
            onEnded={handleAudioEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            preload="auto"
            crossOrigin="anonymous"
          />
        )}

        {/* Cover */}
        <div className="track-cover">
          {currentTrack.album.images.length > 0 ? (
            <img
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              className="cover-image"
            />
          ) : (
            <div className="cover-placeholder">Geen cover</div>
          )}
        </div>

        {/* Info */}
        <div className="track-info">
          <h2 className="track-title">{currentTrack.name}</h2>
          <p className="track-artist">
            {currentTrack.artists.map((a) => a.name).join(", ")}
          </p>
          <p className="track-album">{currentTrack.album.name}</p>
        </div>

        {/* Controls */}
        <div className="track-controls">
          {currentTrack.preview_url ? (
            <button
              onClick={togglePlayback}
              className={`play-button ${isPlaying ? "playing" : ""}`}
            >
              {isPlaying ? "Pauze" : "Afspelen"}
            </button>
          ) : (
            <p className="no-preview">Geen preview beschikbaar</p>
          )}
        </div>

        {/* Extra buttons */}
        <div className="extra-buttons mt-3">
          <button
            className="btn btn-light rounded-circle shadow-sm me-2"
            onClick={handleFavorite}
          >
            <i className="bi bi-heart"></i>
          </button>
          <button
            className="btn btn-light rounded-circle shadow-sm me-2"
            onClick={() => setShowPlaylistModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
          </button>
        </div>
      </div>

      {/* -------------------- */}
      {/* Playlist Modal */}
      {/* -------------------- */}
      {showPlaylistModal && (
        <div
          className="playlist-popup-backdrop"
          onClick={() => setShowPlaylistModal(false)}
        >
          <div className="playlist-popup" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-semibold">Kies playlist</h5>
              <button
                className="btn-close"
                onClick={() => setShowPlaylistModal(false)}
              ></button>
            </div>

            <div className="playlist-list">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  className="playlist-item"
                  onClick={async () => {
                    await addTrackToPlaylist(pl.id, currentTrack);
                    setShowPlaylistModal(false);
                  }}
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>

          <style>
            {`
              .playlist-popup-backdrop {
                position: fixed;
                top:0; left:0;
                width:100%; height:100%;
                background-color: rgba(0,0,0,0.2);
                backdrop-filter: blur(2px);
                z-index:1050;
              }
              .playlist-popup {
                position: fixed;
                bottom:0;
                left:50%;
                transform: translateX(-50%);
                width:100%;
                max-width: 450px;
                background-color:white;
                border-top-left-radius:20px;
                border-top-right-radius:20px;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
                padding:20px;
                animation: slideUp 0.3s ease;
                z-index:1051;
              }
              @keyframes slideUp {
                from { transform: translate(-50%, 100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
              }
              .playlist-list {
                display:flex;
                flex-direction: column;
                gap:12px;
                margin-top:10px;
              }
              .playlist-item {
                border: 2px solid #6c2bd9;
                background-color:white;
                color:#6c2bd9;
                font-weight:500;
                padding:10px 15px;
                border-radius:10px;
                transition: all 0.2s ease;
                text-align:left;
              }
              .playlist-item:hover {
                background-color:#6c2bd9;
                color:white;
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default SongPreview;
