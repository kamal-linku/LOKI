import { FiMenu, FiX } from "react-icons/fi";
import "./Navbar.css";

export default function Navbar({ toggleSidebar, showSidebar }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-button" onClick={toggleSidebar}>
          {showSidebar ? <FiX /> : <FiMenu />}
        </button>
        <div className="navbar-title">LOKI</div>
      </div>
    </nav>
  );
}
