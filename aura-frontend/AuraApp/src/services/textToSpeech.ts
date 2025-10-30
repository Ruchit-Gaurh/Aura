import { Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';

export interface TextToSpeechOptions {
  language?: string;
  rate?: number; // 0.1 to 2.0
  pitch?: number; // 0.5 to 2.0
  volume?: number; // 0.0 to 1.0
}

class TextToSpeechService {
  private isSupported = false;
  private speechSynthesis: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      this.speechSynthesis = window.speechSynthesis;
      this.isSupported = true;
      
      // Load available voices
      this.loadVoices();
      
      // Listen for voices changed event (some browsers load voices asynchronously)
      if (this.speechSynthesis.onvoiceschanged !== undefined) {
        this.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    } else {
      console.log('🔊 Text-to-Speech not supported on this platform');
    }
  }

  private loadVoices() {
    if (this.speechSynthesis) {
      this.availableVoices = this.speechSynthesis.getVoices();
      console.log('🔊 Available voices loaded:', this.availableVoices.length);
    }
  }

  private getVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) {
      this.loadVoices();
    }

    // Try to find exact language match first
    let voice = this.availableVoices.find(v => v.lang === language);
    
    if (!voice) {
      // Try to find language family match (e.g., 'en' for 'en-US')
      const languageFamily = language.split('-')[0];
      voice = this.availableVoices.find(v => v.lang.startsWith(languageFamily));
    }
    
    if (!voice) {
      // Fallback to default voice
      voice = this.availableVoices.find(v => v.default) || this.availableVoices[0];
    }

    return voice || null;
  }

  async speak(text: string, options: TextToSpeechOptions = {}): Promise<void> {
    if (!this.isSupported || !this.speechSynthesis) {
      console.warn('🔊 Text-to-Speech not supported');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.speechSynthesis!.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice based on language
        if (options.language) {
          const voice = this.getVoiceForLanguage(options.language);
          if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang;
          }
        }

        // Set speech parameters
        utterance.rate = options.rate || 0.9; // Slightly slower for elderly users
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Event handlers
        utterance.onend = () => {
          console.log('🔊 Speech completed:', text);
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('🔊 Speech error:', event.error);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        utterance.onstart = () => {
          console.log('🔊 Speech started:', text);
        };

        // Speak the text
        this.speechSynthesis!.speak(utterance);
        
      } catch (error) {
        console.error('🔊 Text-to-Speech error:', error);
        reject(error);
      }
    });
  }

  stop() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.availableVoices;
  }

  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const languageFamily = language.split('-')[0];
    return this.availableVoices.filter(voice => 
      voice.lang === language || voice.lang.startsWith(languageFamily)
    );
  }

  isTextToSpeechSupported(): boolean {
    return this.isSupported;
  }
}

export const textToSpeechService = new TextToSpeechService();