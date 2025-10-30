import { NavigationProp } from '@react-navigation/native';
import { voiceService } from './voice';
import { webVoiceService } from './webVoice';
import { Vibration, Platform } from 'react-native';
import { textToSpeechService } from './textToSpeech';
import { medicineReminderService } from './medicineReminder';
import { aiService, NavigationIntent } from './aiService';

export interface VoiceCommand {
  phrases: string[];
  action: string;
  description: string;
}

export interface VoiceNavigationCallbacks {
  onCommandRecognized?: (command: string) => void;
  onNavigationTriggered?: (action: string) => void;
  onError?: (error: string) => void;
}

class VoiceNavigationService {
  private navigation: NavigationProp<any> | null = null;
  private isListening = false;
  private isPersistentMode = false;
  private callbacks: VoiceNavigationCallbacks = {};
  private restartTimeout: NodeJS.Timeout | null = null;
  private userLanguage = 'en';

  // Enhanced voice commands for elderly-friendly navigation
  private commands: VoiceCommand[] = [
    // Navigation commands
    {
      phrases: ['go home', 'home screen', 'go to home', 'navigate home', 'main page', 'dashboard'],
      action: 'navigate_home',
      description: 'Navigate to home screen'
    },
    {
      phrases: ['appointments', 'my appointments', 'view appointments', 'show appointments', 'doctor visits', 'schedule'],
      action: 'navigate_appointments',
      description: 'View appointments'
    },
    {
      phrases: ['book appointment', 'schedule appointment', 'new appointment', 'create appointment', 'see doctor', 'make appointment'],
      action: 'navigate_book_appointment',
      description: 'Book new appointment'
    },
    {
      phrases: ['profile', 'my profile', 'user profile', 'account settings', 'personal info'],
      action: 'navigate_profile',
      description: 'View profile'
    },
    {
      phrases: ['ai assistant', 'chat', 'ai chat', 'talk to ai', 'ask question', 'help me'],
      action: 'navigate_ai',
      description: 'Open AI assistant'
    },
    
    // Medicine reminder commands
    {
      phrases: ['medicine reminder', 'set medicine reminder', 'pill reminder', 'medication reminder', 'remind me to take medicine'],
      action: 'navigate_medicine_reminders',
      description: 'Set up medicine reminders'
    },
    {
      phrases: ['check my medicines', 'my medications', 'medicine schedule', 'pill schedule', 'what medicines do i take'],
      action: 'view_medicine_schedule',
      description: 'View medicine schedule'
    },
    {
      phrases: ['take medicine', 'took medicine', 'medicine taken', 'pill taken', 'i took my medicine'],
      action: 'mark_medicine_taken',
      description: 'Mark medicine as taken'
    },
    {
      phrases: ['skip medicine', 'skip pill', 'medicine not needed', 'dont need medicine', 'skip this dose'],
      action: 'skip_medicine',
      description: 'Skip current medicine'
    },
    {
      phrases: ['medicine time', 'time for medicine', 'pill time', 'medication time'],
      action: 'check_medicine_time',
      description: 'Check if it\'s time for medicine'
    },
    
    // Health and emergency commands
    {
      phrases: ['emergency', 'help me', 'call doctor', 'urgent', 'i need help', 'emergency contact'],
      action: 'emergency_contact',
      description: 'Emergency contact'
    },
    {
      phrases: ['how are you feeling', 'health check', 'daily check', 'feeling today', 'health status'],
      action: 'health_check',
      description: 'Daily health check'
    },
    {
      phrases: ['call family', 'contact family', 'call my family', 'family contact'],
      action: 'contact_family',
      description: 'Contact family members'
    },
    
    // Action commands
    {
      phrases: ['go back', 'back', 'previous screen', 'return', 'go to previous'],
      action: 'go_back',
      description: 'Go back to previous screen'
    },
    {
      phrases: ['refresh', 'reload', 'update', 'refresh page'],
      action: 'refresh',
      description: 'Refresh current screen'
    },
    {
      phrases: ['logout', 'sign out', 'log out', 'exit app'],
      action: 'logout',
      description: 'Logout from app'
    },

    // Help commands
    {
      phrases: ['help', 'voice commands', 'what can i say', 'commands', 'how to use', 'instructions'],
      action: 'show_help',
      description: 'Show available voice commands'
    },
    {
      phrases: ['stop listening', 'stop voice', 'disable voice', 'quiet', 'stop talking'],
      action: 'stop_listening',
      description: 'Stop voice recognition'
    },
    
    // Time and date commands
    {
      phrases: ['what time is it', 'current time', 'time now', 'what is the time'],
      action: 'tell_time',
      description: 'Tell current time'
    },
    {
      phrases: ['what day is it', 'current date', 'todays date', 'what is the date'],
      action: 'tell_date',
      description: 'Tell current date'
    }
  ];

  setNavigation(navigation: NavigationProp<any>) {
    this.navigation = navigation;
  }

  setCallbacks(callbacks: VoiceNavigationCallbacks) {
    this.callbacks = callbacks;
  }

  setUserLanguage(language: string) {
    this.userLanguage = language;
  }

  async startListening(language: string = 'en-US', persistent: boolean = false) {
    try {
      if (this.isListening) {
        console.log('🎤 Voice navigation already listening');
        return;
      }

      console.log('🎤 Starting voice navigation...', persistent ? '(Persistent Mode)' : '(Single Use)');
      this.isListening = true;
      this.isPersistentMode = persistent;
      
      // Haptic feedback (only on mobile)
      if (Platform.OS !== 'web') {
        Vibration.vibrate(100);
      }

      // Choose appropriate voice service based on platform
      const currentVoiceService = Platform.OS === 'web' ? webVoiceService : voiceService;

      await currentVoiceService.startListening(language, {
        onStart: () => {
          console.log('🎤 Voice navigation started');
          this.callbacks.onCommandRecognized?.('Listening for commands...');
        },
        onResult: (result) => {
          this.processVoiceCommand(result.transcript);
        },
        onEnd: () => {
          console.log('🎤 Voice navigation ended');
          this.isListening = false;
          
          // Restart in persistent mode after a short delay
          if (this.isPersistentMode) {
            console.log('🎤 Restarting voice in persistent mode...');
            this.restartTimeout = setTimeout(() => {
              if (this.isPersistentMode) {
                this.startListening(language, true).catch(console.error);
              }
            }, 1000);
          }
        },
        onError: (error) => {
          console.error('🎤 Voice navigation error:', error);
          this.isListening = false;
          this.callbacks.onError?.(`Voice error: ${error}`);
        }
      });
    } catch (error) {
      console.error('🎤 Failed to start voice navigation:', error);
      this.isListening = false;
      this.callbacks.onError?.('Failed to start voice recognition. Please check microphone permissions.');
    }
  }

  async stopListening() {
    try {
      if (!this.isListening && !this.isPersistentMode) return;
      
      // Stop persistent mode
      this.isPersistentMode = false;
      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = null;
      }
      
      // Choose appropriate voice service based on platform
      const currentVoiceService = Platform.OS === 'web' ? webVoiceService : voiceService;
      await currentVoiceService.stopListening();
      
      this.isListening = false;
      console.log('🎤 Voice navigation stopped');
      
      // Haptic feedback (only on mobile)
      if (Platform.OS !== 'web') {
        Vibration.vibrate(50);
      }
    } catch (error) {
      console.error('🎤 Error stopping voice navigation:', error);
    }
  }

  togglePersistentMode() {
    if (this.isPersistentMode) {
      this.stopListening();
    } else {
      this.startListening('en-US', true);
    }
  }

  isPersistent(): boolean {
    return this.isPersistentMode;
  }

  private async processVoiceCommand(transcript: string) {
    const normalizedTranscript = transcript.toLowerCase().trim();
    console.log('🎤 Processing voice command:', normalizedTranscript);

    // First try to find exact command match
    const matchedCommand = this.commands.find(command =>
      command.phrases.some(phrase => 
        normalizedTranscript.includes(phrase.toLowerCase())
      )
    );

    if (matchedCommand) {
      console.log('✅ Voice command recognized:', matchedCommand.action);
      this.callbacks.onCommandRecognized?.(matchedCommand.description);
      this.executeCommand(matchedCommand.action);
      
      // Haptic feedback for successful command (only on mobile)
      if (Platform.OS !== 'web') {
        Vibration.vibrate([50, 100, 50]);
      }
    } else {
      // If no exact match, use AI to analyze the command
      console.log('🤖 Using AI to analyze voice command:', normalizedTranscript);
      try {
        const intent = await aiService.analyzeVoiceCommand(normalizedTranscript);
        
        if (intent && intent.confidence > 0.6) {
          console.log('✅ AI recognized navigation intent:', intent);
          this.callbacks.onCommandRecognized?.(`AI understood: ${intent.action} to ${intent.screen || 'perform action'}`);
          this.executeAIIntent(intent);
          
          // Haptic feedback for AI-recognized command (only on mobile)
          if (Platform.OS !== 'web') {
            Vibration.vibrate([50, 100, 50]);
          }
        } else {
          console.log('❌ Voice command not recognized by AI either:', normalizedTranscript);
          this.callbacks.onError?.(`Command "${normalizedTranscript}" not recognized. Try saying "help" for available commands.`);
          
          // Different haptic pattern for unrecognized command (only on mobile)
          if (Platform.OS !== 'web') {
            Vibration.vibrate([100, 50, 100]);
          }
        }
      } catch (error) {
        console.error('🤖 AI command analysis failed:', error);
        this.callbacks.onError?.(`Command "${normalizedTranscript}" not recognized`);
        
        if (Platform.OS !== 'web') {
          Vibration.vibrate([100, 50, 100]);
        }
      }
    }
  }

  private executeAIIntent(intent: NavigationIntent) {
    if (!this.navigation) {
      console.error('❌ Navigation not set');
      return;
    }

    this.callbacks.onNavigationTriggered?.(intent.action);

    if (intent.action === 'navigate' && intent.screen) {
      switch (intent.screen) {
        case 'Home':
          this.navigation.navigate('Main', { screen: 'Home' });
          break;
        case 'Appointments':
          this.navigation.navigate('Main', { screen: 'Appointments' });
          break;
        case 'CreateAppointment':
          this.navigation.navigate('CreateAppointment');
          break;
        case 'Profile':
          this.navigation.navigate('Main', { screen: 'Profile' });
          break;
        case 'AI':
          this.navigation.navigate('Main', { screen: 'AI' });
          break;
        case 'MedicineReminders':
          this.navigation.navigate('MedicineReminders');
          break;
        case 'MedicineSchedule':
          this.navigation.navigate('MedicineSchedule');
          break;
        default:
          console.log('❌ Unknown AI navigation screen:', intent.screen);
      }
    }
  }

  private executeCommand(action: string) {
    if (!this.navigation) {
      console.error('❌ Navigation not set');
      return;
    }

    this.callbacks.onNavigationTriggered?.(action);

    switch (action) {
      // Navigation commands
      case 'navigate_home':
        this.navigation.navigate('Main', { screen: 'Home' });
        break;
      
      case 'navigate_appointments':
        this.navigation.navigate('Main', { screen: 'Appointments' });
        break;
      
      case 'navigate_book_appointment':
        this.navigation.navigate('CreateAppointment');
        break;
      
      case 'navigate_profile':
        this.navigation.navigate('Main', { screen: 'Profile' });
        break;
      
      case 'navigate_ai':
        this.navigation.navigate('Main', { screen: 'AI' });
        break;
      
      // Medicine reminder commands
      case 'navigate_medicine_reminders':
        this.navigation.navigate('MedicineReminders');
        break;
      
      case 'view_medicine_schedule':
        this.navigation.navigate('MedicineSchedule');
        break;
      
      case 'mark_medicine_taken':
        this.handleMedicineTaken();
        break;
      
      case 'skip_medicine':
        this.handleMedicineSkipped();
        break;
      
      case 'check_medicine_time':
        this.checkMedicineTime();
        break;
      
      // Health and emergency commands
      case 'emergency_contact':
        this.handleEmergencyContact();
        break;
      
      case 'health_check':
        this.navigation.navigate('HealthCheck');
        break;
      
      case 'contact_family':
        this.handleFamilyContact();
        break;
      
      // Action commands
      case 'go_back':
        if (this.navigation.canGoBack()) {
          this.navigation.goBack();
        }
        break;
      
      case 'refresh':
        console.log('🔄 Refresh command triggered');
        break;
      
      case 'logout':
        console.log('🚪 Logout command triggered');
        break;
      
      case 'show_help':
        this.showVoiceCommands();
        break;
      
      case 'stop_listening':
        this.stopListening();
        break;
      
      // Time and date commands
      case 'tell_time':
        this.tellCurrentTime();
        break;
      
      case 'tell_date':
        this.tellCurrentDate();
        break;
      
      default:
        console.log('❌ Unknown action:', action);
    }
  }

  // Medicine reminder helper methods
  private handleMedicineTaken() {
    console.log('💊 Medicine marked as taken');
    this.callbacks.onCommandRecognized?.('Medicine marked as taken. Good job!');
    // This will be handled by the medicine service
  }

  private handleMedicineSkipped() {
    console.log('💊 Medicine skipped');
    this.callbacks.onCommandRecognized?.('Medicine skipped. Please consult your doctor if you skip medicines frequently.');
    // This will be handled by the medicine service
  }

  private checkMedicineTime() {
    console.log('💊 Checking medicine time');
    this.callbacks.onCommandRecognized?.('Checking your medicine schedule...');
    // This will be handled by the medicine service
  }

  // Emergency and family contact methods
  private handleEmergencyContact() {
    console.log('🚨 Emergency contact triggered');
    this.callbacks.onCommandRecognized?.('Contacting emergency services...');
    // This will trigger emergency contact functionality
  }

  private handleFamilyContact() {
    console.log('👨‍👩‍👧‍👦 Family contact triggered');
    this.callbacks.onCommandRecognized?.('Contacting your family...');
    // This will trigger family contact functionality
  }

  // Time and date helper methods with voice announcements
  private async tellCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(this.userLanguage, { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    const message = `The current time is ${timeString}`;
    console.log('🕐 Current time:', timeString);
    this.callbacks.onCommandRecognized?.(message);
    
    // Voice announcement
    try {
      await textToSpeechService.speak(message, {
        language: this.userLanguage,
        rate: 0.8,
        volume: 1.0
      });
    } catch (error) {
      console.error('🔊 Failed to announce time:', error);
    }
  }

  private async tellCurrentDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString(this.userLanguage, { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const message = `Today is ${dateString}`;
    console.log('📅 Current date:', dateString);
    this.callbacks.onCommandRecognized?.(message);
    
    // Voice announcement
    try {
      await textToSpeechService.speak(message, {
        language: this.userLanguage,
        rate: 0.8,
        volume: 1.0
      });
    } catch (error) {
      console.error('🔊 Failed to announce date:', error);
    }
  }

  private showVoiceCommands() {
    const commandList = this.commands
      .map(cmd => `• "${cmd.phrases[0]}" - ${cmd.description}`)
      .join('\n');
    
    console.log('🎤 Available voice commands:\n' + commandList);
    this.callbacks.onCommandRecognized?.('Showing available commands');
  }

  getAvailableCommands(): VoiceCommand[] {
    return this.commands;
  }

  isCurrentlyListening(): boolean {
    return this.isListening;
  }
}

export const voiceNavigationService = new VoiceNavigationService();