import { Toaster } from 'sonner';
import BrowserCheck from './components/BrowserCheck';
import DebugPanel from './components/DebugPanel';
import ModernTunerApp from './components/ModernTunerApp';

function App() {
  return (
    <BrowserCheck>
      <Toaster position="top-center" />
      <ModernTunerApp />
      <DebugPanel />
    </BrowserCheck>
  );
}

export default App;