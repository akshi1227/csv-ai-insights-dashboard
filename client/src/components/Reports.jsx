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
            <ul>
                {reports.map(r => (
                    <li key={r.id} onClick={() => onLoadReport(r)}>
                        <strong>{r.filename}</strong>
                        <br />
                        <small>{new Date(r.date).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Reports;
