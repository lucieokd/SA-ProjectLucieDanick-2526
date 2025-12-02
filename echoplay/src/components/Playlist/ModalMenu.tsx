import React from "react";
import "../../styles/ModalMenu.css";

interface ModalMenuProps {
  show: boolean;
  onClose: () => void;
  onRename?: () => void;
  onDelete: () => void;
  disableRename?: boolean;
}

const ModalMenu: React.FC<ModalMenuProps> = ({
  show,
  onClose,
  onRename,
  onDelete,
  disableRename = false,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {onRename && (
          <button
            className="modal-btn"
            onClick={onRename}
            disabled={disableRename}
          >
            {disableRename ? "Naam niet bewerkbaar" : "Hernoemen"}
          </button>
        )}
        <button className="modal-btn danger" onClick={onDelete}>
          Verwijderen
        </button>
        <button className="modal-btn close-btn" onClick={onClose}>
          Annuleren
        </button>
      </div>
    </div>
  );
};

export default ModalMenu;
