const AIConversation = require('../models/AIConversation.model');
const AIService = require('../services/aiService');

// @desc    Chat with AI assistant
const chatWithAI = async (req, res) => {
  try {
    const { message, includeNavigation, conversationId } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get or create conversation
    let conversation;
    const finalConversationId = conversationId || `conv_${userId}_${Date.now()}`;
    
    if (conversationId) {
      conversation = await AIConversation.findOne({ 
        conversationId,
        userId 
      });
    }

    if (!conversation) {
      conversation = new AIConversation({
        userId,
        conversationId: finalConversationId,
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response
    const aiService = new AIService();
    const response = await aiService.sendMessage(
      conversation.messages.slice(-10), // Last 10 messages for context
      includeNavigation
    );

    const aiResponse = response.choices[0].message.content;

    // Parse navigation intent
    let intent = null;
    let cleanResponse = aiResponse;
    const intentMatch = aiResponse.match(/\[INTENT:(.*?)\]/);
    
    if (intentMatch) {
      try {
        intent = JSON.parse(intentMatch[1]);
        cleanResponse = aiResponse.replace(/\[INTENT:.*?\]/, '').trim();
      } catch (e) {
        console.warn('Failed to parse intent:', e);
      }
    }

    // Add AI message
    conversation.messages.push({
      role: 'assistant',
      content: cleanResponse,
      timestamp: new Date(),
      intent
    });

    conversation.lastActivity = new Date();
    await conversation.save();

    // Generate suggestions
    const suggestions = aiService.generateSuggestions(message, cleanResponse);

    res.json({
      success: true,
      data: {
        response: cleanResponse,
        intent,
        suggestions,
        conversationId: conversation.conversationId
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to get AI response';
    if (error.message.includes('403')) {
      errorMessage = 'AI service access denied. Please check API configuration.';
    } else if (error.message.includes('401')) {
      errorMessage = 'AI service authentication failed. Please check API key.';
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorMessage = 'AI service is temporarily unavailable. Please try again later.';
    }
    
    res.status(500).json({
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Analyze voice command for navigation intent
const analyzeVoiceCommand = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        error: 'Command is required'
      });
    }

    const aiService = new AIService();
    const response = await aiService.sendMessage([{
      role: 'user',
      content: `Analyze this voice command for navigation intent: "${command}". Only respond with navigation if the user clearly wants to go somewhere or perform a specific action.`
    }], true);

    const aiResponse = response.choices[0].message.content;

    // Parse intent
    let intent = null;
    const intentMatch = aiResponse.match(/\[INTENT:(.*?)\]/);
    
    if (intentMatch) {
      try {
        intent = JSON.parse(intentMatch[1]);
      } catch (e) {
        console.warn('Failed to parse voice intent:', e);
      }
    }

    res.json({
      success: true,
      data: {
        intent,
        response: aiResponse.replace(/\[INTENT:.*?\]/, '').trim()
      }
    });

  } catch (error) {
    console.error('Voice command analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze voice command'
    });
  }
};

// @desc    Get conversation history
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await AIConversation.findOne({
      conversationId,
      userId,
      isActive: true
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      data: {
        conversationId: conversation.conversationId,
        messages: conversation.messages,
        summary: conversation.summary,
        lastActivity: conversation.lastActivity
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation'
    });
  }
};

// @desc    Clear conversation history
const clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await AIConversation.findOne({
      conversationId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Soft delete by setting isActive to false
    await AIConversation.findByIdAndUpdate(conversation._id, { 
      isActive: false 
    });

    res.json({
      success: true,
      message: 'Conversation cleared successfully'
    });

  } catch (error) {
    console.error('Clear conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation'
    });
  }
};

// @desc    Get user's conversation list
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const conversations = await AIConversation.find({
      userId,
      isActive: true
    })
    .select('conversationId summary lastActivity messages')
    .sort({ lastActivity: -1 })
    .limit(parseInt(limit));

    // Add message count and last message preview
    const conversationsWithPreview = conversations.map(conv => ({
      conversationId: conv.conversationId,
      summary: conv.summary,
      lastActivity: conv.lastActivity,
      messageCount: conv.messages.length,
      lastMessage: conv.messages.length > 0 ? 
        conv.messages[conv.messages.length - 1].content.substring(0, 100) + '...' : 
        null
    }));

    res.json({
      success: true,
      data: conversationsWithPreview
    });

  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
};

module.exports = {
  chatWithAI,
  analyzeVoiceCommand,
  getConversation,
  clearConversation,
  getUserConversations
};