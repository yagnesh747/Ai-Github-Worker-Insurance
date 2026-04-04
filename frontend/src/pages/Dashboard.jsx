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
        setData({ 
          user: userRes.user, 
          policy: userRes.active_policy, 
          claimsTotal: claimsRes.total_payout,
          trustScore: userRes.trust_score,
          predictedIncome: userRes.predicted_weekly_income
        });
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

  if (loading) return <div className="glass-panel"><p>Loading personal AI profile...</p></div>;
  if (!data) return <div className="glass-panel"><p>Failed to connect to AI engine. Backend running?</p></div>;

  const getTrustColor = (score) => {
    if (score >= 90) return 'var(--success-color)';
    if (score >= 75) return '#fbbf24'; // Yellow
    return 'var(--secondary-color)'; // Red
  }

  return (
    <div className="glass-panel main-dashboard">
      <div className="flex-between dashboard-header">
        <h1>Gig Dashboard</h1>
        <div className="trust-badge" style={{ backgroundColor: getTrustColor(data.trustScore) }}>
           Trust Score: {data.trustScore}%
        </div>
      </div>
      
      <h2>Welcome, {data.user.name} 👋</h2>
      
      <div className="grid-2">
        <div className="status-card highlight-card">
          <h3>Predicted Weekly Income</h3>
          <p className="value-highlight accent-text">₹{data.predictedIncome}</p>
          <p className="subtext">Based on {data.user.work_type} patterns & location</p>
        </div>

        <div className="status-card" style={{borderLeftColor: 'var(--primary-color)'}}>
          <h3>Earnings Protected</h3>
          <p className="value-highlight" style={{color: 'var(--success-color)'}}>
            ₹{data.claimsTotal}
          </p>
          <p className="subtext">Total automated payouts received</p>
        </div>
      </div>
      
      <div className={`status-card policy-card ${data.policy ? 'active' : 'expired'}`}>
         <div className="flex-between">
            <div>
              <h3>Policy Status</h3>
              <p className="value-highlight">
                {data.policy ? '🟢 ACTIVE' : '🔴 INACTIVE'}
              </p>
            </div>
            {data.policy && (
              <div className="text-right">
                <p className="premium-label">Weekly Premium</p>
                <p className="premium-value">₹{data.policy.premium_paid}</p>
              </div>
            )}
         </div>
      </div>
      
      <div className="action-footer">
        {!data.policy && (
          <button onClick={() => navigate('/policy')} className="btn btn-primary">
            Activate Smart Coverage
          </button>
        )}
        
        <button onClick={logout} className="btn btn-secondary">
          Logout Profile
        </button>
      </div>
    </div>
  );
}
