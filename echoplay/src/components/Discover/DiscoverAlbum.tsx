
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTracksFromPlaylist, getPreviewUrlFromITunes } from "../../API/ITunesSearchServices";
import { subscribePlaylists, addTrackToPlaylist, Playlist } from "../../services/playlistService";
import { auth } from "../../firebase/firebaseConfig";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Track {
    name: string;
}

const DiscoverAlbum = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const playlistName = searchParams.get("name") || "";
    const artistName = searchParams.get("artist") || "";
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const userId = auth.currentUser?.uid;

    useEffect(() => {
        const loadTracks = async () => {
            if (!playlistName || !artistName) {
                setError("Geen playlist of artiest informatie gevonden.");
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const fetchedTracks = await fetchTracksFromPlaylist(playlistName, artistName);
                setTracks(fetchedTracks);
            } catch (err: any) {
                setError("Fout bij het laden van tracks.");
                console.error("Error loading tracks:", err);
            } finally {
                setLoading(false);
            }
        };

        loadTracks();
    }, [playlistName, artistName]);

    useEffect(() => {
        if (!userId) return;
        const unsubscribe = subscribePlaylists(userId, (fetchedPlaylists) => {
            setPlaylists(fetchedPlaylists);
        });
        return () => unsubscribe();
    }, [userId]);

    const handleBack = () => {
        navigate("/discover");
    };

    const handleAddToPlaylist = (track: Track) => {
        setSelectedTrack(track);
        setShowPlaylistModal(true);
    };

    const handleAddTrackToPlaylist = async (playlistId: string) => {
        if (!selectedTrack) return;

        try {
            // Haal preview URL op voor de track
            const previewUrl = await getPreviewUrlFromITunes(selectedTrack.name, artistName);
            
            // Maak track object aan
            const trackData = {
                id: `${selectedTrack.name}-${artistName}-${Date.now()}`,
                name: selectedTrack.name,
                preview_url: previewUrl || null,
                album: {
                    name: playlistName,
                    images: []
                },
                artists: [{ name: artistName, id: artistName }]
            };

            await addTrackToPlaylist(playlistId, trackData);
            setShowPlaylistModal(false);
            setSelectedTrack(null);
        } catch (err) {
            console.error("Error adding track to playlist:", err);
        }
    };

    if (loading) {
        return (
            <div className="container-fluid px-4 py-4">
                <div className="text-center">
                    <p>Laden...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid px-4 py-4">
                <button onClick={handleBack} className="btn btn-secondary mb-3">
                    Terug
                </button>
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-4">
            <button onClick={handleBack} className="btn btn-secondary mb-4">
                Terug naar Discover
            </button>
            
            <div className="mb-4">
                <h2 className="Title mb-2">{playlistName}</h2>
                <p className="text-muted mb-0">{artistName}</p>
                <p className="text-muted small">{tracks.length} {tracks.length === 1 ? 'nummer' : 'nummers'}</p>
            </div>

            {tracks.length === 0 ? (
                <div className="alert alert-info">
                    Geen tracks gevonden voor dit album.
                </div>
            ) : (
                <div className="list-group">
                    {tracks.map((track) => (
                        <div 
                            key={track.name} 
                            className="list-group-item list-group-item-action"
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                <span>{track.name}</span>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => handleAddToPlaylist(track)}
                                    aria-label="Toevoegen aan playlist"
                                    style={{ border: "none" }}
                                >
                                    <i className="bi bi-plus-circle"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Playlist Modal */}
            {showPlaylistModal && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.2)",
                        backdropFilter: "blur(2px)",
                        zIndex: 1050,
                    }}
                    onClick={() => {
                        setShowPlaylistModal(false);
                        setSelectedTrack(null);
                    }}
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
                                onClick={() => {
                                    setShowPlaylistModal(false);
                                    setSelectedTrack(null);
                                }}
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
                                    onClick={() => handleAddTrackToPlaylist(pl.id)}
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
}

export default DiscoverAlbum;