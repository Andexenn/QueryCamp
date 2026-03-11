import ChatSidebar from '../components/ChatSidebar';
import ChatArea from '../components/ChatArea';
import { ChatProvider } from '../contexts/ChatContext';

interface ChatbotProps {
  onNavigate?: () => void;
}

export default function Chatbot({ onNavigate }: ChatbotProps) {
  return (
    <ChatProvider>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)'
      }}>
        <ChatSidebar onNavigate={onNavigate} />
        <ChatArea />
      </div>
    </ChatProvider>
  );
}
