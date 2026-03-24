import React, { useEffect, useState } from 'react';
import { getUserContext, getClaims } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('workerId');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!userId) {
        navigate('/register');
        return;
      }
      try {
        const userRes = await getUserContext(userId);
        const claimsRes = await getClaims(userId);
        setData({ user: userRes.user, policy: userRes.active_policy, claimsTotal: claimsRes.total_payout });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, navigate]);

  const logout = () => {
    localStorage.removeItem('workerId');
    navigate('/register');
  }

  if (loading) return <div className="glass-panel"><p>Loading dashboard...</p></div>;
  if (!data) return <div className="glass-panel"><p>Failed to load data. Backend running?</p></div>;

  return (
    <div className="glass-panel">
      <h1>Dashboard</h1>
      <h2>Welcome, {data.user.name} 👋</h2>
      
      <div className="flex-between">
        <p>Work Type: <strong>{data.user.work_type}</strong></p>
        <p>Location: <strong>{data.user.location}</strong></p>
      </div>
      
      <div className={`status-card ${data.policy ? 'active' : 'expired'}`}>
        <h3>Policy Status</h3>
        <p className="value-highlight">
          {data.policy ? '🟢 ACTIVE' : '🔴 INACTIVE'}
        </p>
        {data.policy && (
          <p>Premium Paid: ₹{data.policy.premium_paid}/week</p>
        )}
      </div>

      <div className="status-card" style={{borderLeftColor: 'var(--primary-color)'}}>
        <h3>Total Earnings Protected</h3>
        <p className="value-highlight" style={{color: 'var(--success-color)'}}>
          ₹{data.claimsTotal}
        </p>
      </div>
      
      {!data.policy && (
        <button onClick={() => navigate('/policy')} className="btn btn-primary">
          Activate Policy Now
        </button>
      )}
      
      <button onClick={logout} className="btn btn-secondary">
        Logout User
      </button>
    </div>
  );
}
