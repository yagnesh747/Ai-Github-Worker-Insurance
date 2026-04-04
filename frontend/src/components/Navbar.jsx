import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const loc = useLocation();
  const onDash = loc.pathname.startsWith('/dashboard');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-logo">🛡️</div>
        <span className="navbar-title">Zero‑Touch AI Insurance</span>
      </div>
      <div className="flex-row">
        {onDash && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Dashboard
          </span>
        )}
        <span className="navbar-badge">● Live Demo</span>
      </div>
    </nav>
  );
}
