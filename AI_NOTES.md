# AI Implementation Notes

## Strategy
We use a Two-Step approach to keep costs low and analysis relevant:
1.  **Summarization**: The backend calculates summary statistics (mean, median, null accounts) and samples the first 5 rows.
2.  **Prompting**: We send *only* this summary metadata to the LLM, not the full CSV.

## Prompts

### Insight Generation
```text
System: You are a data analyst helper.
User: Analyze this dataset summary:
[JSON Summary of Columns, Types, and Sample Rows]

Provide:
1. Trends
2. Outliers
3. Potential Data Issues
4. Recommended Next Steps
```

## Models Tested
- Google Gemini 1.5 Flash (Preferred for speed and high rate limits on the free tier)
- OpenAI GPT-4o-mini (Alternative for consistent structured JSON output)

## Development Breakdown

### AI Contribution
- **Boilerplate Generation**: AI helped scaffold the initial Express server and React file upload component.
- **Prompt Engineering**: Refined the system instructions to ensure the AI returns clean Markdown formatting for the reports.
- **Debugging**: Used AI to troubleshoot initial CORS issues between the frontend and backend.

### Human Implementation
- **Architecture Design**: Decided on the Client-Server architecture and the "Summarize-First" strategy to handle large CSVs efficiently.
- **Security Logic**: Implemented the API key handling and verified that no keys are hardcoded.
- **UI/UX Polish**: Styled the dashboard to be responsive and user-friendly, ensuring a clean "SaaS" look.

