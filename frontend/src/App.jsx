import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-grid" />
      <div className="app-wrapper">
        <Navbar />
        <Routes>
          <Route path="/"               element={<Register />} />
          <Route path="/dashboard/:id"  element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
