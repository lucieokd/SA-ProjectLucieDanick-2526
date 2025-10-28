import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { sdk } from "@audius/sdk";
import { playTrack } from "../Player";
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

interface TrendingSoundsProps {
  title: string;
}

const TrendingSounds = ({ title }: TrendingSoundsProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const audiusSdk = sdk({ appName: "EchoPlay" });

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const { data } = await audiusSdk.tracks.getTrendingTracks({
          limit: 3, // get top 10 tracks
        });
        setTracks(data || []);
      } catch (err) {
        console.error("Audius API error:", err);
        setError("Failed to fetch trending tracks");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading trending tracks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="h3 fw-bold text-center mb-4" style={{ color: "#6c2bd9" }}>
        {title}
      </h2>

      <div className="row g-4">
        {tracks.map((track) => {
          const streamUrl = `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`;

          return (
            <div key={track.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  {/* Album art */}
                  {track.artwork?.["150x150"] && (
                    <div className="text-center mb-3">
                      <img
                        src={track.artwork["150x150"]}
                        alt={track.title}
                        className="img-fluid rounded"
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                      />
                    </div>
                  )}

                  <h5 className="card-title fw-bold">{track.title}</h5>
                  <p className="card-text text-muted">{track.user?.name}</p>

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
                      console.log("Play button clicked for track:", track.title);
                      const streamUrl = `https://discoveryprovider.audius.co/v1/tracks/${track.id}/stream`;
                      const trackData = {
                        title: track.title,
                        artist: track.user?.name || "Unknown Artist",
                        cover: track.artwork?.["150x150"] || "/src/assets/cover.jpg",
                        src: streamUrl
                      };
                      console.log("Calling playTrack with:", trackData);
                      playTrack(trackData);
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
    </div>
  );
};

export default TrendingSounds;
