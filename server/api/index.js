const express = require("express");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware
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
        }));
    });
    next();
});

// Import Routes
const statusRoutes = require('../routes/status');
const uploadRoutes = require('../routes/upload');
const analyzeRoutes = require('../routes/analyze');
const reportRoutes = require('../routes/reports');
const chatRoutes = require('../routes/chat');

// Mount Routes
app.use('/status', statusRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);

// Root Route
app.get("/", (req, res) => {
    res.json({ status: "Backend running" });
});

module.exports = app;
