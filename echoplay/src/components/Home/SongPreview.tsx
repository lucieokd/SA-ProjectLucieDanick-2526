import React, { useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import LoadingSpinner from "../Spotify/LoadingSpinner";
import Errormessage from "../Spotify/Errormessage";
import { useFavouriteArtists } from "../../contexts/FavouriteArtistsContext";
import {
  fetchPreviewUrl,
  fetchMetadataByArtist,
} from "../../API/ITunesSearchServices";
import {
  getOrCreateFavorites,
  findPlaylistByName,
  addTrackToPlaylist,
  subscribePlaylists,
  Playlist,
} from "../../services/playlistService";
import { auth } from "../../firebase/firebaseConfig";

interface TrackMeta {
  id: string;
  name: string;
  artist: string;
  album: string;
  artwork: string | null;
  preview_url: string | null | undefined;
}

const SongPreview: React.FC = () => {
  const { favArtists } = useFavouriteArtists();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [tracks, setTracks] = useState<TrackMeta[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const currentTrack = tracks[currentIndex];
  const userId = auth.currentUser?.uid;

  // Fetch playlists
  useEffect(() => {
    // Guard: alleen subscriben als userId bestaat
    if (!userId) {
      setPlaylists([]);
      return;
    }

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = subscribePlaylists(userId, (fetchedPlaylists) => {
        setPlaylists(fetchedPlaylists);
      });
    } catch (err) {
      console.error("Error subscribing to playlists:", err);
      setPlaylists([]);
    }

    // Cleanup functie
    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.error("Error unsubscribing from playlists:", err);
        }
      }
    };
  }, [userId]); // ✅ userId in dependencies

  // Load initial metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        setError(null);

        const artists = favArtists.length
          ? favArtists.map((a) => a.name)
          : ["Taylor Swift", "Drake", "Rihanna"];

        const results: TrackMeta[] = [];

        for (const artist of artists) {
          const meta = await fetchMetadataByArtist(artist);
          results.push(...meta);
        }

        const unique = Array.from(
          new Map(results.map((t) => [t.id, t])).values(),
        );

        // Shuffle tracks
        for (let i = unique.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [unique[i], unique[j]] = [unique[j], unique[i]];
        }

        const limitedTracks = unique.slice(0, 150);
        setTracks(limitedTracks);
        setCurrentIndex(0);
      } catch (e: any) {
        setError("Kon aanbevelingen niet laden");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, [favArtists]);

  // Load preview for current track
  const ensurePreviewLoaded = async (index: number) => {
    if (index < 0 || index >= tracks.length) return;

    const track = tracks[index];
    if (!track || track.preview_url !== undefined) return;

    try {
      const preview = await fetchPreviewUrl(track.id);
      setTracks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, preview_url: preview } : t)),
      );
    } catch {
      setTracks((prev) =>
        prev.map((t, i) => (i === index ? { ...t, preview_url: null } : t)),
      );
    }
  };

  useEffect(() => {
    if (!tracks.length) return;

    ensurePreviewLoaded(currentIndex);
    if (currentIndex + 1 < tracks.length) {
      ensurePreviewLoaded(currentIndex + 1);
    }
  }, [currentIndex, tracks]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);

    if (currentTrack?.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Toggle play/pause
  const togglePlay = async () => {
    if (!audioRef.current || !currentTrack?.preview_url) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  // Add to favorites
  const handleFavorite = async () => {
    if (!currentTrack) return;

    try {
      const favName = "Favorites";
      let favPlaylist = await findPlaylistByName(userId, favName);

      if (!favPlaylist) {
        const newId = await getOrCreateFavorites(userId);
        favPlaylist = { id: newId };
      }
      await addTrackToPlaylist(favPlaylist.id, currentTrack);
      showToast("Toegevoegd aan favorieten");
    } catch (err) {
      console.error("Error adding to favorites:", err);
      showToast("Fout bij toevoegen aan favorieten", "error");
    }
  };

  const next = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translate(-50%, 100%);
        }
        to {
          transform: translate(-50%, 0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (loading) return <LoadingSpinner message="Aanbevelingen laden..." />;
  if (error) return <Errormessage error={error} />;
  if (!tracks.length || !currentTrack)
    return <Errormessage message="Geen tracks gevonden" />;

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <audio ref={audioRef} />

      <div
        className="card shadow-lg border-0 text-center"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <button
              className="btn btn-light rounded-circle shadow-sm"
              onClick={prev}
              disabled={currentIndex === 0}
              style={{
                marginRight: "15px",
                color: "purple",
              }}
            >
              <IoChevronBack size={22} />
            </button>

            <img
              src={currentTrack.artwork || "/placeholder-artwork.png"}
              alt={currentTrack.name}
              className="img-fluid shadow"
              style={{
                width: "260px",
                height: "260px",
                objectFit: "cover",
                borderRadius: "16px",
              }}
              onError={(e) => {
                e.currentTarget.src = "/placeholder-artwork.png";
              }}
            />

            <button
              className="btn btn-light rounded-circle shadow-sm"
              onClick={next}
              disabled={currentIndex === tracks.length - 1}
              style={{
                marginLeft: "15px",
                color: "purple",
              }}
            >
              <IoChevronForward size={22} />
            </button>
          </div>

          <h4 className="fw-bold mb-1 text-dark">{currentTrack.name}</h4>
          <p className="mb-0 text-muted">{currentTrack.artist}</p>
          <p className="small text-muted">{currentTrack.album}</p>

          <div className="mt-4">
            {currentTrack.preview_url ? (
              <button
                onClick={togglePlay}
                className={`btn btn-lg px-4 ${
                  isPlaying ? "btn-danger" : "btn-primary"
                }`}
                style={{
                  borderRadius: "30px",
                  backgroundColor: "purple",
                  border: "none",
                }}
              >
                {isPlaying ? (
                  <>
                    <i className="bi bi-pause-fill me-2"></i> Pauzeren
                  </>
                ) : (
                  <>
                    <i className="bi bi-play-fill me-2"></i> Afspelen
                  </>
                )}
              </button>
            ) : currentTrack.preview_url === null ? (
              <div className="text-muted small">Geen preview beschikbaar</div>
            ) : (
              <div className="text-muted small">Preview laden…</div>
            )}
          </div>

          <div className="d-flex justify-content-center mt-4 gap-3">
            <button
              onClick={handleFavorite}
              className="btn btn-outline-danger rounded-circle"
              title="Toevoegen aan favorieten"
              style={{ width: "52px", height: "52px" }}
            >
              <i className="bi bi-bookmark-heart"></i>
            </button>
            <button
              className="btn btn-outline-secondary rounded-circle"
              style={{ width: "50px", height: "50px" }}
              onClick={() => setShowPlaylistModal(true)}
              aria-label="Toevoegen aan playlist"
            >
              <i className="bi bi-plus-circle"></i>
            </button>
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
                    try {
                      await addTrackToPlaylist(pl.id, currentTrack);
                      setShowPlaylistModal(false);
                      showToast(`Toegevoegd aan ${pl.name}`);
                    } catch (error) {
                      console.error("Error adding to playlist:", error);
                      showToast("Kon niet toevoegen aan playlist", "error");
                    }
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
        </div>
      )}
      {toast && (
        <div
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 px-4 py-3 shadow"
          style={{
            backgroundColor: toast.type === "success" ? "#6c2bd9" : "#dc3545",
            color: "white",
            borderRadius: "12px",
            zIndex: 2000,
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default SongPreview;
