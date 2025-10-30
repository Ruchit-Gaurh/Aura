const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    intent: {
      action: String,
      screen: String,
      confidence: Number,
      parameters: mongoose.Schema.Types.Mixed
    }
  }],
  summary: {
    type: String
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
aiConversationSchema.index({ userId: 1, conversationId: 1 });
aiConversationSchema.index({ userId: 1, lastActivity: -1 });

module.exports = mongoose.model('AIConversation', aiConversationSchema);