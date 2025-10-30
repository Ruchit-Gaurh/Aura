const HealthInsight = require('../models/HealthInsight.model');
const Medicine = require('../models/Medicine.model');
const MedicineLog = require('../models/MedicineLog.model');
const HealthCheck = require('../models/HealthCheck.model');
const AIService = require('../services/aiService');

// @desc    Get AI-generated health insights based on user data
const getHealthSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 7 } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - parseInt(days) * 24 * 60 * 60 * 1000);

    // Get medicine adherence data
    const medicineStats = await MedicineLog.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    let totalScheduled = 0;
    let taken = 0;
    medicineStats.forEach(stat => {
      totalScheduled += stat.count;
      if (stat._id === 'taken') {
        taken = stat.count;
      }
    });

    const medicineAdherence = totalScheduled > 0 ? (taken / totalScheduled) * 100 : 0;

    // Get recent health checks
    const recentHealthCheck = await HealthCheck.findOne({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    // Get recent symptoms
    const recentSymptoms = await HealthCheck.aggregate([
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
        $limit: 5
      }
    ]);

    // Prepare data for AI analysis
    const userData = {
      medicineAdherence: Math.round(medicineAdherence * 10) / 10,
      recentHealthChecks: recentHealthCheck ? {
        mood: recentHealthCheck.mood,
        energyLevel: recentHealthCheck.energyLevel
      } : null,
      recentSymptoms: recentSymptoms.map(s => s._id)
    };

    // Generate AI summary
    const aiService = new AIService();
    const aiSummary = await aiService.generateHealthSummary(userData);

    // Parse AI response for structured data
    const lines = aiSummary.split('\n').filter(line => line.trim());
    let summary = '';
    let recommendations = [];
    let trends = {};

    // Simple parsing - in production, you might want more sophisticated parsing
    let currentSection = '';
    lines.forEach(line => {
      if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('overall')) {
        currentSection = 'summary';
      } else if (line.toLowerCase().includes('recommendation')) {
        currentSection = 'recommendations';
      } else if (line.toLowerCase().includes('trend')) {
        currentSection = 'trends';
      } else if (currentSection === 'summary' && !summary) {
        summary = line.trim();
      } else if (currentSection === 'recommendations' && line.includes('-')) {
        recommendations.push(line.replace(/^-\s*/, '').trim());
      }
    });

    // Fallback if parsing fails
    if (!summary) {
      summary = aiSummary.split('\n')[0] || 'Your health data shows positive trends.';
    }
    if (recommendations.length === 0) {
      recommendations = [
        'Continue taking medicines as prescribed',
        'Maintain regular health check-ins',
        'Stay active and eat well'
      ];
    }

    // Determine trends
    trends = {
      medicineAdherence: medicineAdherence >= 80 ? 'good' : medicineAdherence >= 60 ? 'fair' : 'needs_improvement',
      moodTrend: recentHealthCheck?.mood === 'excellent' || recentHealthCheck?.mood === 'good' ? 'positive' : 'stable',
      energyLevel: recentHealthCheck?.energyLevel >= 7 ? 'high' : recentHealthCheck?.energyLevel >= 4 ? 'moderate' : 'low'
    };

    res.json({
      success: true,
      data: {
        summary,
        recommendations,
        adherenceScore: Math.round(medicineAdherence),
        trends,
        dataPoints: {
          medicineAdherence: Math.round(medicineAdherence),
          totalMedicinesScheduled: totalScheduled,
          medicinesTaken: taken,
          recentMood: recentHealthCheck?.mood || null,
          recentEnergyLevel: recentHealthCheck?.energyLevel || null,
          commonSymptoms: recentSymptoms.slice(0, 3).map(s => s._id)
        },
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Health summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate health summary'
    });
  }
};

// @desc    Analyze symptoms using AI
const analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms, duration, severity } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Symptoms array is required'
      });
    }

    const aiService = new AIService();
    const analysis = await aiService.analyzeSymptoms(
      symptoms,
      duration || 'not specified',
      severity || 'moderate'
    );

    // Parse AI response for structured data
    const lines = analysis.split('\n').filter(line => line.trim());
    let analysisText = '';
    let recommendations = [];
    let urgencyLevel = 'low';
    let shouldSeeDoctor = false;
    let emergencyWarning = false;

    // Simple parsing
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('urgent') || lowerLine.includes('emergency') || lowerLine.includes('immediately')) {
        urgencyLevel = 'high';
        emergencyWarning = true;
      } else if (lowerLine.includes('doctor') || lowerLine.includes('medical attention')) {
        shouldSeeDoctor = true;
        if (urgencyLevel === 'low') urgencyLevel = 'medium';
      }
      
      if (line.includes('-') && (lowerLine.includes('recommend') || lowerLine.includes('should'))) {
        recommendations.push(line.replace(/^-\s*/, '').trim());
      }
    });

    // Fallback analysis
    if (!analysisText) {
      analysisText = analysis.split('\n').slice(0, 3).join(' ').trim();
    }

    // Default recommendations if none found
    if (recommendations.length === 0) {
      recommendations = [
        'Monitor your symptoms closely',
        'Rest and stay hydrated',
        'Contact your healthcare provider if symptoms worsen'
      ];
    }

    // Determine urgency based on symptoms
    const seriousSymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'confusion', 'high fever'];
    const hasSeriousSymptoms = symptoms.some(symptom => 
      seriousSymptoms.some(serious => symptom.toLowerCase().includes(serious))
    );

    if (hasSeriousSymptoms) {
      urgencyLevel = 'high';
      shouldSeeDoctor = true;
      emergencyWarning = true;
    }

    res.json({
      success: true,
      data: {
        analysis: analysisText || analysis,
        recommendations: recommendations.slice(0, 5), // Limit to 5 recommendations
        urgencyLevel,
        shouldSeeDoctor,
        emergencyWarning,
        symptoms: symptoms,
        duration: duration || 'not specified',
        severity: severity || 'moderate',
        analyzedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze symptoms'
    });
  }
};

// @desc    Get health insights history
const getHealthInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, limit = 10, unreadOnly = false } = req.query;

    const query = { userId };
    if (type) query.type = type;
    if (unreadOnly === 'true') query.isRead = false;

    const insights = await HealthInsight.find(query)
      .sort({ generatedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('Get health insights error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get health insights'
    });
  }
};

// @desc    Mark health insight as read
const markInsightAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const insight = await HealthInsight.findOne({ _id: id, userId });

    if (!insight) {
      return res.status(404).json({
        success: false,
        error: 'Health insight not found'
      });
    }

    insight.isRead = true;
    await insight.save();

    res.json({
      success: true,
      message: 'Insight marked as read'
    });

  } catch (error) {
    console.error('Mark insight as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark insight as read'
    });
  }
};

module.exports = {
  getHealthSummary,
  analyzeSymptoms,
  getHealthInsights,
  markInsightAsRead
};