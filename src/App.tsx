import { useState } from 'react';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'chatbot'>('home');

  return (
    <>
      {currentPage === 'home' && (
        <div className="fixed bottom-10 right-5 z-[9999]">
          <button 
            className="btn-primary px-4 py-2 text-sm shadow-[var(--shadow-lg)] flex items-center gap-2"
            onClick={() => setCurrentPage('chatbot')}
          >
            Chat View
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      )}

      {currentPage === 'home' ? <Home /> : <Chatbot onNavigate={() => setCurrentPage('home')} />}
    </>
  );
}

export default App;
