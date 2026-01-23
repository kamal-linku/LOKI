import "./ChatHistory.css";
import SidebarItem from "./SidebarItem";

export default function ChatHistory({
  chatSessions,
  onSelectChat,
  onDeleteChat,
  currentSessionId,
  isCollapsed,
}) {
  // Only show chat sessions that have messages
  const sessionsWithMessages = chatSessions.filter(session => session.messages.length > 0);

  return (
    <div className="chat-history">
      {!isCollapsed && <h4>Chat History</h4>}
      {sessionsWithMessages.map((session) => (
        <SidebarItem
          key={session.id}
          session={session}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
          isActive={session.id === currentSessionId}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  );
}
