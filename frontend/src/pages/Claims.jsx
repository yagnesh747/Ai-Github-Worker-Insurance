import React, { useState, useEffect } from 'react';
import { triggerEvent, getClaims, getUserContext } from '../api';

export default function Claims() {
  const userId = localStorage.getItem('workerId');
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [policyActive, setPolicyActive] = useState(false);

  const loadData = async () => {
    const claimsRes = await getClaims(userId);
    setClaims(claimsRes.claims);
    
    const userRes = await getUserContext(userId);
    setPolicyActive(!!userRes?.active_policy);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleTrigger = async (eventType, severity = "high") => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/trigger-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, event_type: eventType, severity: severity })
      });
      const res = await response.json();
      setMessage(res.message || "Event recorded.");
      await loadData(); // Reload claims list
    } catch (e) {
      setMessage("Error triggering event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel main-claims">
      <h1>AI Auto-Claims</h1>
      
      {!policyActive && (
        <div className="alert alert-info">
          ⚠️ Activate a policy to enable zero-touch AI claims.
        </div>
      )}

      <div className="simulation-section">
        <div className="flex-between">
          <h2>Simulate Market Disruption</h2>
          <span className="live-tag">LIVE ENGINE</span>
        </div>
        <p>Trigger automated scenarios to see how AI detects and compensates income loss in real-time.</p>
        
        <div className="simulation-grid">
          <button onClick={() => handleTrigger('rain', 'high')} className="btn btn-secondary sim-btn">
            ⛈️ Heavy Rain (80% Loss)
          </button>
          <button onClick={() => handleTrigger('low_orders', 'medium')} className="btn btn-secondary sim-btn">
            📉 Low Orders (50% Loss)
          </button>
          <button onClick={() => handleTrigger('accident', 'high')} className="btn btn-danger sim-btn">
            🚑 Personal Accident
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('credited') ? 'alert-success' : 'alert-info'}`}>
          {message}
        </div>
      )}

      <div className="claims-history-section">
        <h2>Smart Claim History</h2>
        {claims.length === 0 ? (
          <p className="subtext">No claims generated yet. Simulation results will appear here.</p>
        ) : (
          <div className="claims-list">
            {claims.map(c => (
              <div key={c._id} className="claim-card-container">
                <div className="status-card claim-card" style={{borderLeftColor: 'var(--success-color)'}}>
                  <div className="flex-between">
                    <div>
                      <strong className="reason-text">{c.reason}</strong>
                      <p className="claim-date">{new Date(c.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="payout-value">+ ₹{c.payout}</span>
                      <p className="claim-status">SETTLED</p>
                    </div>
                  </div>
                  
                  {c.ai_metadata && (
                    <div className="ai-reasoning-panel">
                      <div className="ai-header">
                        <span className="ai-icon">🤖</span>
                        <strong>Explainable AI Matrix</strong>
                      </div>
                      <div className="ai-stats-grid">
                        <div className="ai-stat">
                          <label>Rain Prob.</label>
                          <span>{c.ai_metadata.rain_probability}%</span>
                        </div>
                        <div className="ai-stat">
                          <label>Flood Risk</label>
                          <span className={c.ai_metadata.flood_risk === 'High' ? 'text-red' : 'text-yellow'}>
                            {c.ai_metadata.flood_risk}
                          </span>
                        </div>
                        <div className="ai-stat">
                          <label>Risk Score</label>
                          <span>{c.ai_metadata.job_risk_score}/100</span>
                        </div>
                        <div className="ai-stat">
                          <label>Confidence</label>
                          <span>{c.ai_metadata.ai_confidence}%</span>
                        </div>
                      </div>
                      <div className="ai-explanation">
                        <strong>AI Decision:</strong> {c.ai_metadata.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
