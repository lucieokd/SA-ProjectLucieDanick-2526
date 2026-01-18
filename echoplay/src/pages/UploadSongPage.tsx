import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import {
  getOrCreateMySongs,
  addTrackToPlaylist,
} from "../services/playlistService";

const UploadSongPage: React.FC = () => {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [songName, setSongName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.uid);
      } else {
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [audioPreviewUrl, coverPreviewUrl]);

  const navigate = useNavigate();

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Upload een geldige afbeelding voor de cover.");
        return;
      }
      setCoverFile(file);
      setCoverPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("audio/")) {
        setError("Upload een geldig audiobestand.");
        return;
      }

      setAudioFile(file);
      setAudioPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!auth.currentUser) {
      setError("Je moet ingelogd zijn om een nummer te uploaden.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!songName.trim()) {
      setError("Voer een nummernaam in.");
      setLoading(false);
      return;
    }

    if (!coverFile) {
      setError("Selecteer een coverafbeelding.");
      setLoading(false);
      return;
    }

    if (!audioFile) {
      setError("Selecteer een audiobestand.");
      setLoading(false);
      return;
    }

    try {
      await auth.currentUser.getIdToken(true);

      // Upload cover
      const coverRef = ref(
        storage,
        `covers/${Date.now()}_${encodeURIComponent(coverFile.name)}`,
      );
      await uploadBytes(coverRef, coverFile);
      const coverUrl = await getDownloadURL(coverRef);

      // Upload audio
      const audioRef = ref(
        storage,
        `songs/${Date.now()}_${encodeURIComponent(audioFile.name)}`,
      );
      await uploadBytes(audioRef, audioFile);
      const audioUrl = await getDownloadURL(audioRef);

      // Haal of maak My Songs playlist
      const mySongsId = await getOrCreateMySongs(auth.currentUser.uid);

      // 🔹 Track object met expliciete naam en cover

      const trackToAdd = {
        id: crypto.randomUUID(),
        name: songName,
        artist: "You",
        album: songName, // je kunt hier ook een aparte albumnaam gebruiken
        artwork: coverUrl,
        preview_url: audioUrl,
      };

      await addTrackToPlaylist(mySongsId, trackToAdd);

      setSuccess("Nummer succesvol geüpload");
      setTimeout(() => navigate(`/playlist/${mySongsId}`), 2000);

      setSongName("");
      setCoverFile(null);
      setAudioFile(null);
      setAudioPreviewUrl(null);
      setCoverPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setError("Upload mislukt. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
        color: "#000",
      }}
    >
      <h2 style={{ fontWeight: 700, marginBottom: "20px" }}>Muziek uploaden</h2>

      {/* Card */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "14px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        }}
      >
        {/* Cover Upload */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}
          >
            Coverafbeelding
          </label>

          {/* Pretty upload button */}
          <label
            style={{
              display: "inline-block",
              padding: "10px 16px",
              backgroundColor: "#f4f4f5",
              color: "#000",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
              border: "1px solid #d1d1d1",
            }}
          >
            Kies coverafbeelding
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              style={{ display: "none" }}
            />
          </label>

          {coverFile && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={URL.createObjectURL(coverFile)}
                alt="Cover preview"
                style={{
                  width: "100%",
                  maxWidth: "180px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
              <p style={{ marginTop: "6px", fontSize: "14px", opacity: 0.7 }}>
                {coverFile.name}
              </p>
            </div>
          )}
        </div>

        {/* Song Name */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}
          >
            Nummernaam
          </label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Voer nummernaam in"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #d1d1d1",
              fontSize: "16px",
              color: "#000",
            }}
          />
        </div>

        {/* Audio Upload */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}
          >
            Audiobestand
          </label>

          <label
            style={{
              display: "inline-block",
              padding: "10px 16px",
              backgroundColor: "#f4f4f5",
              color: "#000",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
              border: "1px solid #d1d1d1",
            }}
          >
            Kies audiobestand
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              style={{ display: "none" }}
            />
          </label>

          {audioFile && (
            <p style={{ marginTop: "8px", fontSize: "14px", opacity: 0.7 }}>
              {audioFile.name}
            </p>
          )}
        </div>
        {(coverFile || audioPreviewUrl) && (
          <div
            style={{
              marginBottom: "20px",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
              background: "#fafafa",
            }}
          >
            {coverFile && (
              <img
                src={coverPreviewUrl}
                alt="Preview cover"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ padding: "14px" }}>
              <strong style={{ fontSize: "16px" }}>
                {songName || "Naamloos nummer"}
              </strong>
              <p style={{ fontSize: "13px", opacity: 0.6, margin: 0 }}>
                Jij · Geüpload
              </p>

              {audioPreviewUrl && (
                <audio
                  controls
                  src={audioPreviewUrl}
                  style={{ width: "100%", marginTop: "8px" }}
                />
              )}
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "12px",
              fontWeight: 500,
            }}
          >
            {success}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            marginTop: "10px",
            backgroundColor: loading ? "#a78bfa" : "#6c2bd9",
            cursor: loading ? "not-allowed" : "pointer",
            color: "white",
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "16px",
            border: "none",
            boxShadow: "0 6px 18px rgba(108,43,217,0.25)",
          }}
        >
          {loading ? "Uploaden..." : "Nummer uploaden"}
        </button>
      </div>
    </div>
  );
};

export default UploadSongPage;
