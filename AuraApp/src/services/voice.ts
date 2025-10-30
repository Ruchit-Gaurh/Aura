import Voice from '@react-native-voice/voice';
import { PermissionsAndroid, Platform } from 'react-native';

export interface VoiceRecognitionResult {
  transcript: string;
  confidence?: number;
}

export interface VoiceRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (result: VoiceRecognitionResult) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

class VoiceService {
  private isListening = false;
  private callbacks: VoiceRecognitionCallbacks = {};

  constructor() {
    this.initializeVoice();
  }

  private initializeVoice() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechError = this.onSpeechError;
  }

  private onSpeechStart = () => {
    console.log('Voice recognition started');
    this.isListening = true;
    this.callbacks.onStart?.();
  };

  private onSpeechEnd = () => {
    console.log('Voice recognition ended');
    this.isListening = false;
    this.callbacks.onEnd?.();
  };

  private onSpeechResults = (event: any) => {
    const results = event.value;
    if (results && results.length > 0) {
      const transcript = results[0];
      console.log('Voice recognition result:', transcript);
      this.callbacks.onResult?.({
        transcript,
        confidence: 1.0, // Voice doesn't provide confidence scores
      });
    }
  };

  private onSpeechPartialResults = (event: any) => {
    const results = event.value;
    if (results && results.length > 0) {
      const transcript = results[0];
      console.log('Partial voice result:', transcript);
      // You can handle partial results here if needed
    }
  };

  private onSpeechError = (event: any) => {
    console.error('Voice recognition error:', event.error);
    this.isListening = false;
    this.callbacks.onError?.(event.error);
  };

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Aura needs access to your microphone for voice recognition',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
        return false;
      }
    }
    return true; // iOS permissions are handled automatically
  }

  async startListening(
    language: string = 'en-US',
    callbacks: VoiceRecognitionCallbacks = {}
  ): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      this.callbacks = callbacks;

      if (this.isListening) {
        await this.stopListening();
      }

      await Voice.start(language);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      this.callbacks.onError?.(error);
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    try {
      await Voice.stop();
      this.isListening = false;
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      throw error;
    }
  }

  async cancelListening(): Promise<void> {
    try {
      await Voice.cancel();
      this.isListening = false;
    } catch (error) {
      console.error('Error canceling voice recognition:', error);
      throw error;
    }
  }

  getIsListening(): boolean {
    return this.isListening;
  }

  async isAvailable(): Promise<boolean> {
    try {
      const available = await Voice.isAvailable();
      return Boolean(available);
    } catch (error) {
      console.error('Error checking voice availability:', error);
      return false;
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    try {
      // Note: getSupportedLanguages might not be available in all versions
      // Return default supported languages for now
      return [
        'en-US', 'es-ES', 'fr-FR', 'de-DE', 'it-IT',
        'pt-BR', 'zh-CN', 'ja-JP', 'ko-KR', 'ar-SA'
      ];
    } catch (error) {
      console.error('Error getting supported languages:', error);
      return ['en-US'];
    }
  }

  destroy() {
    Voice.destroy().then(Voice.removeAllListeners);
  }
}

export const voiceService = new VoiceService();