const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createMedicineLog,
  getMedicineLogs,
  getMedicineStats,
  updateMedicineLog
} = require('../controllers/medicineLogController');

// @route   POST api/medicine-logs
// @desc    Create a medicine log entry
// @access  Private
router.post('/', auth, createMedicineLog);

// @route   GET api/medicine-logs
// @desc    Get medicine logs with optional filtering
// @access  Private
router.get('/', auth, getMedicineLogs);

// @route   GET api/medicine-logs/stats
// @desc    Get medicine adherence statistics
// @access  Private
router.get('/stats', auth, getMedicineStats);

// @route   PUT api/medicine-logs/:id
// @desc    Update a medicine log entry
// @access  Private
router.put('/:id', auth, updateMedicineLog);

module.exports = router;