const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.ADMIN_CHAT_ID;

// Send message to Telegram
exports.sendMessage = async (req, res) => {
    try {
        const { message, chatId = CHAT_ID } = req.body;
        
        if (!BOT_TOKEN) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram bot token not configured' 
            });
        }

        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            }
        );
        
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Telegram Error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send message to Telegram' 
        });
    }
};

// Get updates from Telegram
exports.getUpdates = async (req, res) => {
    try {
        const { offset = 0 } = req.params;
        
        if (!BOT_TOKEN) {
            return res.status(500).json({ 
                success: false, 
                error: 'Telegram bot token not configured' 
            });
        }

        const response = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`,
            {
                params: {
                    offset,
                    timeout: 30
                }
            }
        );
        
        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Telegram Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get updates' 
        });
    }
};

// Handle approval from bot
exports.handleApproval = (req, res) => {
    const { referenceId, action, codeLength } = req.body;
    
    console.log(`Application ${referenceId}: ${action}`);
    
    res.json({ 
        success: true, 
        message: `Application ${referenceId} ${action}`,
        codeLength 
    });
};