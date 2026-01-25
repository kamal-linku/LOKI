import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Container from "../components/Container/Container";
import ChatInput from "../components/ChatInput/ChatInput";
import "./Home.css";

const initialSessionId = Date.now();

export default function Home() {
  const [chatSessions, setChatSessions] = useState([
    { id: initialSessionId, title: "New Chat", messages: [], lastUpdated: new Date() },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState(initialSessionId);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      setChatSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.id === currentSessionId) {
            const newMessages = [
              ...session.messages,
              { text: message, type: "user", timestamp: new Date() },
              { text: "This is a canned response.", type: "ai", timestamp: new Date() }
            ];
            // Update title with the first message
            const newTitle =
              session.messages.length === 0 ? message : session.title;
            return { ...session, title: newTitle, messages: newMessages, lastUpdated: new Date() };
          }
          return session;
        })
      );
    }
  };

  const handleNewChat = () => {
    const emptyNewChat = chatSessions.find(
      (session) => session.title === "New Chat" && session.messages.length === 0
    );

    if (emptyNewChat) {
      setCurrentSessionId(emptyNewChat.id);
    } else {
      const newSessionId = Date.now();
      setChatSessions((prevSessions) => [
        ...prevSessions,
        { id: newSessionId, title: "New Chat", messages: [], lastUpdated: new Date() },
      ]);
      setCurrentSessionId(newSessionId);
    }
    setShowSidebar(false); // Close sidebar on mobile after new chat
  };

  const handleSelectChat = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  const handleDeleteChat = (sessionId) => {
    setChatSessions((prevSessions) =>
      prevSessions.filter((session) => session.id !== sessionId)
    );
    // If the deleted session was the current one, switch to another session or create a new one
    if (currentSessionId === sessionId) {
      if (chatSessions.length > 1) {
        setCurrentSessionId(chatSessions[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleDeleteMessage = (sessionId, messageIndex) => {
    setChatSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === sessionId) {
          const newMessages = session.messages.filter((_, index) => index !== messageIndex);
          return { ...session, messages: newMessages, lastUpdated: new Date() };
        }
        return session;
      })
    );
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const filteredChatSessions = chatSessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = chatSessions.find(
    (session) => session.id === currentSessionId
  );

  return (
    <div className="home">
      <Sidebar
        chatSessions={filteredChatSessions}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        currentSessionId={currentSessionId}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        className={showSidebar ? 'show' : ''}
      />
      {showSidebar && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <main className="main">
        <Navbar toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
        <Container messages={currentChat ? currentChat.messages : []} onDeleteMessage={(messageIndex) => handleDeleteMessage(currentSessionId, messageIndex)} />
        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
}
