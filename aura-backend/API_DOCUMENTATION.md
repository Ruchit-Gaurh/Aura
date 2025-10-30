# Aura Backend API Documentation

## Base URL
```
http://localhost:8080
```

## 📚 Table of Contents

### 🚀 Getting Started
- [Current Setup Status](#-current-setup-status)
- [Quick Reference](#quick-reference)
- [Authentication](#authentication)

### 🔐 Core APIs
- [Authentication Endpoints](#-authentication-endpoints)
- [User Management](#-user-endpoints)
- [Appointment Management](#-appointment-endpoints)

### 💊 Healthcare Features
- [Medicine Management](#-medicine-management-endpoints)
- [Medicine Logging](#-medicine-log-endpoints)
- [Health Check Recording](#-health-check-endpoints)
- [Emergency Contacts](#-emergency-contact-endpoints)
- [Emergency Alerts](#-emergency-alert-endpoint)

### 🤖 AI Integration
- [AI Chat & Voice Commands](#-ai-integration-endpoints)
- [Smart Health Insights](#-smart-health-insights-endpoints)
- [Dialogflow Integration](#-ai-service-endpoints)

### 🔧 Advanced Features
- [WebSocket Translation](#-websocket-real-time-translation)
- [Data Models](#-data-models)
- [Testing & Development](#-testing--development)

### 📖 Reference
- [Security & Privacy](#-security-notes)
- [Troubleshooting](#-troubleshooting)
- [Future Enhancements](#-future-enhancements)

## 🚨 Current Setup Status

**API Version**: 1.0.0  
**Last Updated**: October 31, 2024  
**Node.js Version**: 20.x+  
**Database**: MongoDB  

### ✅ **Fully Implemented Features**
- ✅ **Authentication & User Management**: JWT-based auth system
- ✅ **Appointment Management**: Complete CRUD operations  
- ✅ **Medicine Management**: Full reminder system with CRUD
- ✅ **Medicine Logging & Adherence**: Comprehensive tracking
- ✅ **Health Check Recording**: Daily health monitoring
- ✅ **Emergency Contact Management**: Complete contact system
- ✅ **AI Chat Integration**: Shivaay AI powered conversations
- ✅ **Voice Command Analysis**: Navigation intent detection
- ✅ **Smart Health Insights**: AI-powered health summaries
- ✅ **Symptom Analysis**: AI-driven symptom evaluation
- ✅ **Conversation Management**: Chat history and context
- ✅ **WebSocket Translation**: Real-time language translation

### 🔧 **Optional Integrations**
- 🟡 **Local LLM (Ollama)**: Ready (requires Ollama installation)
- 🟡 **Google Cloud AI Services**: Configured (requires setup)
- 🟡 **Dialogflow CX**: Available (requires agent creation)

## Quick Reference

### 🚀 **Getting Started**
1. Start server: `npm run dev`
2. Run tests: `npm run test:all`
3. Check AI connectivity: `npm run test:shivaay`

### 📋 **Core Endpoints**
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Medicines**: `/api/medicines` (CRUD)
- **Health**: `/api/health-checks`, `/api/insights/health-summary`
- **AI Chat**: `/api/ai/chat`, `/api/ai/voice-command`
- **Emergency**: `/api/emergency-contacts`, `/api/emergency/trigger`

### 🔧 **Key Features**
- JWT Authentication
- Medicine reminder system
- AI-powered health insights
- Voice command navigation
- Emergency alert system
- Real-time translation (WebSocket)

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the request header:
```
x-auth-token: YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferredLanguage": "en-US"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: User already exists
- `500`: Server error

---

### Login User
**POST** `/api/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Invalid credentials
- `500`: Server error

---

## 👤 User Endpoints

### Get User Profile
**GET** `/api/users/profile`

Get current user's profile information.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Doe",
  "email": "john@example.com",
  "preferredLanguage": "en-US",
  "__v": 0
}
```

---

### Update User Profile
**PUT** `/api/users/profile`

Update user profile information.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "John Smith",
  "preferredLanguage": "es-ES"
}
```

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Smith",
  "email": "john@example.com",
  "preferredLanguage": "es-ES",
  "__v": 0
}
```

---

## 📅 Appointment Endpoints

### Get All Appointments
**GET** `/api/appointments`

Get all appointments for the authenticated user.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "patient": "64f8a1b2c3d4e5f6a7b8c9d0",
    "doctorName": "Dr. Smith",
    "appointmentTime": "2024-01-15T10:00:00.000Z",
    "status": "Scheduled",
    "transcript": null,
    "__v": 0
  }
]
```

---

### Create Appointment
**POST** `/api/appointments`

Create a new appointment.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "doctorName": "Dr. Smith",
  "appointmentTime": "2024-01-15T10:00:00.000Z"
}
```

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "patient": "64f8a1b2c3d4e5f6a7b8c9d0",
  "doctorName": "Dr. Smith",
  "appointmentTime": "2024-01-15T10:00:00.000Z",
  "status": "Scheduled",
  "__v": 0
}
```

---

### Update Appointment
**PUT** `/api/appointments/:id`

Update appointment status or add transcript.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "status": "Completed",
  "transcript": "Patient reported feeling better after medication..."
}
```

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
  "patient": "64f8a1b2c3d4e5f6a7b8c9d0",
  "doctorName": "Dr. Smith",
  "appointmentTime": "2024-01-15T10:00:00.000Z",
  "status": "Completed",
  "transcript": "Patient reported feeling better after medication...",
  "__v": 0
}
```

**Error Responses:**
- `404`: Appointment not found
- `401`: Not authorized (not your appointment)

---

## 🤖 AI Service Endpoints

### Dialogflow Intent Detection
**POST** `/api/ai/dialogflow/detect-intent`

Detect user intent using Dialogflow CX.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "text": "I want to schedule an appointment",
  "sessionId": "user-session-123",
  "projectId": "your-project-id",
  "location": "us-central1",
  "agentId": "your-agent-id"
}
```

**Response (200):**
```json
{
  "responseText": "I can help you schedule an appointment. What type of appointment would you like?",
  "intent": "schedule.appointment",
  "confidence": 0.95
}
```

---

### Summarize Transcript
**POST** `/api/ai/summarize`

Summarize medical consultation transcript using local LLM.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "transcript": "Doctor: How are you feeling today? Patient: I've been having headaches for the past week. Doctor: Any other symptoms? Patient: Some nausea and sensitivity to light..."
}
```

**Response (200):**
```json
{
  "summary": "Patient presents with week-long headaches accompanied by nausea and photophobia. Recommend neurological evaluation and symptom monitoring.",
  "originalLength": 156,
  "summaryLength": 98
}
```

---

### Generate AI Response
**POST** `/api/ai/generate`

Generate AI response using local LLM.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "prompt": "Explain the importance of regular checkups",
  "model": "llama3.2"
}
```

**Response (200):**
```json
{
  "response": "Regular checkups are essential for maintaining good health because they allow for early detection of potential health issues...",
  "model": "llama3.2"
}
```

---

## 🔄 WebSocket Real-Time Translation

### Connection
Connect to WebSocket server:
```javascript
const ws = new WebSocket('ws://localhost:8080');
```

### Message Types

#### Join Translation Room
```json
{
  "type": "join_room",
  "roomId": "appointment_123",
  "userId": "user_456",
  "targetLanguage": "es"
}
```

**Response:**
```json
{
  "type": "joined_room",
  "roomId": "appointment_123",
  "userId": "user_456",
  "participantCount": 2
}
```

#### Send Text Message
```json
{
  "type": "text_message",
  "roomId": "appointment_123",
  "userId": "user_456",
  "text": "Hello, how are you feeling today?",
  "targetLanguage": "es"
}
```

#### Send Audio Chunk
```json
{
  "type": "audio_chunk",
  "roomId": "appointment_123",
  "userId": "user_456",
  "audioData": "base64_encoded_audio_data",
  "targetLanguage": "es"
}
```

#### Receive Translated Message
```json
{
  "type": "translated_message",
  "senderId": "user_789",
  "originalText": "Hello, how are you feeling today?",
  "translatedText": "Hola, ¿cómo te sientes hoy?",
  "targetLanguage": "es"
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## 🔧 Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "error": "Error message description"
}
```

Or for authentication errors:
```json
{
  "msg": "Error message description"
}
```

---

## 📝 Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String (required, hashed)",
  "preferredLanguage": "String (default: 'en-US')"
}
```

### Appointment Model
```json
{
  "_id": "ObjectId",
  "patient": "ObjectId (ref: User)",
  "doctorName": "String (required)",
  "appointmentTime": "Date (required)",
  "status": "String (enum: ['Scheduled', 'Completed', 'Cancelled'])",
  "transcript": "String (optional)"
}
```

---

## 🚀 Quick Start Examples

### JavaScript/Frontend Integration

```javascript
// Register user
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:8080/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Get appointments with auth
const getAppointments = async (token) => {
  const response = await fetch('http://localhost:8080/api/appointments', {
    headers: { 'x-auth-token': token }
  });
  return response.json();
};

// WebSocket connection
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'join_room',
    roomId: 'appointment_123',
    userId: 'user_456',
    targetLanguage: 'es'
  }));
};
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Get appointments
curl -X GET http://localhost:8080/api/appointments \
  -H "x-auth-token: YOUR_JWT_TOKEN"

# Create appointment
curl -X POST http://localhost:8080/api/appointments \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{"doctorName":"Dr. Smith","appointmentTime":"2024-01-15T10:00:00.000Z"}'
```

---

## 🔒 Security Notes

1. **JWT Tokens**: Tokens expire in 100 hours (360000 seconds)
2. **Password Security**: Passwords are hashed using bcrypt with salt rounds of 10
3. **CORS**: Enabled for all origins (configure for production)
4. **Environment Variables**: Store sensitive data in `.env` file
5. **Google Cloud**: Service account credentials required for AI features

---

## 🐛 Troubleshooting

### Common Issues

1. **"No token, authorization denied"**
   - Include `x-auth-token` header in protected routes

2. **"Token is not valid"**
   - Token may be expired or malformed
   - Re-authenticate to get a new token

3. **"User already exists"**
   - Email is already registered
   - Use login endpoint instead

4. **WebSocket connection fails**
   - Ensure server is running
   - Check WebSocket URL format

5. **AI services not working**
   - Verify Google Cloud credentials
   - Check Ollama is running for LLM features

---

---

## 💊 Medicine Management Endpoints

### Get All Medicines
**GET** `/api/medicines`

Get all medicines for the authenticated user.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
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
      "startDate": "2024-10-31T00:00:00.000Z",
      "endDate": "2024-12-31T00:00:00.000Z",
      "instructions": "Take with food",
      "withFood": true,
      "isActive": true,
      "createdAt": "2024-10-31T10:00:00.000Z",
      "updatedAt": "2024-10-31T10:00:00.000Z"
    }
  ]
}
```

---

### Create Medicine
**POST** `/api/medicines`

Create a new medicine reminder.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "Aspirin",
  "dosage": "100mg",
  "frequency": "daily",
  "times": ["08:00", "20:00"],
  "startDate": "2024-10-31",
  "endDate": "2024-12-31",
  "instructions": "Take with food",
  "withFood": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "medicine_id",
    "userId": "user_id",
    "name": "Aspirin",
    "dosage": "100mg",
    "frequency": "daily",
    "times": ["08:00", "20:00"],
    "startDate": "2024-10-31T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z",
    "instructions": "Take with food",
    "withFood": true,
    "isActive": true
  }
}
```

---

### Update Medicine
**PUT** `/api/medicines/:id`

Update a medicine reminder.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "Aspirin",
  "dosage": "200mg",
  "isActive": false
}
```

---

### Delete Medicine
**DELETE** `/api/medicines/:id`

Delete a medicine reminder (soft delete).

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

---

## 📝 Medicine Log Endpoints

### Create Medicine Log
**POST** `/api/medicine-logs`

Log medicine taken/skipped.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "medicineId": "medicine_id",
  "scheduledTime": "08:00",
  "actualTime": "2024-10-31T08:05:00Z",
  "status": "taken",
  "notes": "Taken with breakfast"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "log_id",
    "userId": "user_id",
    "medicineId": {
      "_id": "medicine_id",
      "name": "Aspirin",
      "dosage": "100mg"
    },
    "scheduledTime": "08:00",
    "actualTime": "2024-10-31T08:05:00.000Z",
    "status": "taken",
    "notes": "Taken with breakfast",
    "date": "2024-10-31T00:00:00.000Z"
  }
}
```

---

### Get Medicine Logs
**GET** `/api/medicine-logs`

Get medicine logs with optional date filtering.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `date` - Specific date (YYYY-MM-DD)
- `startDate` & `endDate` - Date range
- `medicineId` - Filter by specific medicine

**Examples:**
```
GET /api/medicine-logs?date=2024-10-31
GET /api/medicine-logs?startDate=2024-10-01&endDate=2024-10-31
GET /api/medicine-logs?medicineId=medicine_id
```

---

### Get Medicine Statistics
**GET** `/api/medicine-logs/stats`

Get medicine adherence statistics.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `startDate` - Start date for statistics
- `endDate` - End date for statistics

**Response (200):**
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

---

## 🏥 Health Check Endpoints

### Create Health Check
**POST** `/api/health-checks`

Record daily health check.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "date": "2024-10-31",
  "mood": "good",
  "energyLevel": 8,
  "symptoms": ["headache"],
  "notes": "Feeling better today"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "health_check_id",
    "userId": "user_id",
    "date": "2024-10-31T00:00:00.000Z",
    "mood": "good",
    "energyLevel": 8,
    "symptoms": ["headache"],
    "notes": "Feeling better today"
  }
}
```

---

### Get Health Checks
**GET** `/api/health-checks`

Get health check history.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `startDate` & `endDate` - Date range
- `limit` - Number of records (default: 30)

---

### Get Health Check by Date
**GET** `/api/health-checks/:date`

Get health check for specific date (YYYY-MM-DD format).

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

---

### Get Health Trends
**GET** `/api/health-checks/trends`

Get health trends and analytics.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `days` - Number of days for analysis (default: 30)

---

## 🚨 Emergency Contact Endpoints

### Get Emergency Contacts
**GET** `/api/emergency-contacts`

Get all emergency contacts for authenticated user.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "contact_id",
      "userId": "user_id",
      "name": "Dr. Smith",
      "relationship": "doctor",
      "phone": "+1234567890",
      "email": "dr.smith@hospital.com",
      "isPrimary": true,
      "isActive": true
    }
  ]
}
```

---

### Create Emergency Contact
**POST** `/api/emergency-contacts`

Add emergency contact.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "name": "Dr. Smith",
  "relationship": "doctor",
  "phone": "+1234567890",
  "email": "dr.smith@hospital.com",
  "isPrimary": true
}
```

---

### Update Emergency Contact
**PUT** `/api/emergency-contacts/:id`

Update an emergency contact.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

---

### Delete Emergency Contact
**DELETE** `/api/emergency-contacts/:id`

Delete an emergency contact (soft delete).

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

---

## 🚨 Emergency Alert Endpoint

### Trigger Emergency Alert
**POST** `/api/emergency/trigger`

Trigger emergency alert to contacts.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
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

**Response (200):**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "data": {
    "alertId": "alert_1698765432000",
    "contactsNotified": 2,
    "timestamp": "2024-10-31T12:00:00.000Z"
  }
}
```

---

## 📊 Data Models Reference

### Medicine Model
```javascript
{
  userId: ObjectId,           // Reference to User
  name: String,              // Medicine name
  dosage: String,            // e.g., "100mg"
  frequency: String,         // daily, twice_daily, three_times_daily, weekly, as_needed
  times: [String],           // Array of times in HH:MM format
  startDate: Date,           // When to start taking
  endDate: Date,             // When to stop (optional)
  instructions: String,      // Special instructions
  withFood: Boolean,         // Take with food
  isActive: Boolean          // Active status
}
```

### Medicine Log Model
```javascript
{
  userId: ObjectId,          // Reference to User
  medicineId: ObjectId,      // Reference to Medicine
  scheduledTime: String,     // HH:MM format
  actualTime: Date,          // When actually taken
  status: String,            // taken, skipped, missed
  notes: String,             // Optional notes
  date: Date                 // Date of the log
}
```

### Health Check Model
```javascript
{
  userId: ObjectId,          // Reference to User
  date: Date,                // Date of health check
  mood: String,              // excellent, good, fair, poor, very_poor
  energyLevel: Number,       // 1-10 scale
  symptoms: [String],        // Array of symptoms
  notes: String              // Additional notes
}
```

### Emergency Contact Model
```javascript
{
  userId: ObjectId,          // Reference to User
  name: String,              // Contact name
  relationship: String,      // doctor, family, friend, caregiver, emergency_service
  phone: String,             // Phone number
  email: String,             // Email (optional)
  isPrimary: Boolean,        // Primary contact
  isActive: Boolean          // Active status
}
```

---

## 🧪 Testing

### Run Medicine API Tests
```bash
npm run test:medicine
```

### Run All Tests
```bash
npm run test:all
```

### Manual Testing Examples

#### Create a Medicine
```bash
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "name": "Vitamin D",
    "dosage": "1000 IU",
    "frequency": "daily",
    "times": ["09:00"],
    "startDate": "2024-10-31",
    "instructions": "Take with breakfast"
  }'
```

#### Log Medicine Taken
```bash
curl -X POST http://localhost:8080/api/medicine-logs \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "medicineId": "MEDICINE_ID",
    "scheduledTime": "09:00",
    "status": "taken",
    "notes": "Taken with breakfast"
  }'
```

#### Record Health Check
```bash
curl -X POST http://localhost:8080/api/health-checks \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "date": "2024-10-31",
    "mood": "good",
    "energyLevel": 8,
    "symptoms": [],
    "notes": "Feeling great today!"
  }'
```

---

## 🔒 Security & Validation

- All endpoints require JWT authentication
- User ownership validation on all resources
- Input validation for time formats (HH:MM)
- Soft deletes for data integrity
- Unique constraints to prevent duplicate logs
- Rate limiting recommended for production

---

## 📈 Future Enhancements

- Push notifications for medicine reminders
- Family/caregiver sharing features
- Integration with wearable devices
- Advanced analytics and reporting
- Medication interaction warnings
- Pharmacy integration for refill reminders---


## 🤖 AI Integration Endpoints

### Chat with AI Assistant
**POST** `/api/ai/chat`

Send message to AI assistant (Futurix AI integration).

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "message": "I have a headache, what should I do?",
  "includeNavigation": true,
  "conversationId": "optional_conversation_id"
}
```

**Response (200):**
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

---

### Analyze Voice Command
**POST** `/api/ai/voice-command`

Analyze voice command for navigation intent.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "command": "book an appointment with doctor"
}
```

**Response (200):**
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

---

### Get Conversation History
**GET** `/api/ai/conversation/:conversationId`

Get conversation history by ID.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
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
        "timestamp": "2024-10-31T10:00:05Z",
        "intent": {
          "action": "navigate",
          "screen": "MedicineReminders",
          "confidence": 0.8
        }
      }
    ],
    "summary": "User discussed headache symptoms and treatment options",
    "lastActivity": "2024-10-31T10:00:05Z"
  }
}
```

---

### Get User Conversations
**GET** `/api/ai/conversations`

Get list of user's conversations.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `limit` - Number of conversations to return (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "conversationId": "conv_12345",
      "summary": "Discussion about headache symptoms",
      "lastActivity": "2024-10-31T10:00:05Z",
      "messageCount": 4,
      "lastMessage": "For a headache, you can try resting in a quiet, dark room..."
    }
  ]
}
```

---

### Clear Conversation History
**DELETE** `/api/ai/conversation/:conversationId`

Clear conversation history.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Conversation cleared successfully"
}
```

---

## 🧠 Smart Health Insights Endpoints

### Get Health Summary
**GET** `/api/insights/health-summary`

Get AI-generated health insights based on user data.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `days` - Number of days to analyze (default: 7)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": "Based on your recent medicine adherence and health checks, you're maintaining good health habits...",
    "recommendations": [
      "Consider setting more frequent reminders",
      "Schedule a check-up with your doctor",
      "Continue your current medication routine"
    ],
    "adherenceScore": 85,
    "trends": {
      "medicineAdherence": "good",
      "moodTrend": "positive",
      "energyLevel": "high"
    },
    "dataPoints": {
      "medicineAdherence": 85,
      "totalMedicinesScheduled": 20,
      "medicinesTaken": 17,
      "recentMood": "good",
      "recentEnergyLevel": 8,
      "commonSymptoms": ["headache"]
    },
    "generatedAt": "2024-10-31T12:00:00Z"
  }
}
```

---

### Analyze Symptoms
**POST** `/api/insights/analyze-symptoms`

Analyze symptoms using AI.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "symptoms": ["headache", "fatigue", "nausea"],
  "duration": "2 days",
  "severity": "moderate"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "analysis": "Based on the symptoms you've described (headache, fatigue, nausea), this could indicate several conditions...",
    "recommendations": [
      "Rest and stay hydrated",
      "Monitor symptoms for 24 hours",
      "Consult a doctor if symptoms worsen",
      "Avoid bright lights and loud noises",
      "Consider over-the-counter pain relief"
    ],
    "urgencyLevel": "low",
    "shouldSeeDoctor": false,
    "emergencyWarning": false,
    "symptoms": ["headache", "fatigue", "nausea"],
    "duration": "2 days",
    "severity": "moderate",
    "analyzedAt": "2024-10-31T12:00:00Z"
  }
}
```

---

### Get Health Insights History
**GET** `/api/insights`

Get health insights history.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Query Parameters:**
- `type` - Filter by insight type (daily_summary, weekly_report, symptom_analysis, adherence_insight)
- `limit` - Number of insights to return (default: 10)
- `unreadOnly` - Show only unread insights (true/false)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "insight_id",
      "userId": "user_id",
      "type": "symptom_analysis",
      "content": "Analysis of reported headache symptoms...",
      "recommendations": ["Rest", "Stay hydrated"],
      "dataPoints": {
        "symptomsCount": 3
      },
      "generatedAt": "2024-10-31T12:00:00Z",
      "isRead": false
    }
  ]
}
```

---

### Mark Insight as Read
**PUT** `/api/insights/:id/read`

Mark health insight as read.

**Headers:**
```
x-auth-token: YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Insight marked as read"
}
```

---

## 🔧 AI Service Configuration

### Futurix AI Integration

The backend integrates with Futurix AI service for intelligent responses:

- **API URL**: `https://api.futurixai.com/api/lara/v1/chat/completions`
- **Model**: `shivaay`
- **Features**: Healthcare-focused responses, navigation intent detection, conversation memory

### Navigation Intent Detection

The AI can detect when users want to navigate to different screens:

**Available Screens:**
- `Home` - Main dashboard
- `Appointments` - View appointments
- `CreateAppointment` - Book new appointment
- `MedicineReminders` - Medicine management
- `Profile` - User profile
- `AI` - AI chat interface
- `HealthChecks` - Health monitoring
- `EmergencyContacts` - Emergency contacts

**Intent Format:**
```json
{
  "action": "navigate",
  "screen": "ScreenName",
  "confidence": 0.9,
  "parameters": {
    "type": "appointment"
  }
}
```

---

## 🧪 Testing AI Features

### Run AI API Tests
```bash
npm run test:ai
```

### Run All Tests Including AI
```bash
npm run test:all
```

### Manual Testing Examples

#### Chat with AI
```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "message": "I have a headache, what should I do?",
    "includeNavigation": true
  }'
```

#### Analyze Voice Command
```bash
curl -X POST http://localhost:8080/api/ai/voice-command \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "command": "book an appointment with doctor"
  }'
```

#### Get Health Summary
```bash
curl -X GET "http://localhost:8080/api/insights/health-summary?days=7" \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

#### Analyze Symptoms
```bash
curl -X POST http://localhost:8080/api/insights/analyze-symptoms \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "symptoms": ["headache", "fatigue"],
    "duration": "2 days",
    "severity": "moderate"
  }'
```

---

## 📊 AI Data Models

### AI Conversation Model
```javascript
{
  userId: ObjectId,              // Reference to User
  conversationId: String,        // Unique conversation ID
  messages: [{
    role: String,                // user, assistant, system
    content: String,             // Message content
    timestamp: Date,             // When message was sent
    intent: {                    // Detected navigation intent
      action: String,            // navigate, action, etc.
      screen: String,            // Target screen name
      confidence: Number,        // Confidence score 0-1
      parameters: Mixed          // Additional parameters
    }
  }],
  summary: String,               // Conversation summary
  lastActivity: Date,            // Last message timestamp
  isActive: Boolean              // Active status
}
```

### Health Insight Model
```javascript
{
  userId: ObjectId,              // Reference to User
  type: String,                  // daily_summary, weekly_report, etc.
  content: String,               // AI-generated insight content
  recommendations: [String],     // Array of recommendations
  dataPoints: {                  // Supporting data
    medicineAdherence: Number,
    moodScore: Number,
    energyLevel: Number,
    symptomsCount: Number
  },
  generatedAt: Date,             // When insight was generated
  isRead: Boolean                // Read status
}
```

---

## 🔒 AI Security & Privacy

- All AI endpoints require JWT authentication
- Conversation data is encrypted and user-specific
- No sensitive medical data is sent to external AI services
- AI responses are filtered for healthcare appropriateness
- Conversation history can be cleared by users
- Rate limiting recommended for AI endpoints

---

## 🚀 AI Features Summary

### ✅ Implemented Features:
- **Intelligent Chat**: Healthcare-focused AI assistant powered by Shivaay AI
- **Voice Command Analysis**: Natural language navigation
- **Conversation Memory**: Persistent chat history with intent detection
- **Health Insights**: AI-powered health summaries based on user data
- **Symptom Analysis**: Smart symptom evaluation with urgency detection
- **Navigation Intent**: Automatic screen navigation detection
- **Personalized Recommendations**: Based on user health data and patterns
- **Fallback System**: Graceful degradation when AI service is unavailable

### 🔮 Future AI Enhancements:
- Medication interaction warnings
- Predictive health alerts
- Family caregiver insights
- Integration with wearable devices
- Multi-language support
- Voice-to-text transcription
- Appointment scheduling via AI
- Emergency situation detection

---

## 🧪 Testing & Development

### Available Test Scripts

```bash
# Test basic API functionality
npm run test

# Test medicine management APIs
npm run test:medicine

# Test AI integration and health insights
npm run test:ai

# Test Shivaay API connectivity
npm run test:shivaay

# Run all tests
npm run test:all
```

### Test Coverage

#### ✅ **Core API Tests** (`npm run test`)
- User authentication (register/login)
- User profile management
- Appointment CRUD operations
- Basic Dialogflow integration

#### ✅ **Medicine Management Tests** (`npm run test:medicine`)
- Medicine CRUD operations
- Medicine logging and adherence tracking
- Health check recording
- Emergency contact management
- Emergency alert system

#### ✅ **AI Integration Tests** (`npm run test:ai`)
- Shivaay AI chat functionality
- Voice command analysis
- Conversation history management
- Health insights generation
- Symptom analysis
- Navigation intent detection

#### ✅ **API Connectivity Tests** (`npm run test:shivaay`)
- Direct Shivaay API connectivity
- Authentication verification
- Error handling validation
- Fallback system testing

### Manual Testing Examples

#### Test AI Chat
```bash
curl -X POST http://localhost:8080/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "message": "I have a headache, what should I do?",
    "includeNavigation": true
  }'
```

#### Test Health Summary
```bash
curl -X GET "http://localhost:8080/api/insights/health-summary?days=7" \
  -H "x-auth-token: YOUR_JWT_TOKEN"
```

#### Test Medicine Creation
```bash
curl -X POST http://localhost:8080/api/medicines \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_JWT_TOKEN" \
  -d '{
    "name": "Vitamin D",
    "dosage": "1000 IU",
    "frequency": "daily",
    "times": ["09:00"],
    "startDate": "2024-10-31"
  }'
```

### Development Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run tests to verify setup:**
   ```bash
   npm run test:all
   ```

3. **Check API connectivity:**
   ```bash
   npm run test:shivaay
   ```

### Environment Configuration

Ensure these environment variables are set in `.env`:

```env
# Database
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"

# Shivaay AI
SHIVAAY_API_KEY="your_shivaay_api_key"
SHIVAAY_API_URL="https://api.futurixai.com/api/shivaay/v1/chat/completions"

# Google Cloud (optional)
GOOGLE_APPLICATION_CREDENTIALS="credentials.json"
GOOGLE_PROJECT_ID="your_project_id"
GOOGLE_LOCATION="us-central1"
GOOGLE_AGENT_ID="your_agent_id"
```

### Troubleshooting

#### Common Issues:

1. **AI Service Unavailable**
   - Check Shivaay API key validity
   - Verify network connectivity
   - Fallback responses will be used automatically

2. **Database Connection Issues**
   - Verify MongoDB URI
   - Check network connectivity to database
   - Ensure database user has proper permissions

3. **Authentication Errors**
   - Verify JWT secret is set
   - Check token expiration
   - Ensure proper header format: `x-auth-token: TOKEN`

4. **Google Cloud Services**
   - Verify service account credentials
   - Check API enablement
   - Ensure proper IAM permissions

### Performance Monitoring

- Monitor API response times
- Track AI service availability
- Monitor database query performance
- Log error rates and patterns

---

## 📋 Complete Endpoint Reference

### Authentication & Users
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
```

### Appointments
```
GET    /api/appointments           - Get all appointments
POST   /api/appointments           - Create appointment
PUT    /api/appointments/:id       - Update appointment
```

### Medicine Management
```
GET    /api/medicines              - Get all medicines
POST   /api/medicines              - Create medicine
GET    /api/medicines/:id          - Get medicine by ID
PUT    /api/medicines/:id          - Update medicine
DELETE /api/medicines/:id          - Delete medicine
```

### Medicine Logging
```
POST   /api/medicine-logs          - Create medicine log
GET    /api/medicine-logs          - Get medicine logs
GET    /api/medicine-logs/stats    - Get adherence statistics
PUT    /api/medicine-logs/:id      - Update medicine log
```

### Health Monitoring
```
POST   /api/health-checks          - Create health check
GET    /api/health-checks          - Get health checks
GET    /api/health-checks/trends   - Get health trends
GET    /api/health-checks/:date    - Get health check by date
DELETE /api/health-checks/:id      - Delete health check
```

### Emergency System
```
GET    /api/emergency-contacts     - Get emergency contacts
POST   /api/emergency-contacts     - Create emergency contact
GET    /api/emergency-contacts/:id - Get contact by ID
PUT    /api/emergency-contacts/:id - Update emergency contact
DELETE /api/emergency-contacts/:id - Delete emergency contact
POST   /api/emergency/trigger      - Trigger emergency alert
```

### AI Integration
```
POST   /api/ai/chat                     - Chat with AI assistant
POST   /api/ai/voice-command            - Analyze voice command
GET    /api/ai/conversations            - Get conversation list
GET    /api/ai/conversation/:id         - Get conversation history
DELETE /api/ai/conversation/:id         - Clear conversation
POST   /api/ai/dialogflow/detect-intent - Dialogflow integration
POST   /api/ai/summarize                - Summarize transcript
POST   /api/ai/generate                 - Generate AI response
```

### Health Insights
```
GET    /api/insights/health-summary     - Get AI health summary
POST   /api/insights/analyze-symptoms   - Analyze symptoms with AI
GET    /api/insights                    - Get insights history
PUT    /api/insights/:id/read           - Mark insight as read
```

### WebSocket
```
ws://localhost:8080                     - Real-time translation
```

---

**Total Endpoints**: 35+ REST endpoints + WebSocket  
**Authentication**: JWT required for all protected endpoints  
**Rate Limiting**: Recommended for production  
**CORS**: Configured for cross-origin requests
- Emergency situation detection