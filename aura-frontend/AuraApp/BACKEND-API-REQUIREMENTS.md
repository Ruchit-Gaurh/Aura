# 🔧 Backend API Requirements for Medicine Reminders & AI Integration

## 📋 **New API Endpoints Needed**

### **1. Medicine Management APIs**

#### **POST /api/medicines**
Create a new medicine reminder
```json
{
  "name": "Aspirin",
  "dosage": "100mg",
  "frequency": "daily",
  "times": ["08:00", "20:00"],
  "startDate": "2024-10-31",
  "endDate": "2024-12-31",
  "instructions": "Take with food",
  "withFood": true,
  "isActive": true
}
```

#### **GET /api/medicines**
Get all medicines for the authenticated user
```json
{
  "success": true,
  "data": [
    {
      "_id": "medicine_id",
      "userId": "user_id",
      "name": "Aspirin",
      "dosage": "100mg",
      "frequency": "daily",
      "times": ["08:00", "20:00"],
      "startDate": "2024-10-31",
      "endDate": "2024-12-31",
      "instructions": "Take with food",
      "withFood": true,
      "isActive": true,
      "createdAt": "2024-10-31T10:00:00Z",
      "updatedAt": "2024-10-31T10:00:00Z"
    }
  ]
}
```

#### **PUT /api/medicines/:id**
Update a medicine reminder
```json
{
  "name": "Aspirin",
  "dosage": "200mg",
  "isActive": false
}
```

#### **DELETE /api/medicines/:id**
Delete a medicine reminder

### **2. Medicine Log APIs**

#### **POST /api/medicine-logs**
Log medicine taken/skipped
```json
{
  "medicineId": "medicine_id",
  "scheduledTime": "08:00",
  "actualTime": "2024-10-31T08:05:00Z",
  "status": "taken",
  "notes": "Taken with breakfast"
}
```

#### **GET /api/medicine-logs**
Get medicine logs with optional date filtering
```
GET /api/medicine-logs?date=2024-10-31
GET /api/medicine-logs?startDate=2024-10-01&endDate=2024-10-31
```

#### **GET /api/medicine-logs/stats**
Get medicine adherence statistics
```json
{
  "success": true,
  "data": {
    "totalScheduled": 30,
    "taken": 25,
    "skipped": 3,
    "missed": 2,
    "adherenceRate": 83.3,
    "weeklyStats": [
      {
        "week": "2024-W44",
        "scheduled": 7,
        "taken": 6,
        "adherenceRate": 85.7
      }
    ]
  }
}
```

### **3. Health Check APIs**

#### **POST /api/health-checks**
Record daily health check
```json
{
  "date": "2024-10-31",
  "mood": "good",
  "energyLevel": 8,
  "symptoms": ["headache"],
  "notes": "Feeling better today"
}
```

#### **GET /api/health-checks**
Get health check history

### **4. Emergency Contact APIs**

#### **POST /api/emergency-contacts**
Add emergency contact
```json
{
  "name": "Dr. Smith",
  "relationship": "doctor",
  "phone": "+1234567890",
  "email": "dr.smith@hospital.com",
  "isPrimary": true
}
```

#### **GET /api/emergency-contacts**
Get all emergency contacts

#### **POST /api/emergency/trigger**
Trigger emergency alert
```json
{
  "type": "medical",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "message": "User requested emergency assistance"
}
```

### **5. AI Integration APIs**

#### **POST /api/ai/chat**
Send message to AI assistant (proxy to Futurix AI)
```json
{
  "message": "I have a headache, what should I do?",
  "includeNavigation": true,
  "conversationId": "optional_conversation_id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "response": "For a headache, you can try resting in a quiet, dark room...",
    "intent": {
      "action": "navigate",
      "screen": "MedicineReminders",
      "confidence": 0.8
    },
    "suggestions": [
      "Set up medicine reminders",
      "When should I see a doctor?",
      "Tell me about preventive care"
    ],
    "conversationId": "conv_12345"
  }
}
```

#### **POST /api/ai/voice-command**
Analyze voice command for navigation intent
```json
{
  "command": "book an appointment with doctor",
  "userId": "user_id"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "intent": {
      "action": "navigate",
      "screen": "CreateAppointment",
      "confidence": 0.9,
      "parameters": {
        "type": "appointment"
      }
    },
    "response": "I'll help you book an appointment"
  }
}
```

#### **GET /api/ai/conversation/:conversationId**
Get conversation history
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_12345",
    "messages": [
      {
        "role": "user",
        "content": "I have a headache",
        "timestamp": "2024-10-31T10:00:00Z"
      },
      {
        "role": "assistant",
        "content": "For a headache, you can try...",
        "timestamp": "2024-10-31T10:00:05Z"
      }
    ],
    "summary": "User discussed headache symptoms and treatment options"
  }
}
```

#### **DELETE /api/ai/conversation/:conversationId**
Clear conversation history

### **6. Smart Health Insights APIs**

#### **GET /api/insights/health-summary**
Get AI-generated health insights based on user data
```json
{
  "success": true,
  "data": {
    "summary": "Based on your recent medicine adherence and health checks...",
    "recommendations": [
      "Consider setting more frequent reminders",
      "Schedule a check-up with your doctor"
    ],
    "adherenceScore": 85,
    "trends": {
      "medicineAdherence": "improving",
      "moodTrend": "stable",
      "energyLevel": "increasing"
    }
  }
}
```

#### **POST /api/insights/analyze-symptoms**
Analyze symptoms using AI
```json
{
  "symptoms": ["headache", "fatigue", "nausea"],
  "duration": "2 days",
  "severity": "moderate"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "analysis": "Based on the symptoms you've described...",
    "recommendations": [
      "Rest and stay hydrated",
      "Monitor symptoms for 24 hours",
      "Consult a doctor if symptoms worsen"
    ],
    "urgencyLevel": "low",
    "shouldSeeDoctor": false,
    "emergencyWarning": false
  }
}
```

## 🗄️ **Database Schema Changes**

### **Medicine Schema**
```javascript
const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['daily', 'twice_daily', 'three_times_daily', 'weekly', 'as_needed'],
    required: true
  },
  times: [{
    type: String, // HH:MM format
    required: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  instructions: {
    type: String
  },
  withFood: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### **Medicine Log Schema**
```javascript
const medicineLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  scheduledTime: {
    type: String, // HH:MM format
    required: true
  },
  actualTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['taken', 'skipped', 'missed'],
    required: true
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
```

### **Health Check Schema**
```javascript
const healthCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  mood: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'very_poor']
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  symptoms: [{
    type: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});
```

### **Emergency Contact Schema**
```javascript
const emergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  relationship: {
    type: String,
    enum: ['doctor', 'family', 'friend', 'caregiver', 'emergency_service'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### **AI Conversation Schema**
```javascript
const aiConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  conversationId: {
    type: String,
    required: true,
    unique: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    intent: {
      action: String,
      screen: String,
      confidence: Number,
      parameters: mongoose.Schema.Types.Mixed
    }
  }],
  summary: {
    type: String
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

### **Health Insight Schema**
```javascript
const healthInsightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['daily_summary', 'weekly_report', 'symptom_analysis', 'adherence_insight'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  recommendations: [{
    type: String
  }],
  dataPoints: {
    medicineAdherence: Number,
    moodScore: Number,
    energyLevel: Number,
    symptomsCount: Number
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
```

## 🔐 **Authentication & Authorization**

All new endpoints should:
- Require JWT authentication
- Include user ID from token in queries
- Validate user ownership of resources
- Include proper error handling

## 📱 **Push Notifications (Optional)**

### **Medicine Reminder Notifications**
```javascript
// Send push notification for medicine reminder
const sendMedicineReminder = async (userId, medicine, scheduledTime) => {
  const notification = {
    title: '💊 Medicine Reminder',
    body: `Time to take ${medicine.name} (${medicine.dosage})`,
    data: {
      type: 'medicine_reminder',
      medicineId: medicine._id,
      scheduledTime: scheduledTime
    }
  };
  
  // Send to user's devices
  await pushNotificationService.sendToUser(userId, notification);
};
```

## 🔄 **Background Jobs**

### **Medicine Reminder Scheduler**
```javascript
// Cron job to check and send medicine reminders
const checkMedicineReminders = async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
  // Find all medicines that should be taken now
  const medicines = await Medicine.find({
    isActive: true,
    times: currentTime,
    startDate: { $lte: now },
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } }
    ]
  }).populate('userId');
  
  for (const medicine of medicines) {
    // Check if already taken today
    const today = now.toISOString().split('T')[0];
    const existingLog = await MedicineLog.findOne({
      medicineId: medicine._id,
      scheduledTime: currentTime,
      date: today
    });
    
    if (!existingLog) {
      // Send reminder
      await sendMedicineReminder(medicine.userId._id, medicine, currentTime);
    }
  }
};

// Run every minute
cron.schedule('* * * * *', checkMedicineReminders);
```

## 📊 **Analytics & Reporting**

### **Medicine Adherence Report**
```javascript
const getMedicineAdherenceReport = async (userId, startDate, endDate) => {
  const pipeline = [
    {
      $match: {
        userId: new ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ];
  
  const results = await MedicineLog.aggregate(pipeline);
  
  // Calculate adherence rate
  const taken = results.find(r => r._id === 'taken')?.count || 0;
  const total = results.reduce((sum, r) => sum + r.count, 0);
  const adherenceRate = total > 0 ? (taken / total) * 100 : 0;
  
  return {
    taken,
    total,
    adherenceRate,
    breakdown: results
  };
};
```

## 🤖 **AI Service Integration**

### **Futurix AI Configuration**
```javascript
// Backend environment variables
const AI_CONFIG = {
  API_URL: 'https://api.futurixai.com/api/lara/v1/chat/completions',
  API_KEY: '6903de523bb9326d46566618',
  MODEL: 'shivaay',
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: 512
};

// AI Service Implementation
class AIService {
  async sendMessage(messages, includeNavigation = false) {
    const systemPrompt = this.buildHealthcareSystemPrompt(includeNavigation);
    
    const requestBody = {
      model: AI_CONFIG.MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: AI_CONFIG.DEFAULT_TEMPERATURE,
      top_p: 0.8,
      repetition_penalty: 1.05,
      max_tokens: AI_CONFIG.MAX_TOKENS,
      stream: false
    };

    const response = await fetch(AI_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    return await response.json();
  }

  buildHealthcareSystemPrompt(includeNavigation) {
    let prompt = `You are Shivaay, an intelligent AI assistant for a healthcare mobile app called Aura. 
    You help elderly users with:
    1. Health-related questions and advice
    2. Medicine reminders and scheduling
    3. Appointment booking and management
    4. General wellness guidance
    5. App navigation and features

    Guidelines:
    - Provide helpful, accurate health information
    - Always recommend consulting healthcare professionals for serious concerns
    - Be empathetic and supportive
    - Keep responses concise but informative
    - Use simple, clear language suitable for elderly users`;

    if (includeNavigation) {
      prompt += `
      
      NAVIGATION CAPABILITIES:
      Available screens: Home, Appointments, CreateAppointment, MedicineReminders, Profile, AI
      
      When users want to navigate, include intent in format:
      [INTENT:{"action":"navigate","screen":"ScreenName","confidence":0.9}]`;
    }

    return prompt;
  }
}
```

### **Backend API Routes**
```javascript
// routes/ai.js
const express = require('express');
const router = express.Router();
const AIService = require('../services/aiService');
const auth = require('../middleware/auth');

// Chat with AI
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, includeNavigation, conversationId } = req.body;
    const userId = req.user.id;

    // Get or create conversation
    let conversation = await AIConversation.findOne({ 
      conversationId: conversationId || `conv_${userId}_${Date.now()}`,
      userId 
    });

    if (!conversation) {
      conversation = new AIConversation({
        userId,
        conversationId: conversationId || `conv_${userId}_${Date.now()}`,
        messages: []
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response
    const aiService = new AIService();
    const response = await aiService.sendMessage(
      conversation.messages.slice(-10), // Last 10 messages for context
      includeNavigation
    );

    const aiResponse = response.choices[0].message.content;
    
    // Parse navigation intent
    let intent = null;
    let cleanResponse = aiResponse;
    const intentMatch = aiResponse.match(/\[INTENT:(.*?)\]/);
    if (intentMatch) {
      try {
        intent = JSON.parse(intentMatch[1]);
        cleanResponse = aiResponse.replace(/\[INTENT:.*?\]/, '').trim();
      } catch (e) {
        console.warn('Failed to parse intent:', e);
      }
    }

    // Add AI message
    conversation.messages.push({
      role: 'assistant',
      content: cleanResponse,
      timestamp: new Date(),
      intent
    });

    conversation.lastActivity = new Date();
    await conversation.save();

    // Generate suggestions
    const suggestions = generateSuggestions(message, cleanResponse);

    res.json({
      success: true,
      data: {
        response: cleanResponse,
        intent,
        suggestions,
        conversationId: conversation.conversationId
      }
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response'
    });
  }
});

// Analyze voice command
router.post('/voice-command', auth, async (req, res) => {
  try {
    const { command } = req.body;
    
    const aiService = new AIService();
    const response = await aiService.sendMessage([
      {
        role: 'user',
        content: `Analyze this voice command for navigation intent: "${command}". Only respond with navigation if the user clearly wants to go somewhere.`
      }
    ], true);

    const aiResponse = response.choices[0].message.content;
    
    // Parse intent
    let intent = null;
    const intentMatch = aiResponse.match(/\[INTENT:(.*?)\]/);
    if (intentMatch) {
      try {
        intent = JSON.parse(intentMatch[1]);
      } catch (e) {
        console.warn('Failed to parse voice intent:', e);
      }
    }

    res.json({
      success: true,
      data: {
        intent,
        response: aiResponse.replace(/\[INTENT:.*?\]/, '').trim()
      }
    });

  } catch (error) {
    console.error('Voice command analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze voice command'
    });
  }
});

module.exports = router;
```

## 🚀 **Implementation Priority**

### **Phase 1 (Essential)**
1. Medicine CRUD APIs
2. Medicine Log APIs
3. Basic authentication & authorization
4. **AI Chat Integration** (Futurix AI proxy)
5. **Voice Command Analysis**

### **Phase 2 (Enhanced)**
1. Health Check APIs
2. Emergency Contact APIs
3. Medicine adherence statistics
4. **AI Conversation History**
5. **Smart Health Insights**

### **Phase 3 (Advanced)**
1. Push notifications
2. Background reminder jobs
3. Analytics & reporting
4. Family/caregiver sharing
5. **Advanced AI Features** (symptom analysis, personalized recommendations)

## 🧪 **Testing Requirements**

### **Unit Tests**
- Medicine CRUD operations
- Medicine log creation and retrieval
- Adherence calculation logic
- Authentication middleware

### **Integration Tests**
- Complete medicine reminder workflow
- Emergency contact functionality
- Health check recording

### **API Documentation**
- Swagger/OpenAPI documentation
- Postman collection
- Example requests/responses

This comprehensive backend implementation will support all the medicine reminder features in the mobile app and provide a solid foundation for elderly healthcare management.