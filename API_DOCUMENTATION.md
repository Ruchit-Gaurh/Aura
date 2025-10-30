# Aura Backend API Documentation

## Base URL
```
http://localhost:8080
```

## 🚨 Current Setup Status
- ✅ **Authentication & User Management**: Fully functional
- ✅ **Appointment Management**: Fully functional  
- ✅ **Local LLM (Ollama)**: Ready (requires Ollama installation)
- ✅ **Google Cloud AI Services**: Configured and ready
- ✅ **WebSocket Translation**: Fully functional

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
