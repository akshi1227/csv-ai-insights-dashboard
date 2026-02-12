require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const statusRoutes = require('./routes/status');
const uploadRoutes = require('./routes/upload');
const analyzeRoutes = require('./routes/analyze');
const reportRoutes = require('./routes/reports');

app.use('/status', statusRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/reports', reportRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
