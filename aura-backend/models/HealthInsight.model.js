const mongoose = require('mongoose');

const healthInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily_summary', 'weekly_report', 'symptom_analysis', 'adherence_insight'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  recommendations: [{
    type: String
  }],
  dataPoints: {
    medicineAdherence: Number,
    moodScore: Number,
    energyLevel: Number,
    symptomsCount: Number
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
healthInsightSchema.index({ userId: 1, generatedAt: -1 });
healthInsightSchema.index({ userId: 1, type: 1 });
healthInsightSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('HealthInsight', healthInsightSchema);