import "./AIResponse.css";
import { FiCpu } from "react-icons/fi";

export default function AIResponse({ message, timestamp }) {
  return (
    <div className="ai-response">
      <div className="ai-icon">
        <FiCpu />
      </div>
      <div className="ai-message-container">
        <div className="ai-text">{message}</div>
        <div className="timestamp">{new Date(timestamp).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
