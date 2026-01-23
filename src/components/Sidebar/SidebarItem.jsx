import { useState } from "react";
import "./SidebarItem.css";
import { FiMoreVertical, FiTrash } from "react-icons/fi";

export default function SidebarItem({
  session,
  onSelectChat,
  onDeleteChat,
  isActive,
  isCollapsed,
}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation(); // Prevent chat selection when clicking the menu
    setMenuVisible(!menuVisible);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent chat selection
    onDeleteChat(session.id);
    setMenuVisible(false);
  };

  return (
    <div
      className={`sidebar-item ${isActive ? "active" : ""}`}
      onClick={() => onSelectChat(session.id)}
    >
      <div className="sidebar-item-content">
        {!isCollapsed && <span className="sidebar-item-title">{session.title}</span>}
        {!isCollapsed && session.lastUpdated && (
          <div className="sidebar-item-timestamp">
            {new Date(session.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>
      {session.messages.length > 0 && !isCollapsed && (
        <div className="sidebar-item-menu">
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
      )}
    </div>
  );
}
