require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI Chat Endpoint for Tutor / Readable AI
app.post('/api/chat', async (req, res) => {
    try {
        const { message, systemPrompt } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return res.status(500).json({ error: 'Anthropic API key is not configured on the server.' });
        }

        const response = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt || 'You are an AI Tutor for the Tagore Learning Platform. Be helpful, concise, and educational.',
            messages: [
                { role: 'user', content: message }
            ],
        });

        res.json({ reply: response.content[0].text });
    } catch (error) {
        console.error('Anthropic API Error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI server.' });
    }
});

// Fallback route to index.html for SPA-like behavior or deep linking
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
