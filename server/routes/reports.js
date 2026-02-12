const express = require('express');
const router = express.Router();

// In-Memory Storage for Serverless (Vercel has read-only FS)
// Note: This data will be lost when the server restart/cold boots.
// For persistent storage, use a database (MongoDB/Postgres).
const reports = [];

// GET last 5 reports
router.get('/', (req, res) => {
    try {
        // Return only last 5, reversed (newest first)
        const last5 = reports.slice(-5).reverse();
        res.json(last5);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

// POST save a new report
router.post('/', (req, res) => {
    const { filename, summary, insights } = req.body;

    if (!filename || !insights) {
        return res.status(400).json({ error: 'Missing report data' });
    }

    try {
        const newReport = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            filename,
            summary,
            insights
        };

        reports.push(newReport);

        // Limit memory usage
        if (reports.length > 20) {
            reports.shift();
        }

        res.json({ message: 'Report saved (In-Memory)', reportId: newReport.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save report' });
    }
});

module.exports = router;
