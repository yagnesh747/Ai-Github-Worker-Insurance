import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Policy from './pages/Policy';
import Claims from './pages/Claims';
import './index.css';

function Navigation() {
  const location = useLocation();
  const userId = localStorage.getItem('workerId');
  
  if (!userId || location.pathname === '/' || location.pathname === '/register') return null;

  return (
    <nav className="nav-links">
      <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
      <Link to="/policy" className={location.pathname === '/policy' ? 'active' : ''}>Policy Hub</Link>
      <Link to="/claims" className={location.pathname === '/claims' ? 'active' : ''}>Auto-Claims</Link>
    </nav>
  );
}

function PrivateRoute({ children }) {
  const userId = localStorage.getItem('workerId');
  return userId ? children : <Navigate to="/register" />;
}

export default function App() {
  return (
    <div className="container">
      <Navigation />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/policy" element={<PrivateRoute><Policy /></PrivateRoute>} />
        <Route path="/claims" element={<PrivateRoute><Claims /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
