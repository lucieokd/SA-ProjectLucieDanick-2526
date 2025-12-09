import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../API/SpotifyCred";
import { getPreviewUrlFromITunes } from "../../API/ITunesSearchServices";
import {
  createPlaylist,
  findPlaylistByName,
  addTrackToPlaylist,
  subscribePlaylists,
  Playlist,
} from "../../services/playlistService";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { name: string; images: Array<{ url: string }> };
  artists: Array<{ id: string; name: string }>;
}

interface SearchedSongProps {
  track: Track;
}

const SearchedSong: React.FC<SearchedSongProps> = ({ track }) => {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

  // Haal preview URL op wanneer gebruiker op play klikt
  const handlePlayClick = async () => {
    if (previewUrl) {
      // Preview al opgehaald, speel af
      togglePlayback();
      return;
    }

    // Haal preview URL op
    setLoadingPreview(true);
    try {
      const artistName = track.artists[0]?.name || '';
      const trackName = track.name || '';
      const itunesPreviewUrl = await getPreviewUrlFromITunes(trackName, artistName);
      setPreviewUrl(itunesPreviewUrl);
      
      if (itunesPreviewUrl) {
        // Start playback direct na het ophalen
        setTimeout(() => togglePlayback(), 100);
      } else {
        alert("Geen preview beschikbaar voor dit nummer.");
      }
    } catch (error) {
      console.error("Error fetching preview:", error);
      alert("Fout bij ophalen preview.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const togglePlayback = async () => {
    if (!audioRef.current || !previewUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (audioRef.current.readyState === 0) audioRef.current.load();
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      alert("Kon audio niet afspelen.");
    }
  };

  const handleArtistSearch = async (artistName: string) => {
    try {
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

      if (response.ok) {
        const data = await response.json();
        const artistNameFromSpotify = data.artists.items[0]?.name || artistName;
        navigate(`/Artistinfo?artist=${encodeURIComponent(artistNameFromSpotify)}`);
      }
    } catch (error) {
      console.error("Fout bij het ophalen van artiestgegevens:", error);
    }
  };

  const handleFavorite = async () => {
    try {
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
      await addTrackToPlaylist(favPlaylist.id, { ...track, preview_url: previewUrl });
      alert("Toegevoegd aan favorieten!");
    } catch (err) {
      console.error("Error adding to favorites:", err);
      alert("Fout bij toevoegen aan favorieten.");
    }
  };

  const handleAddToPlaylist = () => {
    setShowPlaylistModal(true);
  };

  return (
    <div className="col-12">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          {/* Audio element */}
          {previewUrl && (
            <audio
              ref={audioRef}
              src={previewUrl}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              preload="none"
            />
          )}

          <div className="d-flex align-items-center gap-3">
            {track.album.images.length > 0 && (
              <img
                src={track.album.images[2]?.url || track.album.images[0]?.url}
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

            {/* Control buttons */}
            <div className="d-flex gap-2 align-items-center">
              <button
                className={`btn btn-sm ${isPlaying ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={handlePlayClick}
                disabled={loadingPreview}
                aria-label={isPlaying ? "Pauzeren" : "Afspelen"}
              >
                {loadingPreview ? (
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                ) : isPlaying ? (
                  <i className="bi bi-pause-fill"></i>
                ) : (
                  <i className="bi bi-play-fill"></i>
                )}
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleFavorite}
                aria-label="Toevoegen aan favorieten"
              >
                <i className="bi bi-heart"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={handleAddToPlaylist}
                aria-label="Toevoegen aan playlist"
              >
                <i className="bi bi-plus-circle"></i>
              </button>
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
            className="position-fixed start-50 translate-middle-x bg-white shadow-lg p-3"
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
                    await addTrackToPlaylist(pl.id, { ...track, preview_url: previewUrl });
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
                <p className="text-muted text-center py-3">
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

export default SearchedSong;
