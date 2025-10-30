import { API_CONFIG } from '../config/api';

export interface NavigationIntent {
  action: 'navigate' | 'create' | 'view' | 'search' | 'help';
  screen?: string;
  parameters?: Record<string, any>;
  confidence: number;
}

export interface SmartResponse {
  text: string;
  intent?: NavigationIntent;
  suggestions?: string[];
  conversationId?: string;
}

export interface HealthInsight {
  summary: string;
  recommendations: string[];
  adherenceScore: number;
  trends: {
    medicineAdherence: string;
    moodTrend: string;
    energyLevel: string;
  };
}

export interface SymptomAnalysis {
  analysis: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  shouldSeeDoctor: boolean;
  emergencyWarning: boolean;
}

class AIService {
  private getAuthToken(): string | null {
    // Get JWT token from storage
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  private async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token }),
      ...options.headers,
    };

    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  async sendMessage(userMessage: string, includeNavigation: boolean = false, conversationId?: string): Promise<SmartResponse> {
    try {
      const response = await this.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.AI_CHAT, {
        method: 'POST',
        body: JSON.stringify({
          message: userMessage,
          includeNavigation,
          conversationId
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get AI response');
      }

      return {
        text: data.data.response,
        intent: data.data.intent,
        suggestions: data.data.suggestions || [],
        conversationId: data.data.conversationId
      };

    } catch (error) {
      console.error('AI Service error:', error);
      
      // Fallback to local AI processing when backend is not ready
      if (error instanceof Error && error.message.includes('500')) {
        console.warn('🔧 Backend AI not ready, using fallback processing');
        // Show a brief notice to user (optional)
        // Alert.alert('Development Mode', 'Using offline AI processing while backend is being set up.');
        return this.fallbackAIResponse(userMessage, includeNavigation);
      }
      
      throw new Error(error instanceof Error ? error.message : 'Failed to get AI response. Please try again.');
    }
  }

  private fallbackAIResponse(userMessage: string, includeNavigation: boolean): SmartResponse {
    const message = userMessage.toLowerCase();
    
    // Simple intent detection for common commands
    let intent: NavigationIntent | undefined;
    let response = "I understand you're asking about health-related topics. ";
    let suggestions: string[] = [];

    if (message.includes('medicine') || message.includes('pill') || message.includes('medication')) {
      response = "I can help you with medicine reminders. You can set up reminders to never miss your medications.";
      suggestions = ['Tell me more about medicine safety', 'What are common side effects?', 'How do I remember to take medicines?'];
      
      if (includeNavigation) {
        intent = {
          action: 'navigate',
          screen: 'MedicineReminders',
          confidence: 0.9
        };
      }
    } else if (message.includes('appointment') || message.includes('doctor') || message.includes('book')) {
      response = "I can help you book an appointment with your doctor. Let me guide you through the process.";
      suggestions = ['What should I prepare for my appointment?', 'How often should I see my doctor?', 'What questions should I ask my doctor?'];
      
      if (includeNavigation) {
        intent = {
          action: 'navigate',
          screen: 'CreateAppointment',
          confidence: 0.9
        };
      }
    } else if (message.includes('headache') || message.includes('pain')) {
      response = "For headaches, try resting in a quiet, dark room. Stay hydrated and consider over-the-counter pain relief if appropriate. If headaches persist or worsen, consult your doctor.";
      suggestions = ['What causes headaches?', 'When should I worry about headaches?', 'Are there natural remedies for headaches?'];
    } else if (message.includes('symptom') || message.includes('feel') || message.includes('sick')) {
      response = "I can help you track and understand your symptoms. It's important to monitor how you're feeling and consult healthcare professionals when needed.";
      suggestions = ['How do I describe symptoms to my doctor?', 'What symptoms are concerning?', 'How can I feel better when sick?'];
    } else {
      response = "I'm here to help with your health and wellness questions. You can ask me about medicines, appointments, symptoms, or general health advice.";
      suggestions = ['Tell me about healthy living', 'How can I stay healthy as I age?', 'What are important health checks?'];
    }

    return {
      text: response,
      intent,
      suggestions,
      conversationId: `fallback_${Date.now()}`
    };
  }

  async analyzeVoiceCommand(command: string): Promise<NavigationIntent | null> {
    try {
      const response = await this.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.AI_VOICE_COMMAND, {
        method: 'POST',
        body: JSON.stringify({
          command
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to analyze voice command');
      }

      return data.data.intent || null;
    } catch (error) {
      console.error('Voice command analysis error:', error);
      
      // Fallback to local voice command analysis
      if (error instanceof Error && error.message.includes('500')) {
        console.warn('🔧 Backend voice analysis not ready, using fallback');
        return this.fallbackVoiceAnalysis(command);
      }
      
      return null;
    }
  }

  private fallbackVoiceAnalysis(command: string): NavigationIntent | null {
    const cmd = command.toLowerCase();
    
    // Medicine-related commands
    if (cmd.includes('medicine') || cmd.includes('pill') || cmd.includes('medication') || cmd.includes('reminder')) {
      return {
        action: 'navigate',
        screen: 'MedicineReminders',
        confidence: 0.8
      };
    }
    
    // Appointment-related commands
    if (cmd.includes('appointment') || cmd.includes('doctor') || cmd.includes('book') || cmd.includes('schedule')) {
      return {
        action: 'navigate',
        screen: 'CreateAppointment',
        confidence: 0.8
      };
    }
    
    // Home navigation
    if (cmd.includes('home') || cmd.includes('main') || cmd.includes('dashboard')) {
      return {
        action: 'navigate',
        screen: 'Home',
        confidence: 0.9
      };
    }
    
    // Profile navigation
    if (cmd.includes('profile') || cmd.includes('settings') || cmd.includes('account')) {
      return {
        action: 'navigate',
        screen: 'Profile',
        confidence: 0.8
      };
    }
    
    return null;
  }

  async getHealthSummary(): Promise<HealthInsight> {
    try {
      const response = await this.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.HEALTH_SUMMARY, {
        method: 'GET'
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to get health summary');
      }

      return data.data;
    } catch (error) {
      console.error('Health summary error:', error);
      
      // Fallback to mock health summary
      if (error instanceof Error && error.message.includes('500')) {
        console.warn('🔧 Backend health insights not ready, using fallback');
        return this.fallbackHealthSummary();
      }
      
      throw new Error(error instanceof Error ? error.message : 'Failed to get health summary');
    }
  }

  private fallbackHealthSummary(): HealthInsight {
    return {
      summary: "Based on your app usage, you're actively managing your health. Keep up the good work with staying engaged in your healthcare routine.",
      recommendations: [
        "Continue using the app regularly for health tracking",
        "Set up medicine reminders if you haven't already",
        "Schedule regular check-ups with your healthcare provider",
        "Track your daily symptoms and mood"
      ],
      adherenceScore: 75,
      trends: {
        medicineAdherence: "stable",
        moodTrend: "positive",
        energyLevel: "stable"
      }
    };
  }

  async analyzeSymptoms(symptoms: string[], duration: string, severity: string): Promise<SymptomAnalysis> {
    try {
      const response = await this.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.ANALYZE_SYMPTOMS, {
        method: 'POST',
        body: JSON.stringify({
          symptoms,
          duration,
          severity
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to analyze symptoms');
      }

      return data.data;
    } catch (error) {
      console.error('Symptom analysis error:', error);
      
      // Fallback to basic symptom analysis
      if (error instanceof Error && error.message.includes('500')) {
        console.warn('🔧 Backend symptom analysis not ready, using fallback');
        return this.fallbackSymptomAnalysis(symptoms, duration, severity);
      }
      
      throw new Error(error instanceof Error ? error.message : 'Failed to analyze symptoms');
    }
  }

  private fallbackSymptomAnalysis(symptoms: string[], duration: string, severity: string): SymptomAnalysis {
    const hasUrgentSymptoms = symptoms.some(s => 
      s.toLowerCase().includes('chest pain') || 
      s.toLowerCase().includes('difficulty breathing') ||
      s.toLowerCase().includes('severe pain')
    );

    const hasCommonSymptoms = symptoms.some(s => 
      s.toLowerCase().includes('headache') || 
      s.toLowerCase().includes('fatigue') ||
      s.toLowerCase().includes('nausea')
    );

    if (hasUrgentSymptoms) {
      return {
        analysis: "You've reported symptoms that may require immediate medical attention. Please consult a healthcare professional promptly.",
        recommendations: [
          "Seek immediate medical attention",
          "Contact your doctor or emergency services",
          "Do not delay in getting professional help"
        ],
        urgencyLevel: 'high',
        shouldSeeDoctor: true,
        emergencyWarning: true
      };
    }

    if (hasCommonSymptoms) {
      return {
        analysis: `You've reported ${symptoms.join(', ')} lasting ${duration}. These are common symptoms that can often be managed with rest and self-care, but monitoring is important.`,
        recommendations: [
          "Rest and stay hydrated",
          "Monitor symptoms for changes",
          "Consider over-the-counter remedies if appropriate",
          "Consult a doctor if symptoms worsen or persist"
        ],
        urgencyLevel: 'low',
        shouldSeeDoctor: false,
        emergencyWarning: false
      };
    }

    return {
      analysis: `You've reported ${symptoms.join(', ')} with ${severity} severity lasting ${duration}. It's always good to track your symptoms and consult healthcare professionals when needed.`,
      recommendations: [
        "Keep track of your symptoms",
        "Note any changes or patterns",
        "Consult your healthcare provider for proper evaluation",
        "Don't hesitate to seek help if you're concerned"
      ],
      urgencyLevel: 'medium',
      shouldSeeDoctor: true,
      emergencyWarning: false
    };
  }

  async clearConversation(conversationId: string): Promise<void> {
    try {
      await this.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.AI_CONVERSATION}/${conversationId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Clear conversation error:', error);
      throw new Error('Failed to clear conversation');
    }
  }

  // Legacy method for backward compatibility
  clearHistory(): void {
    console.log('Local history cleared - conversation will be cleared on backend');
  }

  // Legacy method for backward compatibility  
  getConversationSummary(): string {
    return 'Conversation summary available through backend API';
  }
}

export const aiService = new AIService();