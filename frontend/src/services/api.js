import axios from 'axios';

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' 
});

export const getJobs     = ()           => api.get('/jobs');
export const register    = (data)       => api.post('/register', data);
export const getDashboard = (id)        => api.get(`/dashboard/${id}`);
export const simulate    = (id, event)  => api.post(`/simulate/${id}/${event}`);
export const getClaims   = (id)         => api.get(`/claims/${id}`);
