# Aura Backend API

A comprehensive backend API for the Aura healthcare application with AI integration capabilities.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Appointment Management**: CRUD operations for medical appointments
- **AI Integration**: 
  - Dialogflow CX for conversational AI
  - Local LLM (Ollama) for transcript summarization
  - Real-time translation via WebSockets
- **Real-time Communication**: WebSocket server for live translation during calls

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Google Cloud account (for AI services)
- Ollama installed locally (for LLM features)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=8080
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_super_secret_key"

# Google Cloud Configuration
GOOGLE_APPLICATION_CREDENTIALS="path/to/your/service-account-key.json"
GOOGLE_PROJECT_ID="your-google-project-id"
GOOGLE_LOCATION="us-central1"
GOOGLE_AGENT_ID="your-dialogflow-agent-id"
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Appointments
- `GET /api/appointments` - Get user appointments (protected)
- `POST /api/appointments` - Create appointment (protected)
- `PUT /api/appointments/:id` - Update appointment (protected)

### AI Services
- `POST /api/ai/dialogflow/detect-intent` - Dialogflow intent detection (protected)
- `POST /api/ai/summarize` - Summarize transcript with LLM (protected)
- `POST /api/ai/generate` - Generate AI response (protected)

### WebSocket
- `ws://localhost:8080` - Real-time translation service

## Testing

Run the API test script:
```bash
node test-api.js
```

## Google Cloud Setup

1. Create a Google Cloud project
2. Enable the following APIs:
   - Dialogflow API
   - Cloud Speech-to-Text API
   - Cloud Translation API
3. Create a service account with appropriate permissions
4. Download the service account key JSON file
5. Update the `GOOGLE_APPLICATION_CREDENTIALS` path in `.env`

## Ollama Setup

1. Install Ollama: https://ollama.ai/
2. Pull a model:
```bash
ollama pull llama3.2
```

## WebSocket Usage

Connect to the WebSocket server and send messages in this format:

```javascript
// Join a translation room
{
  "type": "join_room",
  "roomId": "appointment_123",
  "userId": "user_456",
  "targetLanguage": "es"
}

// Send text for translation
{
  "type": "text_message",
  "roomId": "appointment_123",
  "userId": "user_456",
  "text": "Hello, how are you feeling today?",
  "targetLanguage": "es"
}
```

## Project Structure

```
aura-backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication & error handling
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── websocket/       # WebSocket server
├── .env            # Environment variables
├── index.js        # Main server file
└── package.json    # Dependencies
```

## Development

- Use `npm run dev` for development with auto-restart
- All routes except auth are protected with JWT middleware
- Error handling middleware catches and formats errors
- WebSocket server runs on the same port as HTTP server

## Deployment

1. Set up environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Upload Google Cloud service account key securely
4. Install Ollama on the server (if using LLM features)

## Contributing

1. Create feature branches from `develop`
2. Test thoroughly before merging
3. Follow the existing code structure and naming conventions