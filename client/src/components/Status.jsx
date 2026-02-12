import React, { useEffect, useState } from 'react';
import { endpoints } from '../api';

const Status = () => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        fetch(endpoints.status)
            .then(res => res.json())
            .then(data => setStatus(data))
            .catch(err => setStatus({ error: 'Offline' }));
    }, []);

    if (!status) return <div>Loading system status...</div>;

    return (
        <div className="status-container">
            <h3>System Status</h3>
            <div className="status-grid">
                <div className={`status-item ${status.backend === 'OK' ? 'ok' : 'error'}`}>
                    Backend: {status.backend || 'Offline'}
                </div>
                <div className={`status-item ${status.database === 'OK' ? 'ok' : 'error'}`}>
                    Storage: {status.database}
                </div>
                <div className={`status-item ${status.llm?.includes('Ready') ? 'ok' : 'warn'}`}>
                    LLM: {status.llm}
                </div>
            </div>
        </div>
    );
};

export default Status;
