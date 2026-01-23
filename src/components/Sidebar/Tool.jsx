import "./Tool.css";

export default function Tool({ label, icon, onClick, isCollapsed, className }) {
  return (
    <div className={`tool ${isCollapsed ? 'collapsed' : ''} ${className || ''}`} onClick={onClick}>
      <div className="tool-icon">{icon}</div>
      {!isCollapsed && label}
    </div>
  );
}
