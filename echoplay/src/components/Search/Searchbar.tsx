import React, { useState, useEffect, useRef } from "react";
import { getToken, getTrackInfo, getArtistInfo } from "../../API/SpotifyCred";
import { ITunesFetchArtist, getPreviewUrlFromITunes } from "../../API/ITunesSearchServices";
import { AiOutlineSearch } from "react-icons/ai";
import ErrorMessage from "../ErrorMessage";
import { useNavigate } from "react-router-dom";
import {
  createPlaylist,
  findPlaylistByName,
  addTrackToPlaylist,
  subscribePlaylists,
  Playlist,
} from "../../services/playlistService";
import "bootstrap-icons/font/bootstrap-icons.css";


interface Artist {
  id: string;
  name: string;
  genres: Array<string>;
  images: Array<{ url: string }>;
  followers: {
    total: number;
  };
  popularity: number;
}

interface Track {
  id: string;
  name: string;
  preview_url: string | null;
  album: { name: string; images: Array<{ url: string }> };
  artists: Array<{ id: string; name: string }>;
}

const Searchbar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceTimer = useRef(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const handleArtistSearch = async (artistName: string) => {
    try {
      setLoading(true);
      setError(null);

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Voor test: log de naam van de artiest in de console
      console.log("Geselecteerde artiest:", artistName);
      const data = await response.json();
      const artistNameFromSpotify = data.artists.items[0]?.name || artistName;
      
      navigate(`/Artistinfo?artist=${encodeURIComponent(artistNameFromSpotify)}`);
    } catch (error) {
      console.error("Fout bij het ophalen van artiestgegevens:", error);
      setError('Er is een fout opgetreden bij het zoeken naar artiesten');
      setSearchTerm('');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setTracks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + tokenData.access_token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const spotifyTracks = data.tracks.items;

      // Haal preview URLs op via iTunes API voor elke track
      const tracksWithITunesPreview = await Promise.all(
        spotifyTracks.map(async (track: any) => {
          const artistName = track.artists[0]?.name || '';
          const trackName = track.name || '';
          
          // Haal preview URL op via iTunes
          const itunesPreviewUrl = await getPreviewUrlFromITunes(trackName, artistName);
          
          // Gebruik iTunes preview URL als die beschikbaar is, anders null
          return {
            ...track,
            preview_url: itunesPreviewUrl || null,
          };
        })
      );

      setTracks(tracksWithITunesPreview);
    } catch (err) {
      setError(err.message || "Er is een fout opgetreden bij het zoeken");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    performSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      performSearch(newQuery);
    }, 500); // Wait 500ms after user stops typing
  };

  // Subscribe to playlists for modal
  useEffect(() => {
    const unsub = subscribePlaylists((items) => setPlaylists(items));
    return () => unsub();
  }, []);

  // Cleanup timer and audio on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      // Cleanup all audio refs
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Toggle playback for a track
  const togglePlayback = async (track: Track) => {
    const audio = audioRefs.current[track.id];
    
    if (!audio || !track.preview_url) {
      alert("Geen preview beschikbaar voor dit nummer.");
      return;
    }

    try {
      // Stop all other tracks
      Object.entries(audioRefs.current).forEach(([id, aud]) => {
        if (id !== track.id && aud) {
          aud.pause();
          aud.currentTime = 0;
        }
      });

      if (playingTrackId === track.id) {
        // Pause current track
        audio.pause();
        setPlayingTrackId(null);
      } else {
        // Play selected track
        if (audio.readyState === 0) audio.load();
        await audio.play();
        setPlayingTrackId(track.id);
      }
    } catch (err) {
      console.error("Error playing audio:", err);
      alert("Kon audio niet afspelen.");
    }
  };

  // Handle audio ended
  const handleAudioEnded = (trackId: string) => {
    setPlayingTrackId(null);
  };

  // Handle favorite button
  const handleFavorite = async (track: Track) => {
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
      await addTrackToPlaylist(favPlaylist.id, track);
      alert("Toegevoegd aan favorieten!");
    } catch (err) {
      console.error("Error adding to favorites:", err);
      alert("Fout bij toevoegen aan favorieten.");
    }
  };

  // Handle add to playlist button
  const handleAddToPlaylist = (track: Track) => {
    setSelectedTrack(track);
    setShowPlaylistModal(true);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control"
            placeholder="Zoek liedjes, artiesten..."
            value={query}
            onChange={handleInputChange}
            aria-label="Zoek liedjes, artiesten..."
          />
          <button 
            className="btn btn-outline-secondary" 
            type="submit" 
            disabled={loading}
            aria-label="Zoeken"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <AiOutlineSearch size={20} />
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-3">
          <ErrorMessage text={error} />
        </div>
      )}

      <div className="row g-3">
        {tracks.length > 0
          ? tracks.map((track) => (
              <div key={track.id} className="col-12">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    {/* Audio element */}
                    {track.preview_url && (
                      <audio
                        ref={(el) => {
                          audioRefs.current[track.id] = el;
                        }}
                        src={track.preview_url}
                        onEnded={() => handleAudioEnded(track.id)}
                        onPlay={() => setPlayingTrackId(track.id)}
                        onPause={() => {
                          if (playingTrackId === track.id) {
                            setPlayingTrackId(null);
                          }
                        }}
                        preload="none"
                      />
                    )}
                    
                    <div className="d-flex align-items-center gap-3">
                      {track.album.images.length > 0 && (
                        <img
                          src={
                            track.album.images[2]?.url || track.album.images[0]?.url
                          }
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
                        {track.preview_url ? (
                          <button
                            className={`btn btn-sm ${playingTrackId === track.id ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => togglePlayback(track)}
                            aria-label={playingTrackId === track.id ? "Pauzeren" : "Afspelen"}
                          >
                            <i className={`bi ${playingTrackId === track.id ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
                          </button>
                        ) : (
                          <span className="text-muted small">Geen preview</span>
                        )}
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleFavorite(track)}
                          aria-label="Toevoegen aan favorieten"
                        >
                          <i className="bi bi-heart"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleAddToPlaylist(track)}
                          aria-label="Toevoegen aan playlist"
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : !loading && (
              <div className="col-12">
                <div className="text-center text-muted py-5">
                  <p className="mb-0">
                    {query
                      ? "Geen resultaten gevonden — probeer iets anders"
                      : "Zoek naar songs om resultaten te zien..."}
                  </p>
                </div>
              </div>
            )}
        {loading && (
          <div className="col-12">
            <div className="text-center text-muted py-5">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">Laden...</span>
              </div>
              <p className="mb-0">Zoeken naar "{query}"...</p>
            </div>
          </div>
        )}
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && selectedTrack && (
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
                    await addTrackToPlaylist(pl.id, selectedTrack);
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

export default Searchbar;
