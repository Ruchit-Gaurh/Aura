import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Vibration,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { webSocketService } from '../services/websocket';
import { voiceService, VoiceRecognitionResult } from '../services/voice';
import { Appointment, WebSocketMessage } from '../types';

interface VoiceCallScreenProps {
  navigation: any;
  route: {
    params: {
      appointmentId: string;
    };
  };
}

export const VoiceCallScreen: React.FC<VoiceCallScreenProps> = ({ navigation, route }) => {
  const { appointmentId } = route.params;
  const { user } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedMessages, setTranslatedMessages] = useState<Array<{
    id: string;
    originalText: string;
    translatedText: string;
    senderId: string;
    timestamp: Date;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadAppointment();
    initializeWebSocket();
    
    return () => {
      cleanup();
    };
  }, []);

  const loadAppointment = async () => {
    try {
      const appointments = await apiService.getAppointments();
      const currentAppointment = appointments.find(apt => apt._id === appointmentId);
      
      if (currentAppointment) {
        setAppointment(currentAppointment);
      } else {
        Alert.alert('Error', 'Appointment not found');
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load appointment details');
      console.error('Error loading appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeWebSocket = async () => {
    try {
      await webSocketService.connect();
      
      // Join the appointment room
      webSocketService.joinRoom(
        `appointment_${appointmentId}`,
        user?._id || 'unknown',
        user?.preferredLanguage || 'en-US'
      );

      // Set up message handlers
      webSocketService.onMessage('joined_room', handleJoinedRoom);
      webSocketService.onMessage('translated_message', handleTranslatedMessage);
      
      setIsConnected(true);
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      Alert.alert('Connection Error', 'Failed to connect to translation service');
    }
  };

  const handleJoinedRoom = (message: WebSocketMessage) => {
    console.log('Joined room:', message);
    Vibration.vibrate(100); // Haptic feedback
  };

  const handleTranslatedMessage = (message: WebSocketMessage) => {
    if (message.originalText && message.translatedText && message.senderId) {
      const newMessage = {
        id: Date.now().toString(),
        originalText: message.originalText,
        translatedText: message.translatedText,
        senderId: message.senderId,
        timestamp: new Date(),
      };
      
      setTranslatedMessages(prev => [...prev, newMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Haptic feedback for new message
      Vibration.vibrate(50);
    }
  };

  const startListening = async () => {
    try {
      await voiceService.startListening(user?.preferredLanguage || 'en-US', {
        onStart: () => {
          setIsListening(true);
          Vibration.vibrate(100);
        },
        onResult: handleVoiceResult,
        onEnd: () => {
          setIsListening(false);
          Vibration.vibrate(100);
        },
        onError: (error) => {
          setIsListening(false);
          console.error('Voice recognition error:', error);
          Alert.alert('Voice Error', 'Failed to recognize speech');
        },
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await voiceService.stopListening();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const handleVoiceResult = (result: VoiceRecognitionResult) => {
    const newTranscript = transcript + ' ' + result.transcript;
    setTranscript(newTranscript);
    
    // Send the recognized text for translation
    if (result.transcript.trim()) {
      webSocketService.sendTextMessage(
        `appointment_${appointmentId}`,
        user?._id || 'unknown',
        result.transcript,
        user?.preferredLanguage || 'en-US'
      );
    }
  };

  const endCall = async () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end this call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update appointment with transcript
              if (transcript.trim()) {
                await apiService.updateAppointment(appointmentId, {
                  status: 'Completed',
                  transcript: transcript.trim(),
                });
              }
              
              cleanup();
              navigation.goBack();
            } catch (error) {
              console.error('Error ending call:', error);
              cleanup();
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const cleanup = () => {
    voiceService.stopListening().catch(console.error);
    webSocketService.disconnect();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading appointment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.appointmentInfo}>
          <Text style={styles.doctorName}>{appointment?.doctorName}</Text>
          <Text style={styles.connectionStatus}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </Text>
        </View>
        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <Text style={styles.endCallText}>End Call</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {translatedMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageCard,
              message.senderId === user?._id ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.originalText}>{message.originalText}</Text>
            <Text style={styles.translatedText}>{message.translatedText}</Text>
            <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
          </View>
        ))}
        
        {translatedMessages.length === 0 && (
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyMessagesText}>
              Start speaking to see real-time translations
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.controls}>
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptLabel}>Live Transcript:</Text>
          <Text style={styles.transcriptText}>
            {transcript || 'Start speaking...'}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonActive,
          ]}
          onPress={isListening ? stopListening : startListening}
          onLongPress={startListening}
        >
          <Text style={styles.micIcon}>
            {isListening ? '🔴' : '🎤'}
          </Text>
          <Text style={styles.micText}>
            {isListening ? 'Listening...' : 'Tap to Speak'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  connectionStatus: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  endCallButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  endCallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messagesContent: {
    paddingVertical: 20,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  originalText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
  translatedText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'right',
  },
  emptyMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyMessagesText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  controls: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  transcriptContainer: {
    marginBottom: 20,
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 16,
    color: '#34495e',
    minHeight: 24,
    fontStyle: 'italic',
  },
  micButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
  },
  micIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  micText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});