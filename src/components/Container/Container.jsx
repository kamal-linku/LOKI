import { useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import AIResponse from "./AIResponse";
import lokiLogo from "../../assets/loki_logo.png";
import "./Container.css";

export default function Container({ messages, onDeleteMessage }) {
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container">
      {messages.length === 0 ? (
        <>
          <div className="logo-container">
            <div className="ring ring3"></div>
            <div className="ring ring2"></div>
            <div className="ring ring1"></div>
            <img src={lokiLogo} alt="Loki Logo" className="loki-logo" />
          </div>
          <div className="typing-animation above-input">
            <span className="green-text">Hey, I'm LOKI!</span>
            <div className="second-line">
              <span>What can I help with?</span>
            </div>
          </div>
        </>
      ) : (
        <div className="chat-messages" ref={chatMessagesRef}>
          {messages.map((msg, index) =>
            msg.type === "user" ? (
              <UserMessage key={index} message={msg.text} timestamp={msg.timestamp} onDelete={() => onDeleteMessage(index)} />
            ) : (
              <AIResponse key={index} message={msg.text} timestamp={msg.timestamp} onDelete={() => onDeleteMessage(index)} />
            )
          )}
        </div>
      )}
    </div>
  );
}