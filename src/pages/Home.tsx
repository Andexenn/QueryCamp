import Topbar from '../components/Topbar';
import HomeSidebar from '../components/HomeSidebar';
import CodeEditor from '../components/CodeEditor';
import ResponsePane from '../components/ResponsePane';

export default function Home() {
  return (
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
        overflow: 'hidden'
      }}>
        <HomeSidebar />
        <CodeEditor />
        <ResponsePane />
      </div>
    </div>
  );
}
