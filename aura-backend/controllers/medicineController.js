const Medicine = require('../models/Medicine.model');
const MedicineLog = require('../models/MedicineLog.model');

// @desc    Get all medicines for authenticated user
const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: medicines
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new medicine
const createMedicine = async (req, res) => {
  const { name, dosage, frequency, times, startDate, endDate, instructions, withFood } = req.body;

  try {
    // Validate required fields
    if (!name || !dosage || !frequency || !times || !startDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, dosage, frequency, times, startDate'
      });
    }

    // Validate times format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (const time of times) {
      if (!timeRegex.test(time)) {
        return res.status(400).json({
          success: false,
          error: `Invalid time format: ${time}. Use HH:MM format`
        });
      }
    }

    const medicine = new Medicine({
      userId: req.user.id,
      name,
      dosage,
      frequency,
      times,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      instructions,
      withFood: withFood || false,
      isActive: true
    });

    await medicine.save();

    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update a medicine
const updateMedicine = async (req, res) => {
  try {
    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    // Make sure user owns medicine
    if (medicine.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Validate times format if provided
    if (req.body.times) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      for (const time of req.body.times) {
        if (!timeRegex.test(time)) {
          return res.status(400).json({
            success: false,
            error: `Invalid time format: ${time}. Use HH:MM format`
          });
        }
      }
    }

    // Update fields
    const updateFields = {};
    const allowedFields = ['name', 'dosage', 'frequency', 'times', 'startDate', 'endDate', 'instructions', 'withFood', 'isActive'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'startDate' || field === 'endDate') {
          updateFields[field] = req.body[field] ? new Date(req.body[field]) : null;
        } else {
          updateFields[field] = req.body[field];
        }
      }
    });

    medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: medicine
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a medicine
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    // Make sure user owns medicine
    if (medicine.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Soft delete by setting isActive to false
    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get medicine by ID
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine || !medicine.isActive) {
      return res.status(404).json({ success: false, error: 'Medicine not found' });
    }

    // Make sure user owns medicine
    if (medicine.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.json({
      success: true,
      data: medicine
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicineById
};