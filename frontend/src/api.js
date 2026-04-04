export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const registerUser = async (data) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
};

export const getUserContext = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    if (!response.ok) return null;
    return response.json();
};

export const calculatePremium = async (userId, riskFactor) => {
    const response = await fetch(`${API_BASE_URL}/calculate-premium?user_id=${userId}&risk_factor=${riskFactor}`);
    return response.json();
};

export const activatePolicy = async (userId, riskFactor) => {
    const response = await fetch(`${API_BASE_URL}/policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, risk_factor: riskFactor })
    });
    return response.json();
};

export const triggerEvent = async (userId, eventType) => {
    const response = await fetch(`${API_BASE_URL}/trigger-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, event_type: eventType })
    });
    return response.json();
};

export const getClaims = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/claims?user_id=${userId}`);
    return response.json();
};
