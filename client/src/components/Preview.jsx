import React from 'react';

const Preview = ({ data, onUpdate }) => {
    if (!data || !data.preview || data.preview.length === 0) return null;

    const headers = Object.keys(data.preview[0]);

    return (
        <div className="preview-container glass-card">
            <div className="preview-header">
                <h3>Data Preview & Editor ({data.rowCount} rows)</h3>
                <span className="hint-badge">✨ You can edit values here to update charts instantly!</span>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            {headers.map(h => <th key={h}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.preview.map((row, i) => (
                            <tr key={i}>
                                {headers.map(h => (
                                    <td key={h}>
                                        <input
                                            type="text"
                                            className="editable-cell"
                                            value={row[h]}
                                            onChange={(e) => onUpdate(i, h, e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="hint">Showing first 20 rows. Edits here update the analysis context.</p>

            <style>{`
                .preview-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                .hint-badge {
                    background: rgba(99, 102, 241, 0.2);
                    color: #fff;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    border: 1px solid rgba(99, 102, 241, 0.5);
                }
                .editable-cell {
                    background: transparent;
                    border: none;
                    color: inherit;
                    width: 100%;
                    font-family: inherit;
                    font-size: inherit;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: background 0.2s;
                }
                .editable-cell:focus {
                    background: rgba(255, 255, 255, 0.1);
                    outline: 1px solid var(--neon-blue);
                }
                .editable-cell:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </div>
    );
};

export default Preview;
