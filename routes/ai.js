const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { detectIntent } = require('../controllers/dialogflowController');
const { summarizeTranscript, generateResponse } = require('../controllers/llmController');

// @route   POST api/ai/dialogflow/detect-intent
// @desc    Detect intent using Dialogflow CX
// @access  Private
router.post('/dialogflow/detect-intent', auth, detectIntent);

// @route   POST api/ai/summarize
// @desc    Summarize transcript using local LLM
// @access  Private
router.post('/summarize', auth, summarizeTranscript);

// @route   POST api/ai/generate
// @desc    Generate response using local LLM
// @access  Private
router.post('/generate', auth, generateResponse);

module.exports = router;