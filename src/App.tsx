import { useState } from 'react';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'chatbot'>('home');

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'var(--color-primary)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          className="btn-secondary" 
          onClick={() => setCurrentPage('home')}
          style={{ padding: '8px 16px', fontSize: '14px', background: currentPage === 'home' ? 'var(--color-secondary)' : 'transparent' }}
        >
          IDE View
        </button>
        <button 
          className="btn-secondary" 
          onClick={() => setCurrentPage('chatbot')}
          style={{ padding: '8px 16px', fontSize: '14px', background: currentPage === 'chatbot' ? 'var(--color-secondary)' : 'transparent' }}
        >
          Chat View
        </button>
      </div>

      {currentPage === 'home' ? <Home /> : <Chatbot />}
    </>
  );
}

export default App;
