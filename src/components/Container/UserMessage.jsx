import "./UserMessage.css";
import { FiUser, FiMoreVertical, FiTrash } from "react-icons/fi";
import { useState } from "react";

export default function UserMessage({ message, timestamp, onDelete }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
    setMenuVisible(false);
  };

  return (
    <div className="user-message">
      <div className="user-message-container">
        <p>{message}</p>
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
          </div>
        )}
      </div>
    </div>
  );
}