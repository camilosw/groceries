import { useState, useEffect, useRef } from 'react';
import './App.css';
import { GroceryProvider, useGroceries } from './store/grocery-context';
import { exportState, readBackupFile } from './store/backup';
import type { GroceryState } from './store/storage';
import { Header } from './components/Header';
import { AboutModal } from './components/AboutModal';
import { ImportModal } from './components/ImportModal';
import { MainScreen } from './screens/MainScreen';
import { AddScreen } from './screens/AddScreen';
import { OrderScreen } from './screens/OrderScreen';

type Screen = 'main' | 'add' | 'order';

/** A backup file the user picked, awaiting confirmation. state === null = unreadable file. */
interface PendingImport {
  fileName: string;
  state: GroceryState | null;
}

function AppContent() {
  const { state, dispatch } = useGroceries();
  const [screen, setScreen] = useState<Screen>('main');
  const [aboutOpen, setAboutOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<PendingImport | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigateTo = (s: Screen) => {
    if (s === 'main') {
      history.back();
    } else {
      history.pushState({ screen: s }, '');
      setScreen(s);
    }
  };

  useEffect(() => {
    const handlePop = () => setScreen('main');
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so picking the same file again still fires a change event.
    e.target.value = '';
    if (!file) return;
    setPendingImport({
      fileName: file.name,
      state: await readBackupFile(file),
    });
  }

  function handleImportConfirm(imported: GroceryState) {
    dispatch({ type: 'IMPORT_STATE', state: imported });
    setPendingImport(null);
  }

  return (
    <div className="app">
      <Header
        onOrderClick={screen === 'main' ? () => navigateTo('order') : undefined}
        onExportClick={screen === 'main' ? () => exportState(state) : undefined}
        onImportClick={
          screen === 'main' ? () => fileInputRef.current?.click() : undefined
        }
        onAboutClick={screen === 'main' ? () => setAboutOpen(true) : undefined}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        aria-label="Backup file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
      {pendingImport && (
        <ImportModal
          fileName={pendingImport.fileName}
          state={pendingImport.state}
          onCancel={() => setPendingImport(null)}
          onConfirm={handleImportConfirm}
        />
      )}
      {screen === 'main' && <MainScreen onAdd={() => navigateTo('add')} />}
      {screen === 'add' && <AddScreen onClose={() => navigateTo('main')} />}
      {screen === 'order' && <OrderScreen onClose={() => navigateTo('main')} />}
    </div>
  );
}

function App() {
  return (
    <GroceryProvider>
      <AppContent />
    </GroceryProvider>
  );
}

export default App;
