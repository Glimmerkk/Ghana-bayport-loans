const express = require('express');
const router = express.Router();
const telegramController = require('../controllers/telegramController');

// Send message to Telegram
router.post('/send-message', telegramController.sendMessage);

// Get updates from Telegram
router.get('/get-updates/:offset?', telegramController.getUpdates);

// Handle approval callback
router.post('/approve', telegramController.handleApproval);

module.exports = router;