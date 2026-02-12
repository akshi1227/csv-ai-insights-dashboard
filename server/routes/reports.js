const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const REPORTS_FILE = path.join(__dirname, '../../reports/reports.json');

// Helper to read reports
const getReports = () => {
    if (!fs.existsSync(REPORTS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(REPORTS_FILE);
    return JSON.parse(data);
};

// Helper to save reports
const saveReports = (reports) => {
    fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
};

// GET last 5 reports
router.get('/', (req, res) => {
    try {
        const reports = getReports();
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
        const reports = getReports();
        const newReport = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            filename,
            summary, // Optional: save summary too if needed
            insights
        };

        reports.push(newReport);
        saveReports(reports);

        res.json({ message: 'Report saved', reportId: newReport.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save report' });
    }
});

module.exports = router;
