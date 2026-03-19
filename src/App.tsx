import './App.css';
import { GroceryProvider } from './store/grocery-context';
import { Header } from './components/Header';
import { MainScreen } from './screens/MainScreen';

function App() {
  return (
    <GroceryProvider>
      <div className="app">
        <Header />
        <MainScreen />
      </div>
    </GroceryProvider>
  );
}

export default App;
