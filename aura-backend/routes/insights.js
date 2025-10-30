const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getHealthSummary,
  analyzeSymptoms,
  getHealthInsights,
  markInsightAsRead
} = require('../controllers/healthInsightController');

// @route   GET api/insights/health-summary
// @desc    Get AI-generated health insights based on user data
// @access  Private
router.get('/health-summary', auth, getHealthSummary);

// @route   POST api/insights/analyze-symptoms
// @desc    Analyze symptoms using AI
// @access  Private
router.post('/analyze-symptoms', auth, analyzeSymptoms);

// @route   GET api/insights
// @desc    Get health insights history
// @access  Private
router.get('/', auth, getHealthInsights);

// @route   PUT api/insights/:id/read
// @desc    Mark health insight as read
// @access  Private
router.put('/:id/read', auth, markInsightAsRead);

module.exports = router;