import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Charts = ({ summary }) => {
    if (!summary || !summary.columns) return null;

    // Find first numeric column to chart
    const numericCol = summary.columns.find(c => c.type === 'number');
    if (!numericCol) return null;

    const data = {
        labels: numericCol.sample.map((_, i) => `Sample ${i + 1}`),
        datasets: [
            {
                label: `Sample Values: ${numericCol.name}`,
                data: numericCol.sample, // These might be strings, ChartJS usually handles or we need to parse
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Data Snapshot: ${numericCol.name}` },
        },
    };

    return (
        <div className="chart-container" style={{ marginTop: '2rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
            <Bar options={options} data={data} />
        </div>
    );
};

export default Charts;
