import "./SidebarItem.css";
import { FiTrash } from "react-icons/fi";

export default function SidebarItem({
  session,
  onSelectChat,
  onDeleteChat,
  isActive,
  isCollapsed,
}) {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent chat selection
    onDeleteChat(session.id);
  };

  return (
    <div
      className={`sidebar-item ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}
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
      {session.messages.length > 0 && (
        <div className="sidebar-item-menu">
          <button className="delete-button" onClick={handleDeleteClick}>
            <FiTrash />
          </button>
        </div>
      )}
    </div>
  );
}
