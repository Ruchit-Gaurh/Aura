# 🧪 AI Backend Integration Test Guide

## 📋 **Backend Endpoints to Test**

### **1. Chat Endpoint**
```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "message": "I have a headache, what should I do?",
    "includeNavigation": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "response": "For a headache, try resting in a quiet, dark room...",
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

### **2. Voice Command Analysis**
```bash
curl -X POST http://localhost:8080/api/ai/voice-command \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "command": "book an appointment with doctor"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "intent": {
      "action": "navigate",
      "screen": "CreateAppointment",
      "confidence": 0.9
    },
    "response": "I'll help you book an appointment"
  }
}
```

### **3. Health Summary**
```bash
curl -X GET http://localhost:8080/api/insights/health-summary \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

**Expected Response:**
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

### **4. Symptom Analysis**
```bash
curl -X POST http://localhost:8080/api/insights/analyze-symptoms \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "symptoms": ["headache", "fatigue", "nausea"],
    "duration": "2 days",
    "severity": "moderate"
  }'
```

**Expected Response:**
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

## 🔧 **Frontend Integration Points**

### **AI Service Configuration**
The frontend `aiService.ts` is configured to call:
- `POST http://localhost:8080/api/ai/chat`
- `POST http://localhost:8080/api/ai/voice-command`
- `GET http://localhost:8080/api/insights/health-summary`
- `POST http://localhost:8080/api/insights/analyze-symptoms`

### **Authentication**
All requests include JWT token in `x-auth-token` header from:
- `localStorage.getItem('auth_token')`
- `sessionStorage.getItem('auth_token')`

### **Error Handling**
Frontend handles:
- 401 Unauthorized → "Authentication required. Please log in again."
- 500 Server Error → "Failed to get AI response. Please try again."
- Network errors → Generic error messages

## 🚀 **Testing Checklist**

### **Backend Setup**
- [ ] Futurix AI API key configured in environment variables
- [ ] All 4 endpoints implemented and responding
- [ ] JWT authentication middleware working
- [ ] CORS configured for frontend origin
- [ ] Database schemas created for conversations and insights

### **Frontend Testing**
- [ ] AI chat works and shows responses
- [ ] Navigation intents trigger navigation prompts
- [ ] Voice commands are analyzed by AI
- [ ] Health summary button works
- [ ] Symptom analysis feature works
- [ ] Conversation clearing works
- [ ] Error messages display properly

### **Integration Testing**
- [ ] Full conversation flow works
- [ ] Voice → AI analysis → navigation works
- [ ] Authentication errors handled gracefully
- [ ] Network errors handled gracefully
- [ ] Conversation persistence works across sessions

## 🐛 **Common Issues & Solutions**

### **CORS Errors**
```javascript
// Backend: Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

### **Authentication Errors**
```javascript
// Check JWT token is being sent
const token = localStorage.getItem('auth_token');
console.log('Auth token:', token);
```

### **API Key Issues**
```javascript
// Backend: Ensure environment variable is set
const AI_API_KEY = process.env.FUTURIX_AI_KEY || '6903de523bb9326d46566618';
```

### **Network Errors**
```javascript
// Frontend: Check API base URL
console.log('API Base URL:', API_CONFIG.BASE_URL);
```

## 📊 **Success Metrics**

When everything is working correctly:
- ✅ Users can chat with AI and get helpful responses
- ✅ AI detects navigation intents and offers to navigate
- ✅ Voice commands are understood even with natural language
- ✅ Health insights provide personalized recommendations
- ✅ Symptom analysis gives appropriate medical guidance
- ✅ All features work seamlessly with authentication

The AI integration transforms the app into an intelligent health companion!