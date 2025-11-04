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

    // Hier kun je later je upload-logica toevoegen (Firestore / Storage)
    alert(
      `Uploading:\nSong: ${songName}\nCover: ${coverFile.name}\nAudio: ${audioFile.name}`
    );
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Upload Music</h2>

      {/* Cover Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
        >
          Upload Cover Image
        </label>
        <input type="file" accept="image/*" onChange={handleCoverChange} />
        {coverFile && <p>Selected: {coverFile.name}</p>}
      </div>

      {/* Song Name */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
        >
          Song Name
        </label>
        <input
          type="text"
          placeholder="Enter song name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Audio Upload */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
        >
          Upload Audio File
        </label>
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
        {audioFile && <p>Selected: {audioFile.name}</p>}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        style={{
          backgroundColor: "#6c2bd9",
          color: "white",
          padding: "12px",
          width: "100%",
          border: "none",
          borderRadius: "8px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadSongPage;
