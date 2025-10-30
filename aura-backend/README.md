# 🖥️ Aura Backend - Healthcare API Server

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![AI](https://img.shields.io/badge/AI-Shivaay%20API-orange?style=for-the-badge&logo=openai)

**Comprehensive REST API server with AI integration for healthcare management**

</div>

## 🌟 Overview

The Aura Backend is a robust Node.js API server that powers the entire Aura healthcare ecosystem. It provides comprehensive healthcare management features, AI-powered insights, real-time communication, and seamless integration with external AI services.

## ✨ Key Features

### 🔐 **Authentication & Security**
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Access** - User ownership validation
- **Rate Limiting** - API abuse protection

### 💊 **Healthcare Management**
- **Medicine Reminders** - Complete CRUD with scheduling
- **Adherence Tracking** - Comprehensive logging system
- **Health Monitoring** - Daily health check recording
- **Emergency System** - Contact management and alerts

### 🤖 **AI Integration**
- **Shivaay AI Chat** - Healthcare-focused conversations
- **Voice Commands** - Natural language navigation
- **Health Insights** - AI-powered health summaries
- **Symptom Analysis** - Intelligent symptom evaluation
- **Dialogflow CX** - Advanced conversational AI
- **Local LLM** - Ollama integration for privacy

### 🌐 **Real-time Features**
- **WebSocket Server** - Live translation services
- **Multi-language Support** - Google Cloud Translation
- **Speech-to-Text** - Real-time audio processing
- **Live Communication** - Cross-platform messaging

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20.x or higher
- **MongoDB** database (local or Atlas)
- **Shivaay AI API Key** (for AI features)
- **Google Cloud Account** (optional, for advanced AI)
- **Ollama** (optional, for local LLM)

### Installation

1. **Clone and navigate to backend:**
```bash
git clone <repository-url>
cd aura-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server:**
```bash
npm run dev
```

## 🔧 Environment Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI="mongodb+srv://username:password@cluster.mongodb.net/aura"
JWT_SECRET="your-super-secure-jwt-secret"

# Shivaay AI (Required for AI features)
SHIVAAY_API_KEY="your-shivaay-api-key"
SHIVAAY_API_URL="https://api.futurixai.com/api/shivaay/v1/chat/completions"

# Google Cloud (Optional - for advanced AI features)
GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
GOOGLE_PROJECT_ID="your-google-project-id"
GOOGLE_LOCATION="us-central1"
GOOGLE_AGENT_ID="your-dialogflow-agent-id"
```

## 📊 API Endpoints

### 🔐 Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
```

### 👤 User Management
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update user profile
```

### 📅 Appointments
```
GET    /api/appointments           # Get all appointments
POST   /api/appointments           # Create appointment
PUT    /api/appointments/:id       # Update appointment
```

### 💊 Medicine Management
```
GET    /api/medicines              # Get all medicines
POST   /api/medicines              # Create medicine
GET    /api/medicines/:id          # Get medicine by ID
PUT    /api/medicines/:id          # Update medicine
DELETE /api/medicines/:id          # Delete medicine
```

### 📝 Medicine Logging
```
POST   /api/medicine-logs          # Log medicine taken/skipped
GET    /api/medicine-logs          # Get medicine logs
GET    /api/medicine-logs/stats    # Get adherence statistics
PUT    /api/medicine-logs/:id      # Update medicine log
```

### 🏥 Health Monitoring
```
POST   /api/health-checks          # Record daily health check
GET    /api/health-checks          # Get health check history
GET    /api/health-checks/trends   # Get health trends
GET    /api/health-checks/:date    # Get health check by date
DELETE /api/health-checks/:id      # Delete health check
```

### 🚨 Emergency System
```
GET    /api/emergency-contacts     # Get emergency contacts
POST   /api/emergency-contacts     # Add emergency contact
PUT    /api/emergency-contacts/:id # Update emergency contact
DELETE /api/emergency-contacts/:id # Delete emergency contact
POST   /api/emergency/trigger      # Trigger emergency alert
```

### 🤖 AI Integration
```
POST   /api/ai/chat                     # Chat with AI assistant
POST   /api/ai/voice-command            # Analyze voice command
GET    /api/ai/conversations            # Get conversation list
GET    /api/ai/conversation/:id         # Get conversation history
DELETE /api/ai/conversation/:id         # Clear conversation
POST   /api/ai/dialogflow/detect-intent # Dialogflow integration
POST   /api/ai/summarize                # Summarize transcript
POST   /api/ai/generate                 # Generate AI response
```

### 🧠 Health Insights
```
GET    /api/insights/health-summary     # Get AI health summary
POST   /api/insights/analyze-symptoms   # Analyze symptoms with AI
GET    /api/insights                    # Get insights history
PUT    /api/insights/:id/read           # Mark insight as read
```

### 🌐 WebSocket
```
ws://localhost:8080                     # Real-time translation
```

**Total: 35+ REST endpoints + WebSocket server**

## 🧪 Testing

### Available Test Scripts
```bash
# Test core API functionality
npm run test

# Test medicine management
npm run test:medicine

# Test AI integration
npm run test:ai

# Test Shivaay API connectivity
npm run test:shivaay

# Run all tests
npm run test:all
```

### Test Coverage
- ✅ **Authentication & Authorization**
- ✅ **Medicine Management CRUD**
- ✅ **Health Check Recording**
- ✅ **Emergency Contact System**
- ✅ **AI Chat Integration**
- ✅ **Voice Command Analysis**
- ✅ **Health Insights Generation**
- ✅ **API Connectivity**

## 🏗️ Project Structure

```
aura-backend/
├── 📁 config/              # Database configuration
├── 📁 controllers/         # Request handlers & business logic
│   ├── aiChatController.js
│   ├── medicineController.js
│   ├── healthCheckController.js
│   └── emergencyContactController.js
├── 📁 middleware/          # Authentication & error handling
├── 📁 models/              # MongoDB schemas
│   ├── User.model.js
│   ├── Medicine.model.js
│   ├── HealthCheck.model.js
│   └── AIConversation.model.js
├── 📁 routes/              # API route definitions
├── 📁 services/            # External service integrations
│   └── aiService.js
├── 📁 websocket/           # WebSocket server
├── 📄 .env                 # Environment variables
├── 📄 index.js             # Main server entry point
└── 📄 package.json         # Dependencies & scripts
```

## 🤖 AI Service Integration

### Shivaay AI Configuration
The backend integrates with Shivaay AI for intelligent healthcare conversations:

```javascript
// Example AI chat request
{
  "message": "I have a headache, what should I do?",
  "includeNavigation": true,
  "conversationId": "optional-conversation-id"
}

// Response with navigation intent
{
  "response": "For headache relief, try resting in a quiet room...",
  "intent": {
    "action": "navigate",
    "screen": "MedicineReminders",
    "confidence": 0.9
  },
  "suggestions": ["Set medicine reminder", "Contact doctor"]
}
```

### Fallback System
Robust fallback system ensures functionality even when AI services are unavailable:
- Graceful degradation to local responses
- Comprehensive error handling
- Service availability monitoring

## 🌐 WebSocket Real-time Features

### Translation Service
```javascript
// Join translation room
{
  "type": "join_room",
  "roomId": "appointment_123",
  "userId": "user_456",
  "targetLanguage": "es"
}

// Send message for translation
{
  "type": "text_message",
  "roomId": "appointment_123",
  "text": "How are you feeling today?",
  "targetLanguage": "es"
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Secure error responses
- **Rate Limiting** - API abuse protection
- **CORS Configuration** - Cross-origin request handling

## 🌍 Deployment

### Production Deployment Options

#### 1. Heroku Deployment
```bash
# Install Heroku CLI
heroku create aura-backend
heroku config:set MONGO_URI="your-production-db-uri"
heroku config:set JWT_SECRET="your-production-jwt-secret"
git push heroku main
```

#### 2. AWS/Google Cloud
- Deploy using Docker containers
- Configure environment variables
- Set up load balancing and auto-scaling

#### 3. Traditional VPS
- Use PM2 for process management
- Configure reverse proxy (Nginx)
- Set up SSL certificates

### Environment Variables for Production
```env
NODE_ENV=production
PORT=8080
MONGO_URI="production-mongodb-uri"
JWT_SECRET="production-jwt-secret"
SHIVAAY_API_KEY="production-api-key"
```

## 📚 Documentation

- **[Complete API Documentation](./API_DOCUMENTATION.md)** - Comprehensive API reference
- **[Google Cloud Setup Guide](./GOOGLE_CLOUD_SETUP.md)** - AI services configuration
- **[Dialogflow Setup Guide](./DIALOGFLOW_SETUP_GUIDE.md)** - Conversational AI setup

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MongoDB URI and network connectivity
   npm run test
   ```

2. **AI Service Unavailable**
   ```bash
   # Test AI connectivity
   npm run test:shivaay
   ```

3. **Authentication Errors**
   ```bash
   # Verify JWT secret configuration
   echo $JWT_SECRET
   ```

### Debug Mode
```bash
# Enable debug logging
DEBUG=aura:* npm run dev
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Write tests** for new functionality
4. **Ensure all tests pass** (`npm run test:all`)
5. **Update documentation** as needed
6. **Submit pull request**

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update API documentation for endpoint changes
- Ensure backward compatibility

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

<div align="center">

**🏥 Built for better healthcare management**

[📊 API Docs](./API_DOCUMENTATION.md) • [🔧 Setup Guide](./GOOGLE_CLOUD_SETUP.md) • [🧪 Testing](./test-api.js)

</div>