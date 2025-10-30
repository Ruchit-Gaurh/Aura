const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    enum: ['doctor', 'family', 'friend', 'caregiver', 'emergency_service'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  isPrimary: {
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
emergencyContactSchema.index({ userId: 1, isActive: 1 });
emergencyContactSchema.index({ userId: 1, isPrimary: 1 });

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);