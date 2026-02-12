const express = require('express');
const router = express.Router();
// const { GoogleGenerativeAI } = require("@google/generative-ai"); // For LLM check later

router.get('/', async (req, res) => {
    const status = {
        backend: 'OK',
        database: 'OK (In-Memory)', // Updated for Serverless
        llm: 'Unknown'
    };

    // Check Database (Memory Check)
    // Since we removed FS dependency, it is always OK
    status.database = 'OK (In-Memory)';

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
