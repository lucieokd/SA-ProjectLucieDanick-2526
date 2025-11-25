import React, { useState, useEffect, useRef, useCallback } from "react";
import { getTracksFromITunes } from "../../API/ITunesSearchServices";
import LoadingSpinner from "../Spotify/LoadingSpinner";
import Errormessage from "../Spotify/Errormessage";

import {
  subscribePlaylists,
  createPlaylist,
  addTrackToPlaylist,
  findPlaylistByName,
  Playlist,
} from "../../services/playlistService";

import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/SongPreview.css";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
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
  // Subscribe playlists for modal list
  // ----------------------------------------------------
  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

  // ----------------------------------------------------
  // Reset audio on track change
  // ----------------------------------------------------
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);

      if (tracks[currentTrackIndex]?.preview_url) {
        audioRef.current.load();
      }
    }
  }, [currentTrackIndex, tracks]);

  // Navigation
  const goToNextTrack = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
    }
  };

  const goToPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
    }
  };

  // Playback controls
  const togglePlayback = async () => {
    const currentTrack = tracks[currentTrackIndex];
    if (!audioRef.current || !currentTrack.preview_url) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.readyState === 0) {
          audioRef.current.load();
        }
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
      alert("Kon audio niet afspelen.");
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // ----------------------------------------------------
  // FAVORITE BUTTON
  // ----------------------------------------------------
  const handleFavorite = async () => {
    const currentTrack = tracks[currentTrackIndex];
    const favName = "Favorite Numbers";

    // Check playlist existence
    let favPlaylist = await findPlaylistByName(favName);

    // Create if not exists
    if (!favPlaylist) {
      const newId = await createPlaylist({
        name: favName,
        description: "Your favorite songs",
        imageFile: null,
      });
      favPlaylist = { id: newId } as Playlist;
    }

    // Add track
    await addTrackToPlaylist(favPlaylist.id, currentTrack);

    alert(`${currentTrack.name} toegevoegd aan ${favName}`);
  };

  // ----------------------------------------------------
  // ADD TO PLAYLIST BUTTON (opens modal)
  // ----------------------------------------------------

  const currentTrack = tracks[currentTrackIndex];

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  if (loading) return <LoadingSpinner message="Aanbevelingen laden..." />;
  if (error) return <Errormessage error={error} />;
  if (!tracks.length)
    return <Errormessage message="Geen aanbevelingen gevonden" />;

  return (
    <div className="position w-100 fyp-container">
      {/* Left arrow */}
      <button
        className="btn nav-button nav-button-left"
        onClick={goToPreviousTrack}
        disabled={currentTrackIndex === 0}
      >
        <IoChevronBack size={32} />
      </button>

      {/* Right arrow */}
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

        {/* EXTRA BUTTONS */}
        <div className="extra-buttons mt-3">
          {/* Favorite */}
          <button className="btn btn-outline-danger" onClick={handleFavorite}>
            <i className="bi bi-heart"></i>
          </button>

          {/* Add to playlist */}
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowPlaylistModal(true)}
          >
            <i className="bi bi-plus-circle"></i>
          </button>
        </div>
      </div>

      {/* PLAYLIST MODAL */}
      {showPlaylistModal && (
        <div className="playlist-modal">
          <div className="playlist-modal-content">
            <h3>Kies playlist</h3>

            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="playlist-option"
                onClick={async () => {
                  await addTrackToPlaylist(pl.id, currentTrack);
                  setShowPlaylistModal(false);
                  alert(`${currentTrack.name} toegevoegd aan ${pl.name}`);
                }}
              >
                {pl.name}
              </div>
            ))}

            <button
              className="btn btn-secondary mt-3"
              onClick={() => setShowPlaylistModal(false)}
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongPreview;
