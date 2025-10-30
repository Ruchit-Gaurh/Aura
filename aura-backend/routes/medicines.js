const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineById
} = require('../controllers/medicineController');

// @route   GET api/medicines
// @desc    Get all medicines for authenticated user
// @access  Private
router.get('/', auth, getMedicines);

// @route   POST api/medicines
// @desc    Create a new medicine
// @access  Private
router.post('/', auth, createMedicine);

// @route   GET api/medicines/:id
// @desc    Get medicine by ID
// @access  Private
router.get('/:id', auth, getMedicineById);

// @route   PUT api/medicines/:id
// @desc    Update a medicine
// @access  Private
router.put('/:id', auth, updateMedicine);

// @route   DELETE api/medicines/:id
// @desc    Delete a medicine
// @access  Private
router.delete('/:id', auth, deleteMedicine);

module.exports = router;