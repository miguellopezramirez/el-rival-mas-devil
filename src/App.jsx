import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProjectorView from './pages/ProjectorView';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectorView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
