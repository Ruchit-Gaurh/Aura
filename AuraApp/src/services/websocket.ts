import { API_CONFIG } from '../config/api';
import { WebSocketMessage } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map();

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(API_CONFIG.WEBSOCKET_URL);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    // Handle different message types
    switch (message.type) {
      case 'joined_room':
        this.notifyHandlers('joined_room', message);
        break;
      case 'translated_message':
        this.notifyHandlers('translated_message', message);
        break;
      default:
        console.log('Unhandled message type:', message.type);
    }
  }

  private notifyHandlers(type: string, message: WebSocketMessage) {
    const handler = this.messageHandlers.get(type);
    if (handler) {
      handler(message);
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  sendMessage(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  joinRoom(roomId: string, userId: string, targetLanguage: string) {
    this.sendMessage({
      type: 'join_room',
      roomId,
      userId,
      targetLanguage,
    });
  }

  sendTextMessage(roomId: string, userId: string, text: string, targetLanguage: string) {
    this.sendMessage({
      type: 'text_message',
      roomId,
      userId,
      text,
      targetLanguage,
    });
  }

  sendAudioChunk(roomId: string, userId: string, audioData: string, targetLanguage: string) {
    this.sendMessage({
      type: 'audio_chunk',
      roomId,
      userId,
      audioData,
      targetLanguage,
    });
  }

  onMessage(type: string, handler: (message: WebSocketMessage) => void) {
    this.messageHandlers.set(type, handler);
  }

  offMessage(type: string) {
    this.messageHandlers.delete(type);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const webSocketService = new WebSocketService();