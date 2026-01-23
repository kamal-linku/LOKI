import "./UserMessage.css";
import { FiUser } from "react-icons/fi";

export default function UserMessage({ message, timestamp }) {
  return (
    <div className="user-message">
      <div className="user-message-container">
        <p>{message}</p>
        <div className="timestamp">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}