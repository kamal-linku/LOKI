import "./Navbar.css";

export default function Navbar({ toggleSidebar, showSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-button" onClick={toggleSidebar}>
          {showSidebar ? "X" : "☰"}
        </button>
        <div className="navbar-title">LOKI</div>
      </div>
    </nav>
  );
}
