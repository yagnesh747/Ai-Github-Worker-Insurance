import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api';

export default function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', work_type: '', location: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(formData);
      if (res.user_id) {
        localStorage.setItem('workerId', res.user_id);
        navigate('/dashboard');
      }
    } catch (err) {
      alert("Failed to register. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <h1>Worker Protection System</h1>
      <p style={{textAlign: 'center'}}>Micro-insurance for Gig Workers</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Sharma" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 9876543210" />
        </div>
        <div className="form-group">
          <label>Work Type</label>
          <select required value={formData.work_type} onChange={e => setFormData({...formData, work_type: e.target.value})}>
            <option value="">Select Work Type</option>
            <option value="Delivery">Delivery Executive</option>
            <option value="Driver">Ride-Hailing Driver</option>
            <option value="Logistics">Logistics Worker</option>
          </select>
        </div>
        <div className="form-group">
          <label>Location (Area/GPS)</label>
          <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Koramangala, Bangalore" />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register & Protect Income'}
        </button>
      </form>
    </div>
  );
}
