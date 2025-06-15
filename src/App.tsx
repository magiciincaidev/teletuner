import { Toaster } from 'sonner';
import BrowserCheck from './components/BrowserCheck';
import DebugPanel from './components/DebugPanel';
import ModernTunerApp from './components/ModernTunerApp';
import TestUI from './components/TestUI';

function App() {
  // Temporarily show TestUI to verify deployment
  const showTest = new URLSearchParams(window.location.search).get('test') === 'true';
  
  if (showTest) {
    return <TestUI />;
  }
  
  return (
    <BrowserCheck>
      <Toaster position="top-center" />
      <ModernTunerApp />
      <DebugPanel />
    </BrowserCheck>
  );
}

export default App;