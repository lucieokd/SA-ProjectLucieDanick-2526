import React, { useState, useEffect, useRef } from "react";
import { getToken, getTrendingArtists } from "../../API/SpotifyCred";
import { useFavouriteArtists } from "../../contexts/FavouriteArtistsContext";
import { AiOutlineSearch, AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Artist {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  genres?: Array<string>;
  followers?: { total: number };
  popularity?: number;
}

interface ArtistSelectionProps {
  onComplete?: () => void;
}

const ArtistSelection: React.FC<ArtistSelectionProps> = ({ onComplete }) => {
  const { favArtists, addArtist, removeArtist, isFollowing } = useFavouriteArtists();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [trendingArtists, setTrendingArtists] = useState<Artist[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Laad trending artiesten bij mount
  useEffect(() => {
    const loadTrendingArtists = async () => {
      try {
        setLoadingTrending(true);
        const artists = await getTrendingArtists(20);
        setTrendingArtists(artists);
      } catch (error) {
        console.error("Error loading trending artists:", error);
        // Fallback naar hardcoded lijst
        setTrendingArtists([
          { name: "Drake", id: "3TVXtAsR1Inumwj472S9r4" },
          { name: "Taylor Swift", id: "06HL4z0CvFAxyc27GXpf02" },
          { name: "Rihanna", id: "5pKCCKE2ajJHZ9KAiaK11H" },
          { name: "Bad Bunny", id: "4q3ewBCX7sLwd24euuV69X" },
          { name: "Ninho", id: "6v49oH3RJl7hBGtO6MhK6U" },
        ]);
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrendingArtists();
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      const tokenData = await getToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=5`,
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
      setSearchResults(data.artists.items);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectArtist = async (artist: Artist) => {
    if (isFollowing(artist.id)) {
      await removeArtist(artist.id);
    } else {
      if (favArtists.length < 3) {
        await addArtist(artist);
      } else {
        alert("Je kunt maximaal 3 artiesten selecteren. Verwijder eerst een artiest.");
      }
    }
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleFollowTrending = async (artist: Artist) => {
    if (isFollowing(artist.id)) {
      await removeArtist(artist.id);
    } else {
      if (favArtists.length < 3) {
        await addArtist(artist);
      } else {
        alert("Je kunt maximaal 3 artiesten selecteren. Verwijder eerst een artiest.");
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="w-100">
      {/* Zoekbalk met dropdown */}
      <div className="position-relative mb-4" ref={dropdownRef}>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white border-end-0">
            <AiOutlineSearch size={20} />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Zoek artiesten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          {searchQuery && (
            <button
              className="btn btn-outline-secondary border-start-0"
              type="button"
              onClick={handleClearSearch}
              aria-label="Wis zoekopdracht"
            >
              <AiOutlineClose size={18} />
            </button>
          )}
        </div>

        {/* Dropdown met zoekresultaten */}
        {showDropdown && searchResults.length > 0 && (
          <div
            className="position-absolute w-100 bg-white border rounded-bottom shadow-lg"
            style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}
          >
            {searchResults.map((artist) => (
              <div
                key={artist.id}
                className="d-flex align-items-center justify-content-between p-3 border-bottom"
                style={{ cursor: "pointer" }}
                onClick={() => handleSelectArtist(artist)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                }}
              >
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  {artist.images && artist.images.length > 0 && (
                    <img
                      src={artist.images[2]?.url || artist.images[0]?.url}
                      alt={artist.name}
                      className="rounded-circle"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  )}
                  <div>
                    <div className="fw-semibold">{artist.name}</div>
                    {artist.genres && artist.genres.length > 0 && (
                      <small className="text-muted">{artist.genres.slice(0, 2).join(", ")}</small>
                    )}
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${
                    isFollowing(artist.id) ? "btn-success" : "btn-outline-primary"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectArtist(artist);
                  }}
                >
                  {isFollowing(artist.id) ? (
                    "Volgt"
                  ) : (
                    <>
                      <AiOutlinePlus size={16} className="me-1" />
                      Volgen
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="position-absolute w-100 bg-white border rounded-bottom p-3 text-center">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="visually-hidden">Zoeken...</span>
            </div>
          </div>
        )}
      </div>

      {/* Geselecteerde artiesten */}
      {favArtists.length > 0 && (
        <div className="mb-4">
          <h6 className="mb-3 fw-semibold">Jouw top {favArtists.length} artiesten:</h6>
          <div className="d-flex flex-wrap gap-2">
            {favArtists.map((artist) => (
              <div
                key={artist.id}
                className="d-flex align-items-center gap-2 bg-light rounded-pill px-3 py-2"
              >
                <span className="fw-semibold">{artist.name}</span>
                <button
                  className="btn btn-sm p-0"
                  onClick={() => removeArtist(artist.id)}
                  aria-label={`Verwijder ${artist.name}`}
                >
                  <AiOutlineClose size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending artiesten */}
      <div className="mt-4">
        <h6 className="mb-3 fw-semibold">Populaire artiesten:</h6>
        
        {loadingTrending ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Trending artiesten laden...</span>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {trendingArtists.slice(0, 15).map((artist) => {
              const isFollowingTrend = isFollowing(artist.id);
              return (
                <button
                  key={artist.id}
                  className={`btn ${
                    isFollowingTrend ? "btn-success" : "btn-outline-primary"
                  } rounded-pill`}
                  onClick={() => handleFollowTrending(artist)}
                  disabled={loading || (!isFollowingTrend && favArtists.length >= 3)}
                >
                  {isFollowingTrend ? "✓ Volgt" : `+ ${artist.name}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-4">
        <div className="progress" style={{ height: "8px" }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${(favArtists.length / 3) * 100}%`,
              backgroundColor: "#6c2bd9",
            }}
            aria-valuenow={favArtists.length}
            aria-valuemin={0}
            aria-valuemax={3}
          ></div>
        </div>
        <small className="text-muted mt-1 d-block text-center">
          {favArtists.length} van 3 artiesten geselecteerd
        </small>
      </div>
    </div>
  );
};

export default ArtistSelection;