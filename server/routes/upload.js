const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeCsv } = require('../utils/csvAnalyzer');

// Configure Multer
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;

        // Analyze the CSV
        const analysis = await analyzeCsv(filePath);

        // Clean up file after analysis (optional, but good for keeping space free)
        // For this app, we might want to keep it if we need to re-read, but 
        // our flow sends summary to LLM, so we don't strictly need the file anymore.
        // Let's keep it for now in case we want to implement "download original".

        res.json({
            message: 'File processing successful',
            filename: req.file.filename,
            summary: analysis
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to process CSV' });
    }
});

module.exports = router;
