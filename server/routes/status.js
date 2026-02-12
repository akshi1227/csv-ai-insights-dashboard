const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
// const { GoogleGenerativeAI } = require("@google/generative-ai"); // For LLM check later

router.get('/', async (req, res) => {
    const status = {
        backend: 'OK',
        database: 'OK', // Checking if reports directory is accessible
        llm: 'Unknown' // Todo: Implement real check
    };

    // Check Database (Reports Directory)
    const reportsDir = path.join(__dirname, '../../reports');
    try {
        if (fs.existsSync(reportsDir)) {
            status.database = 'OK';
        } else {
            status.database = 'Error: Reports dir not found';
        }
    } catch (err) {
        status.database = 'Error';
    }

    // Check LLM (Placeholder)
    // In a real app, we'd make a tiny request. 
    // For now, we'll check if API key is present.
    if (process.env.GEMINI_API_KEY) {
        status.llm = 'Ready (Key Present)';
    } else {
        status.llm = 'Error: No API Key';
    }

    res.json(status);
});

module.exports = router;
