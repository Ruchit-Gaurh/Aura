import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { apiService } from '../services/api';
import { Appointment } from '../types';
import { VoiceNavigator } from '../components/VoiceNavigator';

interface AppointmentDetailScreenProps {
  navigation: any;
  route: {
    params: {
      appointmentId: string;
    };
  };
}

export const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { appointmentId } = route.params;
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadAppointment = async () => {
    try {
      setIsLoading(true);
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

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: cancelAppointment,
        },
      ]
    );
  };

  const cancelAppointment = async () => {
    try {
      await apiService.updateAppointment(appointmentId, {
        status: 'Cancelled',
      });
      
      Alert.alert(
        'Cancelled',
        'Appointment has been cancelled successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to cancel appointment');
    }
  };

  const navigateToVoiceCall = () => {
    navigation.navigate('VoiceCall', { appointmentId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return '#3498db';
      case 'completed':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return '📅';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📋';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading appointment details...</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Appointment not found</Text>
      </View>
    );
  }

  const isUpcoming = appointment.status === 'Scheduled' && new Date(appointment.appointmentTime) > new Date();
  const isPast = new Date(appointment.appointmentTime) < new Date();

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusIcon}>{getStatusIcon(appointment.status)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
            <Text style={styles.statusText}>{appointment.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.appointmentCard}>
        <Text style={styles.doctorName}>{appointment.doctorName}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(appointment.appointmentTime)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕐</Text>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{formatTime(appointment.appointmentTime)}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📋</Text>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[styles.detailValue, { color: getStatusColor(appointment.status) }]}>
              {appointment.status}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🆔</Text>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Appointment ID</Text>
            <Text style={styles.detailValue}>{appointment._id}</Text>
          </View>
        </View>
      </View>

      {appointment.transcript && (
        <View style={styles.transcriptCard}>
          <Text style={styles.transcriptTitle}>Consultation Notes</Text>
          <ScrollView style={styles.transcriptScroll} nestedScrollEnabled>
            <Text style={styles.transcriptText}>{appointment.transcript}</Text>
          </ScrollView>
        </View>
      )}

      <View style={styles.actions}>
        {isUpcoming && (
          <TouchableOpacity
            style={styles.joinCallButton}
            onPress={navigateToVoiceCall}
          >
            <Text style={styles.joinCallText}>📞 Join Call</Text>
          </TouchableOpacity>
        )}

        {appointment.status === 'Scheduled' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelAppointment}
          >
            <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
          </TouchableOpacity>
        )}

        {appointment.status === 'Completed' && !appointment.transcript && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              This appointment has been completed. Consultation notes will appear here if available.
            </Text>
          </View>
        )}

        {appointment.status === 'Cancelled' && (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              This appointment has been cancelled.
            </Text>
          </View>
        )}
      </View>
      </ScrollView>
      
      {/* Voice Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Appointment detail command executed:', command);
          if (command === 'go_back') {
            navigation.goBack();
          }
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  detailIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  transcriptCard: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transcriptTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  transcriptScroll: {
    maxHeight: 200,
  },
  transcriptText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  joinCallButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#27ae60',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  joinCallText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 22,
  },
});