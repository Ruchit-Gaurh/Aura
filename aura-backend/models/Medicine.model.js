const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'twice_daily', 'three_times_daily', 'weekly', 'as_needed'],
    required: true
  },
  times: [{
    type: String, // HH:MM format
    required: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  instructions: {
    type: String
  },
  withFood: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
medicineSchema.index({ userId: 1, isActive: 1 });
medicineSchema.index({ times: 1, isActive: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);