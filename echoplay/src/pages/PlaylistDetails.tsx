import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subscribePlaylists, Playlist, removeTrackFromPlaylist, renamePlaylist, deletePlaylist } from "../services/playlistService";
import { getPreviewUrlFromITunes } from "../API/ITunesSearchServices";
import ModalMenu from "../components/Playlist/ModalMenu";
import "../styles/PlaylistDetails.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [allPlaylists, setAllPlaylists] = useState<Playlist[]>([]);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [tracksWithITunesPreview, setTracksWithITunesPreview] = useState<any[]>([]);
  const [loadingPreviews, setLoadingPreviews] = useState(false);
  const [activePlaylistModal, setActivePlaylistModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const PROTECTED = ["favorites", "my songs"];
  
  const isProtected = playlist ? PROTECTED.includes(playlist.name.toLowerCase()) : false;

  /* -----------------------------
     Realtime playlist updates
  ----------------------------- */
  useEffect(() => {
    const unsub = subscribePlaylists((items) => setAllPlaylists(items));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!id) return;
    setPlaylist(allPlaylists.find((p) => p.id === id) || null);
  }, [allPlaylists, id]);

  // Haal iTunes preview URLs op voor alle tracks
  useEffect(() => {
    const fetchITunesPreviews = async () => {
      if (!playlist?.tracks || playlist.tracks.length === 0) {
        setTracksWithITunesPreview([]);
        return;
      }

      setLoadingPreviews(true);
      try {
        const tracksWithPreviews = await Promise.all(
          playlist.tracks.map(async (track: any) => {
            const artistName = track.artists?.[0]?.name || track.artists?.[0] || '';
            const trackName = track.name || '';
            
            // Haal preview URL op via iTunes
            const itunesPreviewUrl = await getPreviewUrlFromITunes(trackName, artistName);
            
            return {
              ...track,
              preview_url: itunesPreviewUrl || null,
            };
          })
        );
        
        setTracksWithITunesPreview(tracksWithPreviews);
      } catch (error) {
        console.error("Error fetching iTunes previews:", error);
        // Fallback naar originele tracks als er een fout is
        setTracksWithITunesPreview(playlist.tracks);
      } finally {
        setLoadingPreviews(false);
      }
    };

    fetchITunesPreviews();
  }, [playlist?.tracks]);

  const togglePlay = (previewUrl?: string | null) => {
    if (!previewUrl) return;
    if (playingUrl === previewUrl) {
      audioRef.current?.pause();
      setPlayingUrl(null);
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    audio.crossOrigin = "anonymous";
    audio.onended = () => setPlayingUrl(null);
    audio.play().then(() => setPlayingUrl(previewUrl));
  };

  const handleRemoveTrack = async (track: any) => {
    if (!playlist?.id) return;
    
    if (window.confirm(`Weet je zeker dat je "${track.name}" wilt verwijderen uit deze playlist?`)) {
      try {
        await removeTrackFromPlaylist(playlist.id, track);
        // Stop audio als het verwijderde nummer aan het spelen is
        if (playingUrl === track.preview_url) {
          audioRef.current?.pause();
          setPlayingUrl(null);
        }
      } catch (error) {
        console.error("Error removing track:", error);
        alert("Fout bij verwijderen van nummer.");
      }
    }
  };

  const openPlaylistModal = () => {
    setActivePlaylistModal(true);
  };

  const closePlaylistModal = () => {
    setActivePlaylistModal(false);
  };

  const handleRenamePlaylist = async () => {
    if (!playlist || isProtected) {
      alert("Deze playlist-naam kan niet bewerkt worden.");
      closePlaylistModal();
      return;
    }
    const newName = window.prompt("Nieuwe naam voor playlist:", playlist.name ?? "");
    if (!newName || !newName.trim()) {
      closePlaylistModal();
      return;
    }
    try {
      await renamePlaylist(playlist.id, newName.trim());
    } catch (err) {
      console.error(err);
      alert("Kon playlist naam niet bijwerken.");
    } finally {
      closePlaylistModal();
    }
  };

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    const ok = window.confirm(
      `Weet je zeker dat je "${playlist.name}" wilt verwijderen? Dit kan niet ongedaan gemaakt worden.`
    );
    if (!ok) {
      closePlaylistModal();
      return;
    }
    try {
      await deletePlaylist(playlist.id);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Kon playlist niet verwijderen.");
      closePlaylistModal();
    }
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
      {/* Back button */}
      <button className="btn" onClick={() => navigate(-1)}>
        &lt;
      </button>

      {/* Playlist header */}
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

        {/* Playlist 3-dots */}
        {!isProtected && (
          <button
            className="btn btn-outline-secondary"
            onClick={openPlaylistModal}
          >
            <i className="bi bi-three-dots"></i>
          </button>
        )}
      </div>

      {/* Track list */}
      <div className="track-list">
        {loadingPreviews && playlist.tracks && playlist.tracks.length > 0 && (
          <div className="text-center py-3">
            <small className="text-muted">Preview URLs laden...</small>
          </div>
        )}
        {(tracksWithITunesPreview.length > 0 ? tracksWithITunesPreview : playlist.tracks ?? []).map((t: any, idx: number) => (
          <div className="track-row" key={t.id ?? `${idx}-${t.name}`}>
            <div className="track-index">{idx + 1}</div>
            <div className="track-thumb">
              {t.album?.images?.[0]?.url ? (
                <img src={t.album.images[0].url} alt={t.name} />
              ) : (
                <div className="thumb-placeholder">
                  <i className="bi bi-music-note"></i>
                </div>
              )}
            </div>
            <div className="track-meta">
              <div className="track-name">{t.name}</div>
              <div className="track-artist">
                {(t.artists || []).map((a: any) => (typeof a === 'string' ? a : a.name)).join(", ")}
              </div>
            </div>

            <div className="track-actions d-flex gap-2 align-items-center">
              {t.preview_url ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => togglePlay(t.preview_url)}
                  aria-label={playingUrl === t.preview_url ? "Pauzeren" : "Afspelen"}
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
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleRemoveTrack(t)}
                aria-label="Verwijderen uit playlist"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Playlist Modal */}
      <ModalMenu
        show={activePlaylistModal}
        onClose={closePlaylistModal}
        onRename={handleRenamePlaylist}
        onDelete={handleDeletePlaylist}
        disableRename={isProtected}
      />
    </div>
  );
};

export default PlaylistDetails;
