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

  const handleTrigger = async (eventType) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await triggerEvent(userId, eventType);
      setMessage(res.message || "Event recorded.");
      await loadData(); // Reload claims list
    } catch (e) {
      setMessage("Error triggering event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h1>Zero-Touch Claims</h1>
      
      {!policyActive && (
        <div className="alert alert-info">
          Start a policy to test automated claims.
        </div>
      )}

      <div style={{marginBottom: '2rem'}}>
        <h2>Simulate Automated Event</h2>
        <p>Click below to mock an API trigger (e.g. Weather API detects rain in your zone).</p>
        
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <button onClick={() => handleTrigger('rain')} className="btn btn-secondary" style={{width: 'auto', flex: 1}}>
            🌧️ Rain Detected
          </button>
          <button onClick={() => handleTrigger('road_blockage')} className="btn btn-secondary" style={{width: 'auto', flex: 1}}>
            🚧 Road Blockage
          </button>
          <button onClick={() => handleTrigger('low_orders')} className="btn btn-danger" style={{width: 'auto', flex: 1}}>
            📉 Low Orders
          </button>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('credited') ? 'alert-success' : 'alert-info'}`}>
          {message}
        </div>
      )}

      <h2>Claim History</h2>
      {claims.length === 0 ? (
        <p>No claims generated yet.</p>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {claims.map(c => (
            <div key={c._id} className="status-card" style={{borderLeftColor: 'var(--success-color)'}}>
              <div className="flex-between">
                <strong>{c.reason}</strong>
                <span style={{color: 'var(--success-color)', fontWeight: 'bold'}}>+ ₹{c.payout}</span>
              </div>
              <p style={{fontSize: '0.8rem', margin: '0.5rem 0 0 0'}}>
                Processed automatically • {new Date(c.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
