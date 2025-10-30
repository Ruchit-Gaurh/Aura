require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const TranslationServer = require('./websocket/translationServer');

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    message: 'Aura API Running',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      users: {
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile'
      },
      appointments: {
        getAll: 'GET /api/appointments',
        create: 'POST /api/appointments',
        update: 'PUT /api/appointments/:id'
      },
      ai: {
        dialogflow: 'POST /api/ai/dialogflow/detect-intent',
        summarize: 'POST /api/ai/summarize',
        generate: 'POST /api/ai/generate',
        chat: 'POST /api/ai/chat',
        voiceCommand: 'POST /api/ai/voice-command',
        getConversation: 'GET /api/ai/conversation/:conversationId',
        clearConversation: 'DELETE /api/ai/conversation/:conversationId',
        getConversations: 'GET /api/ai/conversations'
      },
      insights: {
        healthSummary: 'GET /api/insights/health-summary',
        analyzeSymptoms: 'POST /api/insights/analyze-symptoms',
        getInsights: 'GET /api/insights',
        markAsRead: 'PUT /api/insights/:id/read'
      },
      medicines: {
        getAll: 'GET /api/medicines',
        create: 'POST /api/medicines',
        getById: 'GET /api/medicines/:id',
        update: 'PUT /api/medicines/:id',
        delete: 'DELETE /api/medicines/:id'
      },
      medicineLogs: {
        create: 'POST /api/medicine-logs',
        getAll: 'GET /api/medicine-logs',
        getStats: 'GET /api/medicine-logs/stats',
        update: 'PUT /api/medicine-logs/:id'
      },
      healthChecks: {
        create: 'POST /api/health-checks',
        getAll: 'GET /api/health-checks',
        getByDate: 'GET /api/health-checks/:date',
        getTrends: 'GET /api/health-checks/trends',
        delete: 'DELETE /api/health-checks/:id'
      },
      emergencyContacts: {
        getAll: 'GET /api/emergency-contacts',
        create: 'POST /api/emergency-contacts',
        getById: 'GET /api/emergency-contacts/:id',
        update: 'PUT /api/emergency-contacts/:id',
        delete: 'DELETE /api/emergency-contacts/:id'
      },
      emergency: {
        trigger: 'POST /api/emergency/trigger'
      },
      websocket: 'ws://localhost:8080 (for real-time translation)'
    }
  });
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/ai', require('./routes/ai'));

// Medicine reminder routes
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/medicine-logs', require('./routes/medicine-logs'));
app.use('/api/health-checks', require('./routes/health-checks'));
app.use('/api/emergency-contacts', require('./routes/emergency-contacts'));
app.use('/api/emergency', require('./routes/emergency'));

// AI and insights routes
app.use('/api/insights', require('./routes/insights'));

// Initialize WebSocket server for real-time translation
const translationServer = new TranslationServer(server);

// Error Handler Middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));