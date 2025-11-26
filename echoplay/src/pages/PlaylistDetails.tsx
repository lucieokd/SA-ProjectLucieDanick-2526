// src/pages/PlaylistDetails.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribePlaylists, Playlist } from "../services/playlistService";
import "../styles/PlaylistDetails.css";

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribePlaylists((items) => setAllPlaylists(items));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    const pl = allPlaylists.find((p) => p.id === id) || null;
    setPlaylist(pl);
  }, [allPlaylists, id]);

  const togglePlay = (previewUrl?: string | null) => {
    if (!previewUrl) return;
    if (playingUrl === previewUrl) {
      audioRef.current?.pause();
      setPlayingUrl(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio(previewUrl);
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.onended = () => setPlayingUrl(null);
      audioRef.current
        .play()
        .then(() => setPlayingUrl(previewUrl))
        .catch(() => {
          alert("Kon audio niet afspelen.");
        });
      return;
    }

    audioRef.current.pause();
    audioRef.current = new Audio(previewUrl);
    audioRef.current.crossOrigin = "anonymous";
    audioRef.current.onended = () => setPlayingUrl(null);
    audioRef.current
      .play()
      .then(() => setPlayingUrl(previewUrl))
      .catch(() => {
        alert("Kon audio niet afspelen.");
      });
  };

  if (!playlist) {
    return (
      <div className="playlist-details-container">
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <p>Playlist laden…</p>
      </div>
    );
  }

  return (
    <div className="playlist-details-container">
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
      </div>

      <div className="track-list">
        {(playlist.tracks ?? []).map((t: any, idx: number) => (
          <div className="track-row" key={t.id ?? `${idx}-${t.name}`}>
            <div className="track-index">{idx + 1}</div>

            <div className="track-thumb">
              {t.album?.images?.[0]?.url ? (
                <img src={t.album.images[0].url} alt={t.album?.name} />
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

            <div className="track-actions">
              {t.preview_url ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => togglePlay(t.preview_url)}
                >
                  {playingUrl === t.preview_url ? (
                    <i className="bi bi-pause-fill"></i>
                  ) : (
                    <i className="bi bi-play-fill"></i>
                  )}
                </button>
              ) : (
                <small className="text-muted">Geen preview</small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistDetails;
