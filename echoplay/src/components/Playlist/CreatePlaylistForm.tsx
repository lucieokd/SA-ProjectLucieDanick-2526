import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { createPlaylist } from "../../services/playlistService";

const CreatePlaylistForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Please enter a playlist name.");
      return;
    }

    setLoading(true);
    try {
      await createPlaylist({
        name: name.trim(),
        description: description.trim(),
        imageFile,
      });
      // navigate to library after creation
      navigate("/library");
    } catch (err) {
      console.error("Create playlist error:", err);
      alert("Could not create playlist. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-semibold mb-4">Create Playlist</h3>

      <div className="mb-3">
        <label className="form-label fw-semibold">Playlist Name</label>
        <input
          type="text"
          className="form-control"
          placeholder="My Playlist"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Description</label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Describe your playlist..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ resize: "none" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleImageChange}
        />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-3 rounded shadow"
            style={{ width: "100%", maxWidth: 260 }}
          />
        )}
      </div>

      <button
        className="btn w-100"
        style={{
          backgroundColor: "#6c2bd9",
          color: "white",
          borderRadius: 10,
          fontWeight: 600,
        }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Playlist"}
      </button>
    </div>
  );
};

export default CreatePlaylistForm;

