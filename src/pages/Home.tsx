import Topbar from '../components/Topbar';
import HomeSidebar from '../components/HomeSidebar';
import CodeEditor from '../components/CodeEditor';
import ResponsePane from '../components/ResponsePane';
import { EditorProvider } from '../contexts/EditorContext';

export default function Home() {
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
          display: 'grid',
          gridTemplateColumns: '280px 1fr 400px',
          flex: 1,
          overflow: 'hidden',
          minHeight: 0
        }}>
          <HomeSidebar />
          <CodeEditor />
          <ResponsePane />
        </div>
      </div>
    </EditorProvider>
  );
}
