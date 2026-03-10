import { useState, useRef, useEffect } from 'react';
import Topbar from '../components/Topbar';
import HomeSidebar from '../components/HomeSidebar';
import CodeEditor from '../components/CodeEditor';
import ResponsePane from '../components/ResponsePane';
import { EditorProvider } from '../contexts/EditorContext';

export default function Home() {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [responseWidth, setResponseWidth] = useState(400);

  const isDraggingSidebar = useRef(false);
  const isDraggingResponse = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSidebar.current) {
        // min 200px, max 600px
        const newWidth = Math.max(200, Math.min(e.clientX, 600));
        setSidebarWidth(newWidth);
      } else if (isDraggingResponse.current) {
        // min 250px, max 800px, limit based on window width
        const newWidth = Math.max(250, Math.min(window.innerWidth - e.clientX, 800));
        setResponseWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSidebar.current || isDraggingResponse.current) {
        isDraggingSidebar.current = false;
        isDraggingResponse.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <EditorProvider>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)'
      }}>
        <Topbar />
        
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Sidebar Area */}
          <div style={{ width: sidebarWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <HomeSidebar />
          </div>

          {/* Resizer 1 */}
          <div 
             style={{ 
               width: '4px', 
               cursor: 'col-resize', 
               backgroundColor: 'transparent', 
               zIndex: 10, 
               flexShrink: 0,
               position: 'relative'
             }}
             className="hover:bg-[var(--color-cta)] transition-colors"
             onMouseDown={(e) => {
               e.preventDefault();
               isDraggingSidebar.current = true;
               document.body.style.cursor = 'col-resize';
               document.body.style.userSelect = 'none';
             }}
          />

          {/* Center Editor Area */}
          <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
            <CodeEditor />
          </div>

          {/* Resizer 2 */}
          <div 
             style={{ 
               width: '4px', 
               cursor: 'col-resize', 
               backgroundColor: 'transparent', 
               zIndex: 10, 
               flexShrink: 0,
               position: 'relative'
             }}
             className="hover:bg-[var(--color-cta)] transition-colors"
             onMouseDown={(e) => {
               e.preventDefault();
               isDraggingResponse.current = true;
               document.body.style.cursor = 'col-resize';
               document.body.style.userSelect = 'none';
             }}
          />

          {/* Right Response Area */}
          <div style={{ width: responseWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ResponsePane />
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}
