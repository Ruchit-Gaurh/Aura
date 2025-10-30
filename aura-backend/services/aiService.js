// AI Service for Futurix AI Integration (Shivaay API)

const AI_CONFIG = {
  API_URL: process.env.SHIVAAY_API_URL || 'https://api.futurixai.com/api/shivaay/v1/chat/completions',
  API_KEY: process.env.SHIVAAY_API_KEY || '6903de523bb9326d46566618',
  MODEL: 'shivaay',
  DEFAULT_TEMPERATURE: 0.7,
  MAX_TOKENS: 512
};

class AIService {
  async sendMessage(messages, includeNavigation = false) {
    const systemPrompt = this.buildHealthcareSystemPrompt(includeNavigation);
    
    const requestBody = {
      model: AI_CONFIG.MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: AI_CONFIG.DEFAULT_TEMPERATURE,
      max_tokens: AI_CONFIG.MAX_TOKENS,
      stream: false
    };

    console.log('Sending request to Shivaay API:', {
      url: AI_CONFIG.API_URL,
      model: requestBody.model,
      messageCount: requestBody.messages.length
    });

    try {
      const response = await fetch(AI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Shivaay API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Shivaay API error response:', errorText);
        
        // If API is not accessible, use fallback
        if (response.status === 403 || response.status === 401) {
          console.log('API access denied, using fallback response');
          return this.getFallbackResponse(messages[messages.length - 1]?.content, includeNavigation);
        }
        
        throw new Error(`AI API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Shivaay API success:', result.choices?.[0]?.message?.content?.substring(0, 100) + '...');
      
      return result;
    } catch (error) {
      console.error('Shivaay API request failed:', error);
      
      // If network error or other issues, use fallback
      if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Load failed')) {
        console.log('Network error, using fallback response');
        return this.getFallbackResponse(messages[messages.length - 1]?.content, includeNavigation);
      }
      
      throw error;
    }
  }

  getFallbackResponse(userMessage, includeNavigation = false) {
    const lowerMessage = (userMessage || '').toLowerCase();
    let response = '';
    let intent = null;

    // Generate contextual responses based on user message
    if (lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
      response = "For headache relief, try resting in a quiet, dark room. Stay hydrated and consider over-the-counter pain relievers if appropriate. If headaches persist or worsen, please consult your healthcare provider.";
      if (includeNavigation) {
        intent = { action: "navigate", screen: "MedicineReminders", confidence: 0.8 };
      }
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
      response = "I can help you manage your appointments. You can book new appointments, view existing ones, or get reminders about upcoming visits.";
      if (includeNavigation) {
        intent = { action: "navigate", screen: "CreateAppointment", confidence: 0.9 };
      }
    } else if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
      response = "I can help you manage your medications. You can set up reminders, track when you take your medicines, and monitor your adherence.";
      if (includeNavigation) {
        intent = { action: "navigate", screen: "MedicineReminders", confidence: 0.9 };
      }
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      response = "In case of emergency, you can quickly contact your emergency contacts or call emergency services. Make sure your emergency contacts are up to date.";
      if (includeNavigation) {
        intent = { action: "navigate", screen: "EmergencyContacts", confidence: 0.8 };
      }
    } else if (lowerMessage.includes('health') || lowerMessage.includes('feeling')) {
      response = "I'm here to help with your health management. You can track your daily health, manage medications, schedule appointments, and get health insights.";
      if (includeNavigation) {
        intent = { action: "navigate", screen: "HealthChecks", confidence: 0.7 };
      }
    } else {
      response = "Hello! I'm Shivaay, your healthcare assistant. I can help you manage medications, schedule appointments, track your health, and provide general health guidance. How can I assist you today?";
    }

    // Add navigation intent to response if needed
    if (intent && includeNavigation) {
      response += ` [INTENT:${JSON.stringify(intent)}]`;
    }

    return {
      choices: [{
        message: {
          content: response,
          role: 'assistant'
        }
      }],
      model: 'shivaay-fallback',
      usage: { total_tokens: 0 }
    };
  }

  buildHealthcareSystemPrompt(includeNavigation) {
    let prompt = `You are Shivaay, an intelligent AI assistant for a healthcare mobile app called Aura. You help elderly users with:

1. Health-related questions and advice
2. Medicine reminders and scheduling
3. Appointment booking and management
4. General wellness guidance
5. App navigation and features

Guidelines:
- Provide helpful, accurate health information
- Always recommend consulting healthcare professionals for serious concerns
- Be empathetic and supportive
- Keep responses concise but informative
- Use simple, clear language suitable for elderly users
- Never provide specific medical diagnoses or replace professional medical advice`;

    if (includeNavigation) {
      prompt += `

NAVIGATION CAPABILITIES:
Available screens: Home, Appointments, CreateAppointment, MedicineReminders, Profile, AI, HealthChecks, EmergencyContacts

When users want to navigate or perform actions, include intent in this exact format:
[INTENT:{"action":"navigate","screen":"ScreenName","confidence":0.9}]

Examples:
- "book appointment" → [INTENT:{"action":"navigate","screen":"CreateAppointment","confidence":0.9}]
- "medicine reminders" → [INTENT:{"action":"navigate","screen":"MedicineReminders","confidence":0.8}]
- "health check" → [INTENT:{"action":"navigate","screen":"HealthChecks","confidence":0.8}]`;
    }

    return prompt;
  }

  generateSuggestions(userMessage, aiResponse) {
    const suggestions = [];
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
      suggestions.push('Set up medicine reminders', 'When should I see a doctor?', 'Tell me about pain management');
    } else if (lowerMessage.includes('appointment') || lowerMessage.includes('doctor')) {
      suggestions.push('Book an appointment', 'View my appointments', 'Find nearby doctors');
    } else if (lowerMessage.includes('medicine') || lowerMessage.includes('medication')) {
      suggestions.push('Add medicine reminder', 'View medicine schedule', 'Medicine adherence tips');
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      suggestions.push('Emergency contacts', 'Call for help', 'Health emergency tips');
    } else {
      suggestions.push('Set up medicine reminders', 'Book an appointment', 'Health tips for seniors');
    }

    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  async analyzeSymptoms(symptoms, duration, severity) {
    const symptomsText = Array.isArray(symptoms) ? symptoms.join(', ') : symptoms;
    
    const prompt = `Analyze these symptoms for an elderly patient:
Symptoms: ${symptomsText}
Duration: ${duration}
Severity: ${severity}

Provide:
1. General analysis (not a diagnosis)
2. Self-care recommendations
3. When to see a doctor
4. Urgency level (low/medium/high)
5. Emergency warning if needed

Remember: This is general information, not medical diagnosis.`;

    const messages = [{ role: 'user', content: prompt }];
    const response = await this.sendMessage(messages, false);
    
    return response.choices[0].message.content;
  }

  async generateHealthSummary(userData) {
    const { medicineAdherence, recentHealthChecks, recentSymptoms } = userData;
    
    const prompt = `Generate a health summary for an elderly patient based on:
- Medicine adherence: ${medicineAdherence}%
- Recent mood: ${recentHealthChecks?.mood || 'not recorded'}
- Recent energy level: ${recentHealthChecks?.energyLevel || 'not recorded'}/10
- Recent symptoms: ${recentSymptoms?.join(', ') || 'none reported'}

Provide:
1. Overall health summary
2. 3 specific recommendations
3. Trends analysis
4. Encouragement and motivation

Keep it positive and actionable.`;

    const messages = [{ role: 'user', content: prompt }];
    const response = await this.sendMessage(messages, false);
    
    return response.choices[0].message.content;
  }
}

module.exports = AIService;