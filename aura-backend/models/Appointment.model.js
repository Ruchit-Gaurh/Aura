const mongoose = require('mongoose');
const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorName: { type: String, required: true },
  appointmentTime: { type: Date, required: true },
  status: { type: String, enum:['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  transcript: { type: String }
});
module.exports = mongoose.model('Appointment', AppointmentSchema);