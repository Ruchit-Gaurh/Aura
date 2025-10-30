const WebSocket = require('ws');
const { SpeechClient } = require('@google-cloud/speech');
const { TranslationServiceClient } = require('@google-cloud/translate');

// Initialize Google Cloud clients
const speechClient = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const translateClient = new TranslationServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Room management - in production, use Redis or similar
const rooms = new Map();

class TranslationServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.setupWebSocketHandlers();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection');

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          await this.handleMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ error: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.removeFromRooms(ws);
        console.log('WebSocket connection closed');
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  async handleMessage(ws, data) {
    const { type, roomId, userId, targetLanguage, audioData, text } = data;

    switch (type) {
      case 'join_room':
        this.joinRoom(ws, roomId, userId, targetLanguage);
        break;
      
      case 'audio_chunk':
        await this.processAudioChunk(ws, roomId, userId, audioData, targetLanguage);
        break;
      
      case 'text_message':
        await this.processTextMessage(ws, roomId, userId, text, targetLanguage);
        break;
      
      default:
        ws.send(JSON.stringify({ error: 'Unknown message type' }));
    }
  }

  joinRoom(ws, roomId, userId, targetLanguage) {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }

    const room = rooms.get(roomId);
    room.set(userId, { ws, targetLanguage });

    ws.roomId = roomId;
    ws.userId = userId;

    ws.send(JSON.stringify({
      type: 'joined_room',
      roomId,
      userId,
      participantCount: room.size
    }));

    console.log(`User ${userId} joined room ${roomId}`);
  }

  async processAudioChunk(ws, roomId, userId, audioData, targetLanguage) {
    try {
      // Convert audio to text using Google Speech-to-Text
      const audioBytes = Buffer.from(audioData, 'base64');
      
      const request = {
        audio: { content: audioBytes },
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'en-US',
        },
      };

      const [response] = await speechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      if (transcription) {
        // Translate and broadcast to other participants
        await this.translateAndBroadcast(roomId, userId, transcription, targetLanguage);
      }

    } catch (error) {
      console.error('Audio processing error:', error);
      ws.send(JSON.stringify({ error: 'Failed to process audio' }));
    }
  }

  async processTextMessage(ws, roomId, userId, text, targetLanguage) {
    try {
      await this.translateAndBroadcast(roomId, userId, text, targetLanguage);
    } catch (error) {
      console.error('Text processing error:', error);
      ws.send(JSON.stringify({ error: 'Failed to process text' }));
    }
  }

  async translateAndBroadcast(roomId, senderId, text, targetLanguage) {
    const room = rooms.get(roomId);
    if (!room) return;

    for (const [userId, participant] of room.entries()) {
      if (userId !== senderId && participant.ws.readyState === WebSocket.OPEN) {
        try {
          // Translate text to participant's preferred language
          const [translation] = await translateClient.translateText({
            parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
            contents: [text],
            mimeType: 'text/plain',
            sourceLanguageCode: 'en',
            targetLanguageCode: participant.targetLanguage || 'en',
          });

          const translatedText = translation.translations[0].translatedText;

          participant.ws.send(JSON.stringify({
            type: 'translated_message',
            senderId,
            originalText: text,
            translatedText,
            targetLanguage: participant.targetLanguage
          }));

        } catch (error) {
          console.error('Translation error:', error);
          participant.ws.send(JSON.stringify({
            type: 'translation_error',
            error: 'Failed to translate message'
          }));
        }
      }
    }
  }

  removeFromRooms(ws) {
    if (ws.roomId && ws.userId) {
      const room = rooms.get(ws.roomId);
      if (room) {
        room.delete(ws.userId);
        if (room.size === 0) {
          rooms.delete(ws.roomId);
        }
      }
    }
  }
}

module.exports = TranslationServer;