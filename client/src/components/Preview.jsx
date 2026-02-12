import React from 'react';

const Preview = ({ data }) => {
    if (!data || !data.preview || data.preview.length === 0) return null;

    const headers = Object.keys(data.preview[0]);

    return (
        <div className="preview-container">
            <h3>Data Preview ({data.rowCount} rows)</h3>
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
                                {headers.map(h => <td key={h}>{row[h]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="hint">Showing first 20 rows.</p>
        </div>
    );
};

export default Preview;
