import "./Sidebar.css";
import Tool from "./Tool";
import ChatHistory from "./ChatHistory";
import { FiPlus, FiSearch, FiImage, FiGrid, FiFolder, FiChevronLeft, FiChevronRight, FiLogIn, FiUserPlus } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar({
  onNewChat,
  chatSessions,
  onSelectChat,
  onDeleteChat,
  currentSessionId,
  searchQuery,
  onSearchChange,
  className,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${className || ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && <div className="sidebar-title">LOKI</div>}
        <button className="toggle-button" onClick={toggleCollapse}>
          {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <Tool label="New chat" icon={<FiPlus />} onClick={onNewChat} isCollapsed={isCollapsed} />
      <div className="search-bar">
        <FiSearch className="search-icon" />
        {!isCollapsed && (
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}
      </div>
      <Tool label="Images" icon={<FiImage />} isCollapsed={isCollapsed} />
      <Tool label="Apps" icon={<FiGrid />} isCollapsed={isCollapsed} />
      <Tool label="Projects" icon={<FiFolder />} isCollapsed={isCollapsed} />

      <ChatHistory
        chatSessions={chatSessions}
        onSelectChat={onSelectChat}
        onDeleteChat={onDeleteChat}
        currentSessionId={currentSessionId}
        isCollapsed={isCollapsed}
      />

      <div className="sidebar-auth">
        <Link to="/login">
          <Tool label="Login" icon={<FiLogIn />} isCollapsed={isCollapsed} />
        </Link>
        <Link to="/register">
          <Tool label="Register" icon={<FiUserPlus />} isCollapsed={isCollapsed} />
        </Link>
      </div>

      {!isCollapsed && (
        <div className="sidebar-footer">
          Kamal Behera © 2026
        </div>
      )}
    </aside>
  );
}
