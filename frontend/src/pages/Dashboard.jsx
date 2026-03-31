import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDashboard, simulate } from '../services/api';
import RiskMeter from '../components/RiskMeter';
import ClaimCard from '../components/ClaimCard';
import StatusOverlay from '../components/StatusOverlay';

export default function Dashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [simBusy, setSimBusy]     = useState(false);
  const [overlay, setOverlay]     = useState(null);   // 'analyzing' | 'approved'
  const [lastResult, setLastResult] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await getDashboard(id);
      setData(res.data);
    } catch {
      setError('Could not load dashboard. Is the backend running on port 8000?');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const runSimulation = async (event) => {
    setSimBusy(true);
    setOverlay('analyzing');
    try {
      // Artificial 1.8s "AI thinking" delay for demo wow-factor
      await new Promise(r => setTimeout(r, 1800));
      const res = await simulate(id, event);
      setLastResult(res.data);
      setOverlay('approved');
      // Refresh dashboard data after claim
      await fetchData();
      // Auto-dismiss overlay after 3s
      setTimeout(() => setOverlay(null), 3000);
    } catch (err) {
      setOverlay(null);
      alert(err.response?.data?.detail || 'Simulation failed.');
    } finally {
      setSimBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading your dashboard…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <p style={{ color: 'var(--accent-red)', marginBottom: '1.5rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Registration</button>
      </div>
    );
  }

  const { user, policy, claims, total_payout } = data;

  return (
    <>
      <StatusOverlay status={overlay} result={lastResult} />

      <div className="page-container">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="flex-row" style={{ marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👋</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
              Welcome, <span className="glow-text">{user.name}</span>
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {user.job_type} · {user.location} · Policy:{' '}
            <span style={{ fontFamily: 'monospace', color: 'var(--accent-blue)' }}>
              {policy.policy_id}
            </span>
          </p>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────────── */}
        <div className="dashboard-grid mb-3">

          {/* Weekly Premium */}
          <div className="card stat-card">
            <div className="stat-row">
              <div className="icon-wrap icon-blue">💳</div>
              <div>
                <div className="stat-label">Weekly Premium</div>
                <div className="stat-value text-blue">₹{policy.weekly_premium}</div>
                <div className="stat-sub">Auto-adjusted by AI</div>
              </div>
            </div>
          </div>

          {/* Coverage */}
          <div className="card stat-card">
            <div className="stat-row">
              <div className="icon-wrap icon-green">🏥</div>
              <div>
                <div className="stat-label">Max Coverage</div>
                <div className="stat-value text-green">₹{policy.coverage.toLocaleString('en-IN')}</div>
                <div className="stat-sub">Income loss protection</div>
              </div>
            </div>
          </div>

          {/* Total Paid Out */}
          <div className="card stat-card">
            <div className="stat-row">
              <div className="icon-wrap icon-yellow">💰</div>
              <div>
                <div className="stat-label">Total Credited</div>
                <div className="stat-value text-yellow">₹{total_payout}</div>
                <div className="stat-sub">{claims.length} claim(s) auto-processed</div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Policy + Risk Row ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'start', flexWrap: 'wrap' }}>

          {/* Policy Details */}
          <div className="card">
            <div className="section-heading">Policy Details</div>
            <div className="policy-header mb-2">
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{policy.policy_id}</div>
                <div className="policy-id">Issued on {new Date(policy.created_at + 'Z').toLocaleDateString('en-IN')}</div>
              </div>
              <span className="badge badge-active">● Active</span>
            </div>
            <table className="coverage-table">
              <tbody>
                <tr><td>Occupation</td><td>{user.job_type}</td></tr>
                <tr><td>Location</td><td>{user.location}</td></tr>
                <tr><td>Coverage Amount</td><td>₹{policy.coverage.toLocaleString('en-IN')}</td></tr>
                <tr><td>Weekly Premium</td><td>₹{policy.weekly_premium}</td></tr>
                <tr><td>Claim Type</td><td>Zero-Touch Automated</td></tr>
                <tr><td>Policy Status</td><td style={{ color: 'var(--accent-green)' }}>✅ Active</td></tr>
              </tbody>
            </table>
          </div>

          {/* Risk Meter */}
          <div className="card" style={{ textAlign: 'center', minWidth: '200px' }}>
            <div className="section-heading">AI Risk Score</div>
            <RiskMeter score={policy.risk_score} level={policy.risk_level} />
            <div style={{
              marginTop: '1rem',
              padding: '0.6rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}>
              Job risk + location + live events
            </div>
          </div>

        </div>

        {/* ── Simulation Panel ─────────────────────────────────────────── */}
        <div className="card mb-3">
          <div className="section-heading">🎮 Demo Simulation Controls</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Trigger real-world events below. The AI engine will auto-evaluate risk and process your claim — <strong>zero action required.</strong>
          </p>
          <div className="sim-btn-grid">
            <button
              id="btn-rain"
              className="btn btn-rain"
              disabled={simBusy}
              onClick={() => runSimulation('heavy_rain')}
            >
              🌧️ Simulate Heavy Rain
            </button>
            <button
              id="btn-nowork"
              className="btn btn-nowork"
              disabled={simBusy}
              onClick={() => runSimulation('no_work_day')}
            >
              🚫 Simulate No Work Day
            </button>
            <button
              id="btn-flood"
              className="btn btn-flood"
              disabled={simBusy}
              onClick={() => runSimulation('flood_alert')}
            >
              🌊 Simulate Flood Alert
            </button>
          </div>

          <div style={{
            marginTop: '1.25rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            {[
              { icon: '🌧️', label: 'Heavy Rain', payout: '₹500', mult: '1.4×' },
              { icon: '🚫', label: 'No Work Day', payout: '₹300', mult: '1.2×' },
              { icon: '🌊', label: 'Flood Alert', payout: '₹1,200', mult: '1.85×' },
            ].map(e => (
              <div key={e.label} style={{
                flex: 1,
                minWidth: '140px',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{e.icon}</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.label}</div>
                <div style={{ color: 'var(--accent-green)', fontWeight: 700, marginTop: '0.2rem' }}>Payout: {e.payout}</div>
                <div style={{ color: 'var(--text-muted)' }}>Premium: {e.mult}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Claims History ────────────────────────────────────────────── */}
        <div className="card">
          <div className="section-heading">📋 Claim History</div>
          {claims.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              No claims yet. Trigger a simulation above to see zero-touch claims in action.
            </div>
          ) : (
            <div className="claims-list">
              {[...claims].reverse().map(c => (
                <ClaimCard key={c.claim_id} claim={c} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}
