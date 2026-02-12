import React, { useEffect, useState } from 'react';
import { endpoints } from '../api';

const Status = () => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch(endpoints.status)
            .then(res => res.json())
            .then(data => setStatus(data))
            .catch(err => {
                console.error("Status check failed:", err);
                setStatus({ error: 'Offline' });
            });
    }, []);

    if (!status) return <div className="status-label">Loading...</div>;

    return (
        <div className="status-grid">
            <div className="status-label">
                <span className={`status-dot ${status.backend === 'OK' ? 'ok' : 'error'}`}></span>
                Backend
            </div>
            <div className="status-label">
                <span className={`status-dot ${status.database === 'OK' ? 'ok' : 'error'}`}></span>
                Storage
            </div>
            {status.llm && (
                <div className="status-label">
                    <span className={`status-dot ${status.llm.includes('Ready') ? 'ok' : 'warn'}`}></span>
                    AI
                </div>
            )}
        </div>
    );
};

export default Status;
