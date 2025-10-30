// Web Speech API implementation for browser compatibility
import { VoiceRecognitionResult, VoiceRecognitionCallbacks } from './voice';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

class WebVoiceService {
  private recognition: any = null;
  private isListening = false;
  private callbacks: VoiceRecognitionCallbacks = {};

  constructor() {
    this.initializeWebSpeech();
  }

  private initializeWebSpeech() {
    // Check if Web Speech API is available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    } else {
      console.warn('🎤 Web Speech API not supported in this browser');
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    // Configure recognition settings
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    // Event handlers
    this.recognition.onstart = () => {
      console.log('🎤 Web speech recognition started');
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[0];
      if (result.isFinal) {
        const transcript = result[0].transcript;
        console.log('🎤 Web speech result:', transcript);
        
        const voiceResult: VoiceRecognitionResult = {
          transcript: transcript.trim(),
          confidence: result[0].confidence || 1.0,
        };
        
        this.callbacks.onResult?.(voiceResult);
      }
    };

    this.recognition.onend = () => {
      console.log('🎤 Web speech recognition ended');
      this.isListening = false;
      this.callbacks.onEnd?.();
      
      // Force state sync after a short delay
      setTimeout(() => {
        if (this.isListening) {
          console.log('🎤 Force stopping - state sync issue detected');
          this.isListening = false;
          this.callbacks.onEnd?.();
        }
      }, 100);
    };

    this.recognition.onerror = (event: any) => {
      console.error('🎤 Web speech recognition error:', event.error);
      this.isListening = false;
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected - try speaking louder';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not available';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied';
          break;
        case 'network':
          errorMessage = 'Network error';
          break;
        case 'aborted':
          errorMessage = 'Speech recognition aborted';
          break;
        default:
          errorMessage = `Speech error: ${event.error}`;
      }
      
      this.callbacks.onError?.(errorMessage);
      
      // Force state sync
      setTimeout(() => {
        this.isListening = false;
      }, 50);
    };
  }

  async requestPermissions(): Promise<boolean> {
    try {
      // For web, we'll check when we try to start recognition
      return true;
    } catch (error) {
      console.error('Error requesting microphone permission:', error);
      return false;
    }
  }

  async startListening(
    language: string = 'en-US',
    callbacks: VoiceRecognitionCallbacks = {}
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Web Speech API not supported');
    }

    if (this.isListening) {
      console.log('🎤 Already listening');
      return;
    }

    this.callbacks = callbacks;
    this.recognition.lang = language;

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Error starting web speech recognition:', error);
      throw new Error('Failed to start speech recognition');
    }
  }

  async stopListening(): Promise<void> {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  async cancelListening(): Promise<void> {
    if (this.recognition && this.isListening) {
      this.recognition.abort();
      this.isListening = false;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async isAvailable(): Promise<boolean> {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async getSupportedLanguages(): Promise<string[]> {
    // Web Speech API doesn't provide a way to get supported languages
    // Return common languages
    return [
      'en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT',
      'pt-BR', 'zh-CN', 'ja-JP', 'ko-KR', 'ar-SA'
    ];
  }

  destroy() {
    if (this.recognition) {
      this.recognition.abort();
      this.recognition = null;
    }
  }
}

export const webVoiceService = new WebVoiceService();