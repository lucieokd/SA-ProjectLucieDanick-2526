// src/components/AddPopup.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/AddPopup.css";

interface AddPopupProps {
  show: boolean;
  onClose: () => void;
}

const AddPopup: React.FC<AddPopupProps> = ({ show, onClose }) => {
  const navigate = useNavigate();
  if (!show) return null;

  const handleAddSong = () => {
    onClose();
    navigate("/upload");
  };

  const handleCreatePlaylist = () => {
    onClose();
    navigate("/create-playlist");
  };

  return (
    <div className="add-backdrop" onClick={onClose}>
      <div className="add-modal" onClick={(e) => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">What would you like to add?</h5>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="d-grid gap-2">
          <button className="btn action-btn" onClick={handleAddSong}>
            <i className="bi bi-upload"></i> Upload Song
          </button>
          <button className="btn action-btn" onClick={handleCreatePlaylist}>
            <i className="bi bi-plus-square"></i> Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPopup;
