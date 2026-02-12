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
        You are an elite Data Scientist. Your goal is to provide a comprehensive, executive-level analysis of the provided dataset summary.
        
        Dataset Summary:
        ${JSON.stringify(summary, null, 2)}
        
        Provide a structured analysis in Markdown format using the following sections:
        
        ## 📊 Executive Summary
        A 2-3 sentence high-level overview of what this dataset represents and the most critical finding.

        ## 📈 Key Trends & Patterns
        - Identify correlations, rising/falling trends, or dominant categories.
        - Use bullet points for clarity.

        ## ⚠️ Anomalies & Outliers
        - Highlight any data points that deviate significantly from the norm.
        - Mention potential data quality issues (null values, extreme ranges).

        ## 💡 Strategic Recommendations
        - Actionable advice based on the data. What should the user do next?

        ## 🔍 Quick Stats
        - A small table or list of key metrics (highest/lowest values, averages).
        
        Tone: Professional, Insightful, and Innovative. Use emojis sparingly to make headings pop.
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
