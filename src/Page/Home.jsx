import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import Container from "../components/Container/Container";
import ChatInput from "../components/ChatInput/ChatInput";
import "./Home.css";

export default function Home() {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  // Effect to load data from localStorage on initial render
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem("chatSessions");
      const savedCurrentId = localStorage.getItem("currentSessionId");

      let initialSessions = [];
      if (savedSessions) {
        // When loading from localStorage, we need to convert date strings back to Date objects
        initialSessions = JSON.parse(savedSessions).map(session => ({
          ...session,
          messages: session.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          lastUpdated: new Date(session.lastUpdated)
        }));
      }

      if (initialSessions.length === 0) {
        // If there are no saved sessions, create a default new one
        initialSessions.push({ id: Date.now(), title: "New Chat", messages: [], lastUpdated: new Date() });
      }

      setChatSessions(initialSessions);

      const currentId = savedCurrentId ? Number(savedCurrentId) : null;
      // Make sure the loaded current session ID exists in our sessions array
      if (currentId && initialSessions.some(s => s.id === currentId)) {
        setCurrentSessionId(currentId);
      } else {
        // Otherwise, default to the first session
        setCurrentSessionId(initialSessions[0].id);
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage:", error);
      // If there's an error (e.g., corrupted data), start with a clean slate
      const newSessionId = Date.now();
      setChatSessions([{ id: newSessionId, title: "New Chat", messages: [], lastUpdated: new Date() }]);
      setCurrentSessionId(newSessionId);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to save data to localStorage whenever it changes
  useEffect(() => {
    // We only save if there's something to save
    if (chatSessions.length > 0 && currentSessionId) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
      localStorage.setItem("currentSessionId", currentSessionId);
    }
  }, [chatSessions, currentSessionId]);

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
    setShowSidebar(false);
  };

  const handleSelectChat = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowSidebar(false);
  };

  const handleDeleteChat = (sessionId) => {
    setChatSessions((prevSessions) => {
      const remainingSessions = prevSessions.filter((session) => session.id !== sessionId);
      if (remainingSessions.length === 0) {
        // If all chats are deleted, create a new default one
        const newSessionId = Date.now();
        const newSessions = [{ id: newSessionId, title: "New Chat", messages: [], lastUpdated: new Date() }];
        setCurrentSessionId(newSessionId);
        return newSessions;
      } else if (currentSessionId === sessionId) {
        // If the active chat was deleted, switch to the most recent one
        setCurrentSessionId(remainingSessions.sort((a,b) => b.lastUpdated - a.lastUpdated)[0].id);
      }
      return remainingSessions;
    });
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

  const filteredChatSessions = chatSessions.filter((session) => {
    const query = searchQuery.toLowerCase();
    return (
      session.title.toLowerCase().includes(query) ||
      session.messages.some((message) =>
        message.text.toLowerCase().includes(query)
      )
    );
  });

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
