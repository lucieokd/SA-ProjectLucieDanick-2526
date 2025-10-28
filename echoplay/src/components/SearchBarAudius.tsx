import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { sdk } from "@audius/sdk";
import { playTrack } from "./Player";
import { IoPlay } from "react-icons/io5";

interface Track {
  id: string;
  title: string;
  user?: {
    name: string;
  };
  artwork?: any;
  favorite_count?: number;
  play_count?: number;
}

const SearchBarAudius = () => {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);

  const audiusSdk = sdk({ appName: "EchoPlay" });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { data } = await audiusSdk.tracks.searchTracks({
        query,
      });
      setTracks(data || []);
      console.log("Audius results:", data);
    } catch (error) {
      console.error("Audius API error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Search bar */}
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search tracks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-lg px-4"
              style={{
                backgroundColor: "#6c2bd9",
                border: "none",
                color: "white"
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading tracks...</p>
        </div>
      )}

      {/* Track results */}
      <div className="row g-4">
        {tracks.length > 0 &&
          tracks.map((track) => {
            const streamUrl = `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`;

            return (
              <div key={track.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    {/* Album art */}
                    {track.artwork && track.artwork['150x150'] && (
                      <div className="text-center mb-3">
                        <img
                          src={track.artwork['150x150']}
                          alt={track.title}
                          className="img-fluid rounded"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      </div>
                    )}

                    <h5 className="card-title fw-bold">{track.title}</h5>
                    <p className="card-text text-muted">
                      {track.user?.name || "Unknown Artist"}
                    </p>

                    {/* Popularity */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted">
                        ❤️ {track.favorite_count || 0} favorites
                      </small>
                      <small className="text-muted">
                        ▶️ {track.play_count || 0} plays
                      </small>
                    </div>

                    {/* Play button */}
                    <button
                      className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        backgroundColor: "#6c2bd9",
                        border: "none",
                        color: "white",
                        borderRadius: "8px"
                      }}
                      onClick={() => {
                        playTrack({
                          title: track.title,
                          artist: track.user?.name || "Unknown Artist",
                          cover: track.artwork?.["150x150"] || "/src/assets/cover.jpg",
                          src: streamUrl
                        });
                      }}
                    >
                      <IoPlay size={16} />
                      Play Track
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {!loading && tracks.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No results yet — try searching 🎶</p>
        </div>
      )}
    </div>
  );
};

export default SearchBarAudius;
