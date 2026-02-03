import "./UserMessage.css";
import { FiUser, FiMoreVertical, FiTrash, FiEdit } from "react-icons/fi";
import { useState } from "react";

export default function UserMessage({ message, timestamp, onDelete, onEdit }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
    setMenuVisible(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setMenuVisible(false);
  };

  const handleSaveClick = () => {
    onEdit(editedMessage);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedMessage(message);
  };

  return (
    <div className="user-message">
      <div className="user-message-container">
        {isEditing ? (
          <div className="edit-container">
            <textarea
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
            />
            <div className="edit-buttons">
              <button onClick={handleSaveClick}>Save</button>
              <button onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
        ) : (
          <p>{message}</p>
        )}
        <div className="timestamp">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
      <div className="message-menu">
        <button className="menu-button" onClick={handleMenuClick}>
          <FiMoreVertical />
        </button>
        {menuVisible && (
          <div className="delete-menu">
            <button onClick={handleDeleteClick}>
              <FiTrash /> Delete
            </button>
            <button onClick={handleEditClick}>
              <FiEdit /> Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}