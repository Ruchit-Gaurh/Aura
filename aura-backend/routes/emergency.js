const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { triggerEmergencyAlert } = require('../controllers/emergencyContactController');

// @route   POST api/emergency/trigger
// @desc    Trigger emergency alert
// @access  Private
router.post('/trigger', auth, triggerEmergencyAlert);

module.exports = router;