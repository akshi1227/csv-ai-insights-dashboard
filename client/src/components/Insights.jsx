import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { endpoints } from '../api';

const Insights = ({ summary, filename, onSave }) => {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Chat State
    const [chatQuestion, setChatQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

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

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatQuestion.trim()) return;

        const question = chatQuestion;
        setChatQuestion('');
        setChatHistory(prev => [...prev, { role: 'user', content: question }]);
        setChatLoading(true);

        try {
            const res = await fetch(endpoints.chat, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    summary,
                    question
                })
            });
            const data = await res.json();

            setChatHistory(prev => [
                ...prev,
                { role: 'ai', content: data.answer || "Sorry, I couldn't process that." }
            ]);
        } catch (err) {
            console.error(err);
            setChatHistory(prev => [
                ...prev,
                { role: 'ai', content: "Error: Could not connect to the AI." }
            ]);
        } finally {
            setChatLoading(false);
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
                onSave();
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
                <button onClick={generateInsights} disabled={loading} className="primary-btn pulse-anim">
                    {loading ? 'Analyzing...' : (insights ? 'Re-Analyze with New Data' : 'Generate Deep AI Analysis')}
                </button>
                {insights && (
                    <button onClick={saveReport} disabled={saving} className="secondary-btn">
                        {saving ? 'Saving...' : 'Save Report'}
                    </button>
                )}
            </div>

            {insights && (
                <>
                    <div className="markdown-content glass-card">
                        <div className="export-actions">
                            <button onClick={() => window.print()} className="text-btn">Export PDF</button>
                            <button onClick={() => navigator.clipboard.writeText(insights)} className="text-btn">Copy</button>
                            <button onClick={() => {
                                const blob = new Blob([insights], { type: 'text/plain' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `${filename}_insights.txt`;
                                a.click();
                            }} className="text-btn">Download .txt</button>
                        </div>
                        <h3>AI Executive Analysis</h3>
                        <ReactMarkdown>{insights}</ReactMarkdown>
                    </div>

                    <div className="chat-section glass-card" style={{ marginTop: '2rem' }}>
                        <h3>Chat with your Data</h3>
                        <div className="chat-history">
                            {chatHistory.map((msg, idx) => (
                                <div key={idx} className={`chat-msg ${msg.role}`}>
                                    <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            ))}
                            {chatLoading && <div className="chat-msg ai"><em>Thinking...</em></div>}
                        </div>

                        <form onSubmit={handleChatSubmit} className="chat-input-form">
                            <input
                                type="text"
                                value={chatQuestion}
                                onChange={(e) => setChatQuestion(e.target.value)}
                                placeholder="Ask a question (e.g., 'What is the trend?')"
                                className="search-input"
                                disabled={chatLoading}
                            />
                            <button type="submit" className="primary-btn" disabled={chatLoading || !chatQuestion}>
                                Send
                            </button>
                        </form>
                    </div>
                </>
            )
            }

            <style>{`
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    color: #fff;
                }
                .markdown-content h2 { border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-top: 1.5rem; }
                .markdown-content ul { padding-left: 1.5rem; }
                .markdown-content li { margin-bottom: 0.5rem; color: var(--text-secondary); }
                .export-actions { display: flex; gap: 0.5rem; justify-content: flex-end; margin-bottom: 1rem; }
                
                .chat-history {
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .chat-msg {
                    padding: 1rem;
                    border-radius: 12px;
                    max-width: 80%;
                }
                .chat-msg.user {
                    align-self: flex-end;
                    background: rgba(99, 102, 241, 0.2);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                }
                .chat-msg.ai {
                    align-self: flex-start;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .chat-input-form {
                    display: flex;
                    gap: 1rem;
                }
            `}</style>
        </div >
    );
};

export default Insights;
