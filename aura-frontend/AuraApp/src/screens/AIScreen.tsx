import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { voiceService, VoiceRecognitionResult } from '../services/voice';
import { aiService, SmartResponse, NavigationIntent } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { VoiceNavigator } from '../components/VoiceNavigator';

interface AIScreenProps {
  navigation: any;
}

export const AIScreen: React.FC<AIScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    text: string;
    timestamp: Date;
    intent?: NavigationIntent;
  }>>([]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setConversationHistory(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Use the new AI service with navigation capabilities
      const response: SmartResponse = await aiService.sendMessage(inputText.trim(), true, conversationId);

      // Update conversation ID if provided
      if (response.conversationId && response.conversationId !== conversationId) {
        setConversationId(response.conversationId);
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        text: response.text,
        timestamp: new Date(),
        intent: response.intent,
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      setSuggestions(response.suggestions || []);

      // Handle navigation intent
      if (response.intent && response.intent.confidence > 0.7) {
        handleNavigationIntent(response.intent);
      }

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to get AI response');
      console.error('AI response error:', error);
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleNavigationIntent = (intent: NavigationIntent) => {
    if (intent.action === 'navigate' && intent.screen) {
      Alert.alert(
        'Navigate to ' + intent.screen,
        'Would you like me to take you there?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Go',
            onPress: () => {
              try {
                if (intent.screen === 'Home') {
                  navigation.navigate('Main', { screen: 'Home' });
                } else if (intent.screen === 'CreateAppointment') {
                  navigation.navigate('CreateAppointment');
                } else {
                  navigation.navigate('Main', { screen: intent.screen });
                }
              } catch (error) {
                console.error('Navigation error:', error);
                Alert.alert('Error', 'Could not navigate to that screen');
              }
            }
          }
        ]
      );
    }
  };

  const handleVoiceInput = async () => {
    try {
      if (isListening) {
        await voiceService.stopListening();
        setIsListening(false);
      } else {
        await voiceService.startListening(user?.preferredLanguage || 'en-US', {
          onStart: () => {
            setIsListening(true);
          },
          onResult: async (result: VoiceRecognitionResult) => {
            setInputText(result.transcript);
            setIsListening(false);
            
            // Analyze voice command for immediate navigation
            try {
              const intent = await aiService.analyzeVoiceCommand(result.transcript);
              if (intent && intent.confidence > 0.8) {
                handleNavigationIntent(intent);
              }
            } catch (error) {
              console.error('Voice command analysis error:', error);
            }
          },
          onEnd: () => {
            setIsListening(false);
          },
          onError: (error) => {
            setIsListening(false);
            console.error('Voice recognition error:', error);
            Alert.alert('Voice Error', 'Failed to recognize speech');
          },
        });
      }
    } catch (error) {
      console.error('Error with voice input:', error);
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const handleSummarizeTranscript = async () => {
    if (conversationHistory.length === 0) {
      Alert.alert('Error', 'No conversation to summarize');
      return;
    }

    try {
      setIsLoading(true);
      
      // Get health insights instead of simple summary
      const healthInsight = await aiService.getHealthSummary();
      
      const summaryText = `${healthInsight.summary}\n\nRecommendations:\n${healthInsight.recommendations.join('\n• ')}`;
      
      Alert.alert(
        'Health Summary',
        summaryText,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to get health summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSymptomAnalysis = () => {
    Alert.prompt(
      'Symptom Analysis',
      'Describe your symptoms (separate multiple symptoms with commas):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Analyze',
          onPress: (symptoms?: string) => {
            if (symptoms && symptoms.trim()) {
              analyzeSymptoms(symptoms.trim());
            }
          }
        }
      ],
      'plain-text',
      '',
      'default'
    );
  };

  const analyzeSymptoms = async (symptomsText: string) => {
    try {
      setIsLoading(true);
      
      const symptoms = symptomsText.split(',').map(s => s.trim()).filter(s => s.length > 0);
      const analysis = await aiService.analyzeSymptoms(symptoms, 'recent', 'moderate');
      
      let alertTitle = 'Symptom Analysis';
      if (analysis.emergencyWarning) {
        alertTitle = '🚨 Emergency Warning';
      } else if (analysis.urgencyLevel === 'high') {
        alertTitle = '⚠️ High Priority';
      }
      
      const analysisText = `${analysis.analysis}\n\nRecommendations:\n• ${analysis.recommendations.join('\n• ')}`;
      
      Alert.alert(
        alertTitle,
        analysisText,
        analysis.shouldSeeDoctor 
          ? [
              { text: 'OK', style: 'default' },
              { 
                text: 'Book Appointment', 
                onPress: () => navigation.navigate('CreateAppointment'),
                style: 'default'
              }
            ]
          : [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to analyze symptoms');
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear the conversation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              if (conversationId) {
                await aiService.clearConversation(conversationId);
              }
              setConversationHistory([]);
              setSuggestions([]);
              setConversationId('');
              aiService.clearHistory();
            } catch (error) {
              console.error('Failed to clear conversation:', error);
              // Still clear local state even if backend fails
              setConversationHistory([]);
              setSuggestions([]);
              setConversationId('');
            }
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <View style={styles.headerActions}>
          {conversationHistory.length > 0 && (
            <TouchableOpacity
              style={styles.summaryButton}
              onPress={handleSummarizeTranscript}
              disabled={isLoading}
            >
              <Text style={styles.summaryButtonText}>📊</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.symptomButton}
            onPress={handleSymptomAnalysis}
            disabled={isLoading}
          >
            <Text style={styles.symptomButtonText}>🩺</Text>
          </TouchableOpacity>
          {conversationHistory.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearConversation}
            >
              <Text style={styles.clearButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.conversationContainer} 
        contentContainerStyle={styles.conversationContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {conversationHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🤖</Text>
            <Text style={styles.emptyStateTitle}>AI Health Assistant</Text>
            <Text style={styles.emptyStateSubtitle}>
              Ask me anything about your health, symptoms, or medical questions.
              I'm here to help!
            </Text>
            <View style={styles.suggestedQuestions}>
              <Text style={styles.suggestedTitle}>Try asking:</Text>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => setInputText('What are the symptoms of a common cold?')}
              >
                <Text style={styles.suggestionText}>What are the symptoms of a common cold?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => setInputText('How can I improve my sleep quality?')}
              >
                <Text style={styles.suggestionText}>How can I improve my sleep quality?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => setInputText('What should I do for a headache?')}
              >
                <Text style={styles.suggestionText}>What should I do for a headache?</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          conversationHistory.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageCard,
                message.type === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
              <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            </View>
          ))
        )}
        
        {isLoading && (
          <View style={styles.loadingMessage}>
            <Text style={styles.loadingText}>AI is thinking...</Text>
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions:</Text>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setInputText(suggestion)}
              >
                <Text style={styles.suggestionChipText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything about your health..."
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
            onPress={handleVoiceInput}
            disabled={isLoading}
          >
            <Text style={styles.voiceIcon}>
              {isListening ? '🔴' : '🎤'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>
            {isLoading ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
      </View>
      
      {/* Voice & Gesture Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 AI screen command executed:', command);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerActions: {
    flexDirection: 'row',
  },
  summaryButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  summaryButtonText: {
    fontSize: 16,
  },
  symptomButton: {
    backgroundColor: '#e67e22',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  symptomButtonText: {
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 16,
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  conversationContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra space for voice button
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  suggestedQuestions: {
    width: '100%',
  },
  suggestedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  suggestionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  suggestionText: {
    fontSize: 14,
    color: '#3498db',
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  loadingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecf0f1',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  voiceButton: {
    backgroundColor: '#3498db',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#e74c3c',
  },
  voiceIcon: {
    fontSize: 20,
  },
  sendButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  suggestionChip: {
    backgroundColor: '#e8f4fd',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  suggestionChipText: {
    fontSize: 13,
    color: '#3498db',
    fontWeight: '500',
  },
});