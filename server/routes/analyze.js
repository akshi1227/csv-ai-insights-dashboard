const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Fallback generator if AI fails
const generateFallbackAnalysis = (summary) => {
    const columns = Object.keys(summary.columnStats || {});
    let analysis = `## 📊 Executive Summary (Offline Mode)
    
Analysis generated using statistical heuristics (AI unavailable). The dataset contains **${summary.rowCount} rows** and **${columns.length} columns**.

## 📈 Key Patterns
`;

    columns.forEach(col => {
        const stats = summary.columnStats[col];
        if (stats.type === 'number') {
            const min = stats.min !== undefined ? stats.min : '?';
            const max = stats.max !== undefined ? stats.max : '?';
            const avg = stats.mean !== undefined ? stats.mean.toFixed(2) : '?';
            analysis += `- **${col}**: Ranges from ${min} to ${max} (Avg: ${avg}).\n`;
        } else {
            analysis += `- **${col}**: Contains categorical data with ${stats.uniqueCount || '?'} unique values.\n`;
        }
    });

    analysis += `\n## 💡 Recommendations
- Check 504 Gateway Timeouts on Vercel (function took too long).
- Verify GEMINI_API_KEY is set in Vercel Environment Variables.
`;

    return analysis;
};

router.post('/', async (req, res) => {
    const { summary } = req.body;

    if (!summary) {
        return res.status(400).json({ error: 'No summary provided' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;

        // 1. Check Config
        if (!apiKey) {
            console.warn('Missing GEMINI_API_KEY. Using fallback.');
            return res.json({ insights: generateFallbackAnalysis(summary) });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Analyze this dataset summary and provide 3 very short, bulleted sections:
        
        ## 📊 Summary
        (2 sentences max)

        ## 📈 Trends
        (3 bullet points max)

        ## 💡 Action
        (1 recommendation)
        
        Keep it under 300 words. FAST response.
        
        Summary: ${JSON.stringify(summary).substring(0, 5000)}
        `;

        // 2. Race strict timeout (5 seconds for Instant Feel)
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI Usage Limit / Timeout')), 5000)
        );

        const aiPromise = model.generateContent(prompt);

        const result = await Promise.race([aiPromise, timeoutPromise]);
        const response = await result.response;
        const text = response.text();

        res.json({ insights: text });

    } catch (error) {
        console.error('LLM Error/Timeout:', error.message);
        // 3. Fallback on Error (don't crash the UI)
        res.json({
            insights: generateFallbackAnalysis(summary),
            warning: 'AI request failed, showing statistical analysis.'
        });
    }
});

module.exports = router;
