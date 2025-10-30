const MedicineLog = require('../models/MedicineLog.model');
const Medicine = require('../models/Medicine.model');

// @desc    Create a medicine log entry
const createMedicineLog = async (req, res) => {
  const { medicineId, scheduledTime, actualTime, status, notes } = req.body;

  try {
    // Validate required fields
    if (!medicineId || !scheduledTime || !status) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: medicineId, scheduledTime, status'
      });
    }

    // Validate medicine exists and belongs to user
    const medicine = await Medicine.findById(medicineId);
    if (!medicine || medicine.userId.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: 'Medicine not found or not authorized'
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(scheduledTime)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scheduledTime format. Use HH:MM format'
      });
    }

    // Use current date if not provided
    const logDate = new Date();
    logDate.setHours(0, 0, 0, 0); // Set to start of day

    // Check if log already exists for this medicine, date, and time
    const existingLog = await MedicineLog.findOne({
      userId: req.user.id,
      medicineId,
      date: logDate,
      scheduledTime
    });

    if (existingLog) {
      return res.status(400).json({
        success: false,
        error: 'Medicine log already exists for this time today'
      });
    }

    const medicineLog = new MedicineLog({
      userId: req.user.id,
      medicineId,
      scheduledTime,
      actualTime: actualTime ? new Date(actualTime) : new Date(),
      status,
      notes,
      date: logDate
    });

    await medicineLog.save();

    // Populate medicine details
    await medicineLog.populate('medicineId', 'name dosage');

    res.status(201).json({
      success: true,
      data: medicineLog
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get medicine logs with optional filtering
const getMedicineLogs = async (req, res) => {
  try {
    const { date, startDate, endDate, medicineId } = req.query;
    
    // Build query
    const query = { userId: req.user.id };

    if (date) {
      const queryDate = new Date(date);
      queryDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(queryDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.date = {
        $gte: queryDate,
        $lt: nextDay
      };
    } else if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      query.date = {
        $gte: start,
        $lte: end
      };
    }

    if (medicineId) {
      query.medicineId = medicineId;
    }

    const logs = await MedicineLog.find(query)
      .populate('medicineId', 'name dosage')
      .sort({ date: -1, scheduledTime: 1 });

    res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get medicine adherence statistics
const getMedicineStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Default to last 30 days if no dates provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    end.setHours(23, 59, 59, 999);
    start.setHours(0, 0, 0, 0);

    // Get overall statistics
    const overallStats = await MedicineLog.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Calculate totals
    let totalScheduled = 0;
    let taken = 0;
    let skipped = 0;
    let missed = 0;

    overallStats.forEach(stat => {
      totalScheduled += stat.count;
      switch (stat._id) {
        case 'taken':
          taken = stat.count;
          break;
        case 'skipped':
          skipped = stat.count;
          break;
        case 'missed':
          missed = stat.count;
          break;
      }
    });

    const adherenceRate = totalScheduled > 0 ? (taken / totalScheduled) * 100 : 0;

    // Get weekly statistics
    const weeklyStats = await MedicineLog.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            week: '$_id.week'
          },
          stats: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          totalScheduled: { $sum: '$count' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 }
      }
    ]);

    // Format weekly stats
    const formattedWeeklyStats = weeklyStats.map(week => {
      const weekTaken = week.stats.find(s => s.status === 'taken')?.count || 0;
      const adherenceRate = week.totalScheduled > 0 ? (weekTaken / week.totalScheduled) * 100 : 0;
      
      return {
        week: `${week._id.year}-W${week._id.week.toString().padStart(2, '0')}`,
        scheduled: week.totalScheduled,
        taken: weekTaken,
        adherenceRate: Math.round(adherenceRate * 10) / 10
      };
    });

    res.json({
      success: true,
      data: {
        totalScheduled,
        taken,
        skipped,
        missed,
        adherenceRate: Math.round(adherenceRate * 10) / 10,
        weeklyStats: formattedWeeklyStats
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update medicine log
const updateMedicineLog = async (req, res) => {
  try {
    let medicineLog = await MedicineLog.findById(req.params.id);

    if (!medicineLog) {
      return res.status(404).json({ success: false, error: 'Medicine log not found' });
    }

    // Make sure user owns the log
    if (medicineLog.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Update allowed fields
    const updateFields = {};
    const allowedFields = ['actualTime', 'status', 'notes'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'actualTime') {
          updateFields[field] = new Date(req.body[field]);
        } else {
          updateFields[field] = req.body[field];
        }
      }
    });

    medicineLog = await MedicineLog.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('medicineId', 'name dosage');

    res.json({
      success: true,
      data: medicineLog
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  createMedicineLog,
  getMedicineLogs,
  getMedicineStats,
  updateMedicineLog
};