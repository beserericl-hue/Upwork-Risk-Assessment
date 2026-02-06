require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Config endpoint - provides webhook URL to frontend
app.get('/api/config', (req, res) => {
    res.json({
        webhookUrl: process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/risk-assessment'
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 Risk Assessment Wizard running at http://localhost:${PORT}`);
    console.log(`📧 Access with email: http://localhost:${PORT}?email=test@example.com`);
    console.log(`🔗 Webhook URL: ${process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/risk-assessment'}`);
});
