import React, { useState } from "react";

const UploadSongPage: React.FC = () => {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [songName, setSongName] = useState("");

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file for the cover.");
        return;
      }
      setCoverFile(file);
    }
  };

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("audio/")) {
        alert("Please upload a valid audio file.");
        return;
      }
      setAudioFile(file);
    }
  };

  const handleUpload = () => {
    if (!coverFile || !audioFile || !songName) {
      alert("Please fill in all fields and select files.");
      return;
    }

    alert(
      `Uploading:\nSong: ${songName}\nCover: ${coverFile.name}\nAudio: ${audioFile.name}`
    );
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
      <h2 style={{ fontWeight: 700, marginBottom: "20px" }}>Upload Music</h2>

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
            Cover Image
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
            Choose cover
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
            Song Name
          </label>
          <input
            type="text"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Enter song name"
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
            Audio File
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
            Choose audio
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

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          style={{
            marginTop: "10px",
            backgroundColor: "#6c2bd9",
            color: "white",
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(108,43,217,0.25)",
          }}
        >
          Upload Song
        </button>
      </div>
    </div>
  );
};

export default UploadSongPage;
