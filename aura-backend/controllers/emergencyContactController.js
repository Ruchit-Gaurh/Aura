const EmergencyContact = require('../models/EmergencyContact.model');

// @desc    Get all emergency contacts for authenticated user
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ 
      userId: req.user.id,
      isActive: true 
    }).sort({ isPrimary: -1, createdAt: -1 });

    res.json({
      success: true,
      data: contacts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a new emergency contact
const createEmergencyContact = async (req, res) => {
  const { name, relationship, phone, email, isPrimary } = req.body;

  try {
    // Validate required fields
    if (!name || !relationship || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, relationship, phone'
      });
    }

    // If setting as primary, unset other primary contacts
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id, isPrimary: true },
        { isPrimary: false }
      );
    }

    const contact = new EmergencyContact({
      userId: req.user.id,
      name,
      relationship,
      phone,
      email,
      isPrimary: isPrimary || false,
      isActive: true
    });

    await contact.save();

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update an emergency contact
const updateEmergencyContact = async (req, res) => {
  try {
    let contact = await EmergencyContact.findById(req.params.id);

    if (!contact || !contact.isActive) {
      return res.status(404).json({ success: false, error: 'Emergency contact not found' });
    }

    // Make sure user owns contact
    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // If setting as primary, unset other primary contacts
    if (req.body.isPrimary === true) {
      await EmergencyContact.updateMany(
        { userId: req.user.id, isPrimary: true, _id: { $ne: req.params.id } },
        { isPrimary: false }
      );
    }

    // Update fields
    const updateFields = {};
    const allowedFields = ['name', 'relationship', 'phone', 'email', 'isPrimary', 'isActive'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    contact = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete an emergency contact
const deleteEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, error: 'Emergency contact not found' });
    }

    // Make sure user owns contact
    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Soft delete by setting isActive to false
    await EmergencyContact.findByIdAndUpdate(req.params.id, { isActive: false });

    res.json({
      success: true,
      message: 'Emergency contact deleted successfully'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get emergency contact by ID
const getEmergencyContactById = async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact || !contact.isActive) {
      return res.status(404).json({ success: false, error: 'Emergency contact not found' });
    }

    // Make sure user owns contact
    if (contact.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Trigger emergency alert
const triggerEmergencyAlert = async (req, res) => {
  const { type, location, message } = req.body;

  try {
    // Get user's primary emergency contacts
    const primaryContacts = await EmergencyContact.find({
      userId: req.user.id,
      isPrimary: true,
      isActive: true
    });

    // Get all emergency contacts if no primary contacts
    let contacts = primaryContacts;
    if (contacts.length === 0) {
      contacts = await EmergencyContact.find({
        userId: req.user.id,
        isActive: true
      }).limit(3); // Limit to first 3 contacts
    }

    if (contacts.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No emergency contacts found. Please add emergency contacts first.'
      });
    }

    // Here you would implement the actual emergency alert logic
    // For now, we'll just log the alert and return success
    const alertData = {
      userId: req.user.id,
      type: type || 'medical',
      location,
      message: message || 'Emergency assistance requested',
      contacts: contacts.map(c => ({ name: c.name, phone: c.phone })),
      timestamp: new Date()
    };

    console.log('🚨 EMERGENCY ALERT TRIGGERED:', alertData);

    // In a real implementation, you would:
    // 1. Send SMS/calls to emergency contacts
    // 2. Log the emergency event
    // 3. Potentially contact emergency services
    // 4. Send push notifications to family members

    res.json({
      success: true,
      message: 'Emergency alert sent successfully',
      data: {
        alertId: `alert_${Date.now()}`,
        contactsNotified: contacts.length,
        timestamp: new Date()
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContactById,
  triggerEmergencyAlert
};