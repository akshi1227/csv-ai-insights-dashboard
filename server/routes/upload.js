const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeCsv } = require('../utils/csvAnalyzer');

// Configure Multer for Memory Storage (Serverless friendly)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 4.5 * 1024 * 1024 } // Limit to 4.5MB for Vercel
});

router.post('/', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Analyze the CSV from Buffer
        const analysis = await analyzeCsv(req.file.buffer);

        res.json({
            message: 'File processing successful',
            filename: req.file.originalname,
            summary: analysis
        });

    } catch (error) {
        console.error('Upload error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to process CSV' });
    }
});

module.exports = router;
