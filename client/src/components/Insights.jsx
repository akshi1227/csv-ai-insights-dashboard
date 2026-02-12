import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { endpoints } from '../api';

const Insights = ({ summary, filename, onSave }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const generateInsights = async () => {
        setLoading(true);
        try {
            const res = await fetch(endpoints.analyze, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ summary })
            });
            const data = await res.json();
            if (data.insights) {
                setInsights(data.insights);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to generate insights');
        } finally {
            setLoading(false);
        }
    };

    const saveReport = async () => {
        setSaving(true);
        try {
            const res = await fetch(endpoints.reports, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename, summary, insights })
            });
            if (res.ok) {
                alert('Report Saved!');
                onSave(); // Refresh history
            }
        } catch (err) {
            alert('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="insights-container">
            <div className="actions">
                {!insights && (
                    <button onClick={generateInsights} disabled={loading} className="primary-btn">
                        {loading ? 'Analyzing...' : 'Generate AI Insights'}
                    </button>
                )}
                {insights && (
                    <button onClick={saveReport} disabled={saving} className="secondary-btn">
                        {saving ? 'Saving...' : 'Save Report'}
                    </button>
                )}
            </div>

            {insights && (
                <div className="markdown-content">
                    <div className="export-actions" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={() => navigator.clipboard.writeText(insights)}
                            className="secondary-btn"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                        >
                            Copy to Clipboard
                        </button>
                        <button
                            onClick={() => {
                                const blob = new Blob([insights], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${filename}_insights.txt`;
                                a.click();
                            }}
                            className="secondary-btn"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                        >
                            Download .txt
                        </button>
                    </div>
                    <h3>AI Analysis</h3>
                    <ReactMarkdown>{insights}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default Insights;
