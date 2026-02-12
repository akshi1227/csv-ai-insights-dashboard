# CSV Insights Dashboard

A full-stack SaaS-style application for analyzing CSV data with AI.

## Features
- **Upload CSV**: Parse and preview data instantly.
- **AI Insights**: Generate trends, outliers, and recommendations using Gemini/OpenAI.
- **Reports**: Save and export analysis reports.
- **Status Page**: Monitor system health.

## Tech Stack
- **Frontend**: React (Vite) + Vanilla CSS
- **Backend**: Node.js + Express
- **AI**: Google Gemini Pro / OpenAI GPT
- **Storage**: Local JSON file

## Getting Started

### Prerequisites
- Node.js (v18+)
- API Key for Gemini (`GEMINI_API_KEY`) or OpenAI (`OPENAI_API_KEY`)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd csv-insights-app
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    cp .env.example .env
    # Add your API key to .env
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Open App**
    Visit `http://localhost:5173`

## Project Structure
- `client/`: React frontend
- `server/`: Express backend
- `reports/`: Stored reports

## Hosting
- **Live App Base URL**: [Insert Vercel/Netlify Link Here]
- **Backend Base URL**: [Insert Render/Railway Link Here]

## Limitations
- **File Size**: Currently optimized for CSV files under 5MB.
- **Token Limit**: Very large datasets are summarized before sending to the AI to stay within token limits.
- **Data Privacy**: Data is processed locally for summary generation; only metadata and samples are sent to the AI provider.

