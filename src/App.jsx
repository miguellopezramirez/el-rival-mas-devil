import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectorView from './pages/ProjectorView';
import AdminPanel from './pages/AdminPanel';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<ProjectorView />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  );
}

export default App;
