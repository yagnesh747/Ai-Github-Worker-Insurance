import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs, register } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ name: '', job_type: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getJobs()
      .then(r => setJobs(r.data.jobs))
      .catch(() => setJobs([
        'Construction Worker', 'Delivery Driver', 'Street Vendor',
        'Farmer', 'Domestic Helper', 'Rickshaw Driver', 'Factory Worker',
      ]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.job_type || !form.location.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await register(form);
      navigate(`/dashboard/${res.data.user_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Is the backend running?');
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="register-header">
        <div className="register-logo">🛡️</div>
        <h1 className="register-title">Zero‑Touch AI Insurance</h1>
        <p className="register-subtitle">
          Automated income protection for gig workers — no paperwork, no claims forms.
        </p>
      </div>

      <div className="card">
        <div className="section-heading">Worker Registration</div>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            color: 'var(--accent-red)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className="form-input"
              id="reg-name"
              placeholder="e.g. Ravi Kumar"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Type</label>
            <select
              className="form-select"
              id="reg-job"
              value={form.job_type}
              onChange={e => setForm(p => ({ ...p, job_type: e.target.value }))}
            >
              <option value="">— Select your occupation —</option>
              {jobs.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location / City</label>
            <input
              className="form-input"
              id="reg-location"
              placeholder="e.g. Mumbai, Coastal Area"
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
            />
          </div>

          <button
            className="btn btn-primary"
            id="btn-register"
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? '⏳ Registering…' : '🚀 Get Insured Instantly'}
          </button>
        </form>

        <div className="divider" />

        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '⚡', label: 'Instant Policy' },
            { icon: '🤖', label: 'AI Risk Engine' },
            { icon: '💸', label: 'Auto Claims' },
          ].map(f => (
            <div key={f.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem' }}>{f.icon}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
