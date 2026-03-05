import ChatSidebar from '../components/ChatSidebar.tsx';
import ChatArea from '../components/ChatArea.tsx';

export default function Chatbot() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '280px 1fr',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)'
    }}>
      <ChatSidebar />
      <ChatArea />
    </div>
  );
}
