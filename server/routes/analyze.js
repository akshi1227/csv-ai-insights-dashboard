const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/', async (req, res) => {
    const { summary } = req.body;

    if (!summary) {
        return res.status(400).json({ error: 'No summary provided' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            // Mock response if no key (for testing without billing)
            // Or return error. Let's return error but with a hint.
            return res.status(500).json({
                error: 'Server missing GEMINI_API_KEY',
                mock: 'This is a mock response because API key is missing.'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert data analyst. 
        Analyze the following dataset summary and provide insights:
        
        Dataset Summary:
        ${JSON.stringify(summary, null, 2)}
        
        Please provide a response in Markdown format with the following sections:
        1. **Trends**: Identify any patterns or trends based on the summary (e.g. numerical ranges, categories).
        2. **Outliers**: Potential outliers based on min/max or sample values.
        3. **Data Quality**: Issues like missing values (nullCount) or inconsistencies.
        4. **Recommendations**: What should be checked next?
        
        Keep it concise and professional.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ insights: text });

    } catch (error) {
        console.error('LLM Error:', error);
        res.status(500).json({ error: 'Failed to generate insights' });
    }
});

module.exports = router;
