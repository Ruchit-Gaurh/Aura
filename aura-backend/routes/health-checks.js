const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createHealthCheck,
  getHealthChecks,
  getHealthCheckByDate,
  deleteHealthCheck,
  getHealthTrends
} = require('../controllers/healthCheckController');

// @route   POST api/health-checks
// @desc    Create or update daily health check
// @access  Private
router.post('/', auth, createHealthCheck);

// @route   GET api/health-checks
// @desc    Get health check history
// @access  Private
router.get('/', auth, getHealthChecks);

// @route   GET api/health-checks/trends
// @desc    Get health trends and analytics
// @access  Private
router.get('/trends', auth, getHealthTrends);

// @route   GET api/health-checks/:date
// @desc    Get health check by date (YYYY-MM-DD format)
// @access  Private
router.get('/:date', auth, getHealthCheckByDate);

// @route   DELETE api/health-checks/:id
// @desc    Delete a health check
// @access  Private
router.delete('/:id', auth, deleteHealthCheck);

module.exports = router;