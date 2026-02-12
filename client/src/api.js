// AUTO-DETECT Environment:
// If running on localhost, use local backend.
// If running on Vercel/Netlify/Public, use the LIVE Vercel Backend.
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const API_BASE = import.meta.env.VITE_API_BASE || (isLocal ? 'http://127.0.0.1:5000' : 'https://csv-ai-insights-backend.vercel.app');

export const endpoints = {
    status: `${API_BASE}/status`,
    upload: `${API_BASE}/api/upload`,
    analyze: `${API_BASE}/api/analyze`,
    reports: `${API_BASE}/api/reports`,
    chat: `${API_BASE}/api/chat`
};
