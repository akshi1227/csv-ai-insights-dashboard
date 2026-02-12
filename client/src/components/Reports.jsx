import React, { useEffect, useState } from 'react';
import { endpoints } from '../api';

const Reports = ({ refreshTrigger, onLoadReport }) => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetch(endpoints.reports)
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => console.error(err));
    }, [refreshTrigger]);

    if (reports.length === 0) return null;

    return (
        <div className="reports-sidebar">
            <h3>Recent Reports</h3>
            {reports.length === 0 ? <p style={{ color: '#a0a0b0' }}>No saved reports yet.</p> : (
                <ul className="report-list">
                    {reports.map(r => (
                        <li key={r.id} onClick={() => onLoadReport(r)} className="report-item glass-hover">
                            <div>
                                <strong style={{ color: '#fff' }}>{r.filename}</strong>
                                <br />
                                <small className="report-date">{new Date(r.date).toLocaleString()}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <style>{`
                .report-list { list-style: none; padding: 0; margin-top: 1rem; }
                .report-item {
                    padding: 1rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.02);
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .report-item:hover {
                    background: rgba(99, 102, 241, 0.1); /* Indigo tint */
                    border-color: rgba(99, 102, 241, 0.3);
                    transform: translateX(4px);
                }
                .report-date { color: #818cf8; font-size: 0.75rem; }
            `}</style>
        </div>
    );
};

export default Reports;
