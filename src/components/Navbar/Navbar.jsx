import "./Navbar.css";
import { FiMenu } from "react-icons/fi";

export default function Navbar({ toggleSidebar }) {
  return (
    <nav className="navbar">
      <button className="hamburger-menu-navbar" onClick={toggleSidebar}>
        <FiMenu />
      </button>
      <div className="navbar-container">
        <div className="navbar-title">LOKI</div>
      </div>
    </nav>
  );
}
