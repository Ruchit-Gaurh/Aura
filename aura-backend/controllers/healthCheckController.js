const HealthCheck = require('../models/HealthCheck.model');

// @desc    Create or update daily health check
const createHealthCheck = async (req, res) => {
  const { date, mood, energyLevel, symptoms, notes } = req.body;

  try {
    // Validate required fields
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Date is required'
      });
    }

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Check if health check already exists for this date
    let healthCheck = await HealthCheck.findOne({
      userId: req.user.id,
      date: checkDate
    });

    if (healthCheck) {
      // Update existing health check
      const updateFields = {};
      if (mood !== undefined) updateFields.mood = mood;
      if (energyLevel !== undefined) updateFields.energyLevel = energyLevel;
      if (symptoms !== undefined) updateFields.symptoms = symptoms;
      if (notes !== undefined) updateFields.notes = notes;

      healthCheck = await HealthCheck.findByIdAndUpdate(
        healthCheck._id,
        updateFields,
        { new: true, runValidators: true }
      );
    } else {
      // Create new health check
      healthCheck = new HealthCheck({
        userId: req.user.id,
        date: checkDate,
        mood,
        energyLevel,
        symptoms: symptoms || [],
        notes
      });

      await healthCheck.save();
    }

    res.status(201).json({
      success: true,
      data: healthCheck
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get health check history
const getHealthChecks = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    // Build query
    const query = { userId: req.user.id };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: start,
        $lte: end
      };
    }

    const healthChecks = await HealthCheck.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: healthChecks
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get health check by date
const getHealthCheckByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const healthCheck = await HealthCheck.findOne({
      userId: req.user.id,
      date: checkDate
    });

    if (!healthCheck) {
      return res.status(404).json({
        success: false,
        error: 'Health check not found for this date'
      });
    }

    res.json({
      success: true,
      data: healthCheck
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete health check
const deleteHealthCheck = async (req, res) => {
  try {
    const healthCheck = await HealthCheck.findById(req.params.id);

    if (!healthCheck) {
      return res.status(404).json({
        success: false,
        error: 'Health check not found'
      });
    }

    // Make sure user owns the health check
    if (healthCheck.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    await HealthCheck.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Health check deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get health trends and analytics
const getHealthTrends = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - parseInt(days) * 24 * 60 * 60 * 1000);

    // Get mood trends
    const moodTrends = await HealthCheck.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate, $lte: endDate },
          mood: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get energy level trends
    const energyTrends = await HealthCheck.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate, $lte: endDate },
          energyLevel: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgEnergy: { $avg: '$energyLevel' },
          minEnergy: { $min: '$energyLevel' },
          maxEnergy: { $max: '$energyLevel' }
        }
      }
    ]);

    // Get common symptoms
    const symptomTrends = await HealthCheck.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate, $lte: endDate },
          symptoms: { $exists: true, $ne: [] }
        }
      },
      {
        $unwind: '$symptoms'
      },
      {
        $group: {
          _id: '$symptoms',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        moodTrends,
        energyTrends: energyTrends[0] || { avgEnergy: 0, minEnergy: 0, maxEnergy: 0 },
        symptomTrends
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createHealthCheck,
  getHealthChecks,
  getHealthCheckByDate,
  deleteHealthCheck,
  getHealthTrends
};