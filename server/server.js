require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for now to fix generic CORS issues
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for large CSV summaries
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Operational Rigor: Structured Logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration_ms: duration,
            user_agent: req.get('user-agent')
        }));
    });
    next();
});

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running 🚀', timestamp: new Date() });
});

// Routes
const statusRoutes = require('./routes/status');
const uploadRoutes = require('./routes/upload');
const analyzeRoutes = require('./routes/analyze');
const reportRoutes = require('./routes/reports');
const chatRoutes = require('./routes/chat');

app.use('/status', statusRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

// Start Server only if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
