const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContactById,
  triggerEmergencyAlert
} = require('../controllers/emergencyContactController');

// @route   GET api/emergency-contacts
// @desc    Get all emergency contacts for authenticated user
// @access  Private
router.get('/', auth, getEmergencyContacts);

// @route   POST api/emergency-contacts
// @desc    Create a new emergency contact
// @access  Private
router.post('/', auth, createEmergencyContact);

// @route   GET api/emergency-contacts/:id
// @desc    Get emergency contact by ID
// @access  Private
router.get('/:id', auth, getEmergencyContactById);

// @route   PUT api/emergency-contacts/:id
// @desc    Update an emergency contact
// @access  Private
router.put('/:id', auth, updateEmergencyContact);

// @route   DELETE api/emergency-contacts/:id
// @desc    Delete an emergency contact
// @access  Private
router.delete('/:id', auth, deleteEmergencyContact);

module.exports = router;