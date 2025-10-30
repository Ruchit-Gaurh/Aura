const mongoose = require('mongoose');

const healthCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'very_poor']
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  symptoms: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
healthCheckSchema.index({ userId: 1, date: -1 });
healthCheckSchema.index({ userId: 1, date: 1 }, { unique: true }); // One health check per day per user

module.exports = mongoose.model('HealthCheck', healthCheckSchema);