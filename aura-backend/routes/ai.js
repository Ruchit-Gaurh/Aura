const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { detectIntent } = require('../controllers/dialogflowController');
const { summarizeTranscript, generateResponse } = require('../controllers/llmController');
const {
  chatWithAI,
  analyzeVoiceCommand,
  getConversation,
  clearConversation,
  getUserConversations
} = require('../controllers/aiChatController');

// @route   POST api/ai/dialogflow/detect-intent
// @desc    Detect intent using Dialogflow CX
// @access  Private
router.post('/dialogflow/detect-intent', auth, detectIntent);

// @route   POST api/ai/chat
// @desc    Send message to AI assistant (Futurix AI)
// @access  Private
router.post('/chat', auth, chatWithAI);

// @route   POST api/ai/voice-command
// @desc    Analyze voice command for navigation intent
// @access  Private
router.post('/voice-command', auth, analyzeVoiceCommand);

// @route   GET api/ai/conversation/:conversationId
// @desc    Get conversation history
// @access  Private
router.get('/conversation/:conversationId', auth, getConversation);

// @route   DELETE api/ai/conversation/:conversationId
// @desc    Clear conversation history
// @access  Private
router.delete('/conversation/:conversationId', auth, clearConversation);

// @route   GET api/ai/conversations
// @desc    Get user's conversation list
// @access  Private
router.get('/conversations', auth, getUserConversations);

// @route   POST api/ai/summarize
// @desc    Summarize transcript using local LLM
// @access  Private
router.post('/summarize', auth, summarizeTranscript);

// @route   POST api/ai/generate
// @desc    Generate response using local LLM
// @access  Private
router.post('/generate', auth, generateResponse);

module.exports = router;