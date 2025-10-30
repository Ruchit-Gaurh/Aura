const mongoose = require('mongoose');

const medicineLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  scheduledTime: {
    type: String, // HH:MM format
    required: true
  },
  actualTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['taken', 'skipped', 'missed'],
    required: true
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
medicineLogSchema.index({ userId: 1, date: -1 });
medicineLogSchema.index({ medicineId: 1, date: -1 });
medicineLogSchema.index({ userId: 1, medicineId: 1, date: 1, scheduledTime: 1 }, { unique: true });

module.exports = mongoose.model('MedicineLog', medicineLogSchema);