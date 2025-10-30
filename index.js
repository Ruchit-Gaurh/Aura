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
        generate: 'POST /api/ai/generate'
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

// Initialize WebSocket server for real-time translation
const translationServer = new TranslationServer(server);

// Error Handler Middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));