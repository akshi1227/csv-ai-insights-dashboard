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
        labels: numericCol.sample.map((_, i) => `Entry ${i + 1}`),
        datasets: [
            {
                label: `Value: ${numericCol.name}`,
                data: numericCol.sample,
                backgroundColor: 'rgba(99, 102, 241, 0.6)', // Indigo
                borderColor: '#6366f1',
                borderWidth: 1,
                hoverBackgroundColor: '#a855f7', // Purple on hover
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#a0a0b0' }
            },
            title: {
                display: true,
                text: `Data Snapshot: ${numericCol.name}`,
                color: '#fff'
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: '#a0a0b0' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#a0a0b0' }
            }
        }
    };

    return (
        <div className="chart-container" style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px'
        }}>
            <Bar options={options} data={data} />
        </div>
    );
};

export default Charts;
