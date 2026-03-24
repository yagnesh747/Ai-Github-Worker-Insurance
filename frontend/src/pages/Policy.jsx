import React, { useState, useEffect } from 'react';
import { calculatePremium, activatePolicy, getUserContext } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Policy() {
  const userId = localStorage.getItem('workerId');
  const navigate = useNavigate();
  
  const [riskFactor, setRiskFactor] = useState('none');
  const [premium, setPremium] = useState(10);
  const [loading, setLoading] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null);

  useEffect(() => {
    getUserContext(userId).then(res => {
      if (res && res.active_policy) {
        setActivePolicy(res.active_policy);
      }
    });
  }, [userId]);

  useEffect(() => {
    calculatePremium(riskFactor).then(res => setPremium(res.premium));
  }, [riskFactor]);

  const handleActivate = async () => {
    setLoading(true);
    await activatePolicy(userId, riskFactor);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="glass-panel">
      <h1>Income Protection Policy</h1>
      
      <div className="form-group">
        <label>Current Environment (Risk Factor Mock)</label>
        <select value={riskFactor} onChange={e => setRiskFactor(e.target.value)}>
          <option value="none">Normal Conditions (Base ₹10)</option>
          <option value="rain">Heavy Rain (+ ₹5)</option>
          <option value="safe_zone">Safe Zone (- ₹2)</option>
        </select>
        <p style={{fontSize: '0.8rem', marginTop: '0.5rem'}}>
          *In real-world, this is auto-fetched via Weather/Traffic APIs based on your GPS.
        </p>
      </div>

      <div className="status-card">
        <h3>Dynamic Premium</h3>
        <p className="value-highlight">₹{premium} / week</p>
        <p>Coverage: 00:00 - 23:59 (24 Hours)</p>
      </div>

      {activePolicy ? (
        <div className="alert alert-success">
          You already have an active policy (Paid: ₹{activePolicy.premium_paid}). Activating again will override it.
        </div>
      ) : null}

      <button onClick={handleActivate} className="btn btn-primary" disabled={loading}>
        {loading ? 'Activating...' : `Activate Policy for ₹${premium}`}
      </button>
    </div>
  );
}
