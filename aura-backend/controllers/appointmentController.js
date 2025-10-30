const Appointment = require('../models/Appointment.model');

// @desc    Get all appointments for a user
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).sort({ appointmentTime: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create an appointment
const createAppointment = async (req, res) => {
  const { doctorName, appointmentTime } = req.body;

  try {
    const newAppointment = new Appointment({
      patient: req.user.id,
      doctorName,
      appointmentTime,
      status: 'Scheduled'
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update appointment status or add transcript
const updateAppointment = async (req, res) => {
  const { status, transcript } = req.body;

  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Make sure user owns appointment
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (status) appointment.status = status;
    if (transcript) appointment.transcript = transcript;

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment
};