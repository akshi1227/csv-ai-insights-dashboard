const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

router.post('/', async (req, res) => {
    const { summary, question, history } = req.body;

    if (!summary || !question) {
        return res.status(400).json({ error: 'Summary and question are required' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Deep AI features unavailable (Missing API Key)' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: history || [], // Optional: maintain conversation history
            generationConfig: {
                maxOutputTokens: 200, // Shorter response for speed
            },
        });

        // Truncate summary to avoid huge payload / token costs
        const safeSummary = JSON.stringify(summary).substring(0, 5000);

        const prompt = `
        Context: The user is asking a question about a CSV dataset.
        Dataset Summary (Truncated): ${safeSummary}
        
        User Question: "${question}"
        
        Answer concisely in 1-2 sentences. If the answer isn't in the summary/preview, say "I can't see that data in the preview."
        `;

        // Race timeout (5s)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI Chat Timed Out')), 5000)
        );

        const result = await Promise.race([chat.sendMessage(prompt), timeoutPromise]);
        const response = await result.response;
        const text = response.text();

        res.json({ answer: text });

    } catch (error) {
        console.error('Chat AI Error:', error.message);
        res.status(500).json({ error: 'AI unavailable. Please try again.' });
    }
});

module.exports = router;
