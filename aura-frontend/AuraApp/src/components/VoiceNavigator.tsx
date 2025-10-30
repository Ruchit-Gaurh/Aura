import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { voiceNavigationService } from '../services/voiceNavigation';

interface VoiceNavigatorProps {
  enabled?: boolean;
  showIndicator?: boolean;
  onCommandExecuted?: (command: string) => void;
}

export const VoiceNavigator: React.FC<VoiceNavigatorProps> = ({
  enabled = true,
  showIndicator = true,
  onCommandExecuted,
}) => {
  const navigation = useNavigation();
  const [isListening, setIsListening] = useState(false);
  const [isPersistent, setIsPersistent] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) return;

    // Set up navigation references
    voiceNavigationService.setNavigation(navigation as any);

    // Set up voice navigation callbacks
    voiceNavigationService.setCallbacks({
      onCommandRecognized: (command) => {
        setLastCommand(command);
        showFeedbackMessage(command);
        onCommandExecuted?.(command);
      },
      onNavigationTriggered: (action) => {
        console.log('🎯 Navigation triggered:', action);
        if (action === 'voice_activation') {
          toggleVoiceListening();
        }
      },
      onError: (error) => {
        showFeedbackMessage(`Error: ${error}`, true);
      },
    });

    return () => {
      voiceNavigationService.stopListening();
    };
  }, [enabled, navigation]);

  // Pulse animation for voice indicator
  useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isListening]);

  const toggleVoiceListening = async () => {
    try {
      if (isPersistent) {
        // Stop persistent mode
        await voiceNavigationService.stopListening();
        setIsListening(false);
        setIsPersistent(false);
        showFeedbackMessage('Voice stopped');
      } else {
        // Start persistent mode
        await voiceNavigationService.startListening('en-US', true);
        setIsListening(true);
        setIsPersistent(true);
        showFeedbackMessage('Voice activated (persistent) - always listening');
      }
    } catch (error) {
      console.error('Voice navigation error:', error);
      setIsListening(false);
      setIsPersistent(false);
      showFeedbackMessage('Voice activation failed', true);
    }
  };



  // Sync state with voice service periodically
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const serviceListening = voiceNavigationService.isCurrentlyListening();
      const servicePersistent = voiceNavigationService.isPersistent();
      
      if (serviceListening !== isListening) {
        console.log('🔄 Syncing voice state:', serviceListening);
        setIsListening(serviceListening);
      }
      
      if (servicePersistent !== isPersistent) {
        console.log('🔄 Syncing persistent state:', servicePersistent);
        setIsPersistent(servicePersistent);
      }
    }, 1000);

    return () => clearInterval(syncInterval);
  }, [isListening, isPersistent]);

  const showFeedbackMessage = (message: string, isError: boolean = false) => {
    setLastCommand(message);
    setShowFeedback(true);

    // Animate feedback
    Animated.sequence([
      Animated.timing(feedbackAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(feedbackAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowFeedback(false);
    });
  };

  const showVoiceCommands = () => {
    const commands = voiceNavigationService.getAvailableCommands();
    const commandList = commands
      .slice(0, 10) // Show first 10 commands
      .map(cmd => `• "${cmd.phrases[0]}"`)
      .join('\n');

    const webNote = Platform.OS === 'web' 
      ? '\n\n🌐 Web Note: Allow microphone access when prompted for voice commands to work.'
      : '';

    Alert.alert(
      '🎤 Smart Voice Commands',
      `Available commands:\n\n${commandList}\n\n💊 Medicine Reminders:\n• "Set medicine reminder"\n• "Check my medicines"\n• "Medicine schedule"${webNote}`,
      [{ text: 'Got it!' }]
    );
  };

  if (!enabled || !showIndicator) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Voice activation button */}
      <TouchableOpacity
        style={[
          styles.voiceButton, 
          isListening && styles.voiceButtonActive,
          isPersistent && styles.voiceButtonPersistent
        ]}
        onPress={toggleVoiceListening}
        onLongPress={showVoiceCommands}
      >
        <Animated.View style={[styles.voiceIcon, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.voiceEmoji}>
            {isPersistent ? '🟢' : isListening ? '🔴' : '🎤'}
          </Text>
        </Animated.View>
      </TouchableOpacity>



      {/* Feedback message */}
      {showFeedback && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              opacity: feedbackAnim,
              transform: [
                {
                  translateY: feedbackAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.feedbackText}>{lastCommand}</Text>
        </Animated.View>
      )}

      {/* Voice hint */}
      <View style={styles.voiceHint}>
        <Text style={styles.hintText}>
          {isPersistent ? '🟢 Always listening' : 
           isListening ? '🎤 Listening...' : 
           '🎤 Tap for voice'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  voiceButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  voiceButtonActive: {
    backgroundColor: '#e74c3c',
  },
  voiceButtonPersistent: {
    backgroundColor: '#27ae60',
  },
  voiceIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceEmoji: {
    fontSize: 28,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 75,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: 220,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  voiceHint: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
  },
  hintText: {
    fontSize: 10,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
});