// Use environment variable if available, otherwise default to local
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

export const endpoints = {
    status: `${API_BASE}/status`,
    upload: `${API_BASE}/api/upload`,
    analyze: `${API_BASE}/api/analyze`,
    reports: `${API_BASE}/api/reports`,
    chat: `${API_BASE}/api/chat`
};
