import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getTracksFromITunes } from "../../API/ITunesSearchServices";
import { getToken } from "../../API/SpotifyCred";
import LoadingSpinner from "../Spotify/LoadingSpinner";
import Errormessage from "../Spotify/Errormessage";
import {
  createPlaylist,
  findPlaylistByName,
  addTrackToPlaylist,
  subscribePlaylists,
  Playlist,
} from "../../services/playlistService";
import {
  getOrCreateFavoritesPlaylist,
  addSongToPlaylist,
} from "../../services/playlistSongService";
import { useFavouriteArtists } from "../../contexts/FavouriteArtistsContext";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { name: string; images: Array<{ url: string }> };
  artists: Array<{ name: string }>;
}

const SongPreview = () => {
  const navigate = useNavigate();
  const { favArtists } = useFavouriteArtists();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Haal favoriete artiest namen op
        const favoriteArtistNames = favArtists.map(artist => artist.name);
        
        // Als er favoriete artiesten zijn, gebruik die, anders gebruik Spotify Top 50
        const tracksData = await getTracksFromITunes(
          favoriteArtistNames,
          150
        );
        
        if (!tracksData || tracksData.length === 0) {
          setError("Geen tracks gevonden");
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
  }, [favArtists]);

  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);


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
    <div 
      className="position-relative w-100 d-flex align-items-center justify-content-center"
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem'
      }}
    >
      {/* Navigation buttons */}
      <button
        className="btn btn-light rounded-circle position-absolute d-none d-md-flex align-items-center justify-content-center"
        style={{
          left: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          zIndex: 10,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
        onClick={goToPreviousTrack}
        disabled={currentTrackIndex === 0}
      >
        <IoChevronBack size={24} />
      </button>
      <button
        className="btn btn-light rounded-circle position-absolute d-none d-md-flex align-items-center justify-content-center"
        style={{
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '50px',
          height: '50px',
          zIndex: 10,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
        onClick={goToNextTrack}
        disabled={currentTrackIndex === tracks.length - 1}
      >
        <IoChevronForward size={24} />
      </button>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-body p-4 p-md-5 text-center">
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
                <div className="mb-4">
                  {currentTrack.album.images.length > 0 ? (
                    <img
                      src={currentTrack.album.images[0].url}
                      alt={currentTrack.album.name}
                      className="img-fluid rounded shadow"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        aspectRatio: '1',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <div 
                      className="mx-auto d-flex align-items-center justify-content-center rounded shadow"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        aspectRatio: '1',
                        backgroundColor: 'rgba(108, 43, 217, 0.2)',
                        color: '#6c2bd9'
                      }}
                    >
                      <i className="bi bi-music-note-beamed" style={{ fontSize: '4rem' }}></i>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mb-4">
                  <h2 className="h3 fw-bold mb-3" style={{ color: '#333' }}>
                    {currentTrack.name}
                  </h2>
                  <p className="h5 mb-2" style={{ color: '#666' }}>
                    {currentTrack.artists.map((artist, index) => (
                      <span key={index}>
                        <span
                          onClick={async () => {
                            try {
                              const tokenData = await getToken();
                              const response = await fetch(
                                `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                                  artist.name
                                )}&type=artist`,
                                {
                                  method: "GET",
                                  headers: {
                                    Authorization: "Bearer " + tokenData.access_token,
                                    "Content-Type": "application/json",
                                  },
                                }
                              );
                              if (response.ok) {
                                const data = await response.json();
                                const artistNameFromSpotify = data.artists.items[0]?.name || artist.name;
                                navigate(`/Artistinfo?artist=${encodeURIComponent(artistNameFromSpotify)}`);
                              }
                            } catch (error) {
                              console.error("Fout bij het ophalen van artiestgegevens:", error);
                            }
                          }}
                          className="text-decoration-none link-primary"
                          style={{ cursor: 'pointer' }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              // Trigger click
                            }
                          }}
                        >
                          {artist.name}
                        </span>
                        {index < currentTrack.artists.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                  <p className="text-muted mb-0">{currentTrack.album.name}</p>
                </div>

                {/* Controls */}
                <div className="mb-4">
                  {currentTrack.preview_url ? (
                    <button
                      onClick={togglePlayback}
                      className={`btn btn-lg ${isPlaying ? 'btn-danger' : 'btn-primary'} rounded-pill px-5`}
                      style={{ minWidth: '150px' }}
                    >
                      {isPlaying ? (
                        <>
                          <i className="bi bi-pause-fill me-2"></i>
                          Pauze
                        </>
                      ) : (
                        <>
                          <i className="bi bi-play-fill me-2"></i>
                          Afspelen
                        </>
                      )}
                    </button>
                  ) : (
                    <p className="text-muted mb-0">Geen preview beschikbaar</p>
                  )}
                </div>

                {/* Extra buttons */}
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-outline-danger rounded-circle"
                    style={{ width: '50px', height: '50px' }}
                    onClick={handleFavorite}
                    aria-label="Toevoegen aan favorieten"
                  >
                    <i className="bi bi-heart"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary rounded-circle"
                    style={{ width: '50px', height: '50px' }}
                    onClick={() => setShowPlaylistModal(true)}
                    aria-label="Toevoegen aan playlist"
                  >
                    <i className="bi bi-plus-circle"></i>
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="d-flex d-md-none justify-content-between align-items-center mt-4 pt-3 border-top">
                  <button
                    className="btn btn-outline-primary rounded-circle"
                    style={{ width: '45px', height: '45px' }}
                    onClick={goToPreviousTrack}
                    disabled={currentTrackIndex === 0}
                  >
                    <IoChevronBack size={20} />
                  </button>
                  <span className="text-muted small">
                    {currentTrackIndex + 1} / {tracks.length}
                  </span>
                  <button
                    className="btn btn-outline-primary rounded-circle"
                    style={{ width: '45px', height: '45px' }}
                    onClick={goToNextTrack}
                    disabled={currentTrackIndex === tracks.length - 1}
                  >
                    <IoChevronForward size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(2px)",
            zIndex: 1050,
          }}
          onClick={() => setShowPlaylistModal(false)}
        >
          <div
            className="position-fixed start-50 translate-middle-x bg-white shadow-lg p-4"
            style={{
              bottom: 0,
              width: "100%",
              maxWidth: "450px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              animation: "slideUp 0.3s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-semibold">Kies playlist</h5>
              <button
                className="btn-close"
                onClick={() => setShowPlaylistModal(false)}
              ></button>
            </div>

            <div className="d-flex flex-column gap-2">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  className="btn btn-outline-primary text-start"
                  style={{
                    border: "2px solid #6c2bd9",
                    borderRadius: "10px",
                    padding: "10px 15px",
                    transition: "all 0.2s ease",
                  }}
                  onClick={async () => {
                    await addTrackToPlaylist(pl.id, currentTrack);
                    setShowPlaylistModal(false);
                    alert(`Toegevoegd aan ${pl.name}!`);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#6c2bd9";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#6c2bd9";
                  }}
                >
                  {pl.name}
                </button>
              ))}
              {playlists.length === 0 && (
                <p className="text-muted text-center py-3 mb-0">
                  Geen playlists gevonden. Maak eerst een playlist aan.
                </p>
              )}
            </div>
          </div>

          <style>
            {`
              @keyframes slideUp {
                from {
                  transform: translate(-50%, 100%);
                  opacity: 0;
                }
                to {
                  transform: translate(-50%, 0);
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default SongPreview;
