import React, { useState } from 'react';
import './App.css';
import Status from './components/Status';
import Upload from './components/Upload';
import Preview from './components/Preview';
import Insights from './components/Insights';
import Reports from './components/Reports';
import Charts from './components/Charts';

function App() {
  const [data, setData] = useState(null); // { filename, summary, preview }
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleUploadSuccess = (uploadData) => {
    setData(uploadData); // { filename, summary: { ...preview, ... } }
  };

  const handleLoadReport = (report) => {
    // Reconstruct data state from report
    setData({
      filename: report.filename,
      summary: report.summary,
      // If report saved data preview, we could show it.
      // Current report saving implementation saves summary and insights.
      // Summary object has 'preview' in it from backend.
    });
  };

  const handleSaveSuccess = () => {
    setRefreshHistory(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CSV Insights Dashboard</h1>
        <Status />
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <Reports
            refreshTrigger={refreshHistory}
            onLoadReport={handleLoadReport}
          />
        </aside>

        <section className="content">
          {!data ? (
            <div className="welcome-screen">
              <h2>Welcome</h2>
              <p>Upload a CSV file to get started.</p>
              <Upload onUploadSuccess={handleUploadSuccess} />
            </div>
          ) : (
            <div className="dashboard">
              <div className="top-bar">
                <h2>Analysis: {data.filename}</h2>
                <button onClick={() => setData(null)} className="text-btn">New Upload</button>
              </div>

              {/* Data Preview */}
              <Preview data={data.summary} />

              {/* Charts */}
              <Charts summary={data.summary} />

              {/* AI Insights & Save */}
              <Insights
                summary={data.summary}
                filename={data.filename}
                onSave={handleSaveSuccess}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
