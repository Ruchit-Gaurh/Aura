const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAppointments, createAppointment, updateAppointment } = require('../controllers/appointmentController');

// @route   GET api/appointments
// @desc    Get all appointments for a user
router.get('/', auth, getAppointments);

// @route   POST api/appointments
// @desc    Create an appointment
router.post('/', auth, createAppointment);

// @route   PUT api/appointments/:id
// @desc    Update appointment status or add transcript
router.put('/:id', auth, updateAppointment);

module.exports = router;