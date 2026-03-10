import { useState } from 'react';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'chatbot'>('home');

  return (
    <>
      <div className="fixed bottom-10 right-5 z-[9999] bg-[var(--color-primary)] p-2.5 rounded-lg border border-[var(--color-border)] shadow-[var(--shadow-lg)] flex gap-2.5">
        <button 
          className={`btn-secondary px-4 py-2 text-sm ${currentPage === 'home' ? 'bg-[var(--color-secondary)]' : 'bg-transparent'}`}
          onClick={() => setCurrentPage('home')}
        >
          IDE View
        </button>
        <button 
          className={`btn-secondary px-4 py-2 text-sm ${currentPage === 'chatbot' ? 'bg-[var(--color-secondary)]' : 'bg-transparent'}`}
          onClick={() => setCurrentPage('chatbot')}
        >
          Chat View
        </button>
      </div>

      {currentPage === 'home' ? <Home /> : <Chatbot />}
    </>
  );
}

export default App;
