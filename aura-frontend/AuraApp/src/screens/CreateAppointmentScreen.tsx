import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { apiService } from '../services/api';
import { CreateAppointmentRequest } from '../types';
import { VoiceNavigator } from '../components/VoiceNavigator';

interface CreateAppointmentScreenProps {
  navigation: any;
}

export const CreateAppointmentScreen: React.FC<CreateAppointmentScreenProps> = ({ navigation }) => {
  const [doctorName, setDoctorName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);



  const handleCreateAppointment = async () => {
    if (!doctorName.trim()) {
      Alert.alert('Error', 'Please enter doctor name');
      return;
    }

    // Check if appointment is in the future
    if (appointmentDate <= new Date()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    try {
      setIsLoading(true);
      const appointmentData: CreateAppointmentRequest = {
        doctorName: doctorName.trim(),
        appointmentTime: appointmentDate.toISOString(),
      };

      const newAppointment = await apiService.createAppointment(appointmentData);
      
      console.log('✅ Appointment created successfully:', newAppointment);
      setIsSuccess(true);
      
      // Show success alert
      Alert.alert(
        'Success! 🎉',
        `Appointment with ${doctorName.trim()} has been booked successfully!\n\nDate: ${appointmentDate.toLocaleDateString()}\nTime: ${appointmentDate.toLocaleTimeString()}`,
        [
          {
            text: 'View Appointments',
            onPress: () => {
              navigation.navigate('Main', { screen: 'Appointments' });
            },
          },
          {
            text: 'Back to Home',
            onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ]
      );
      
      // Auto-redirect after 3 seconds if user doesn't interact with alert
      setTimeout(() => {
        if (isSuccess) {
          navigation.goBack();
        }
      }, 3000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create appointment');
    } finally {
      setIsLoading(false);
    }
  };



  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const suggestedDoctors = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Rodriguez',
    'Dr. David Wilson',
    'Dr. Lisa Thompson',
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        bounces={true}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
      <View style={styles.content}>
        {isSuccess && (
          <View style={styles.successBanner}>
            <Text style={styles.successText}>🎉 Appointment Booked Successfully!</Text>
            <Text style={styles.successSubtext}>Redirecting you back...</Text>
          </View>
        )}

        <Text style={styles.title}>Book New Appointment</Text>
        <Text style={styles.subtitle}>Schedule your consultation</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Doctor Name</Text>
            <TextInput
              style={styles.input}
              value={doctorName}
              onChangeText={setDoctorName}
              placeholder="Enter doctor's name"
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

          <View style={styles.suggestedDoctors}>
            <Text style={styles.suggestedLabel}>Suggested Doctors:</Text>
            <View style={styles.doctorChips}>
              {suggestedDoctors.map((doctor) => (
                <TouchableOpacity
                  key={doctor}
                  style={styles.doctorChip}
                  onPress={() => setDoctorName(doctor)}
                  disabled={isLoading}
                >
                  <Text style={styles.doctorChipText}>{doctor}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.label}>Appointment Date & Time</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                style={styles.input}
                value={appointmentDate.toISOString().split('T')[0]}
                onChangeText={(text) => {
                  const newDate = new Date(text + 'T' + appointmentDate.toTimeString().split(' ')[0]);
                  if (!isNaN(newDate.getTime())) {
                    setAppointmentDate(newDate);
                  }
                }}
                placeholder="YYYY-MM-DD"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Time</Text>
              <TextInput
                style={styles.input}
                value={appointmentDate.toTimeString().split(' ')[0].substring(0, 5)}
                onChangeText={(text) => {
                  const [hours, minutes] = text.split(':');
                  if (hours && minutes) {
                    const newDate = new Date(appointmentDate);
                    newDate.setHours(parseInt(hours) || 0);
                    newDate.setMinutes(parseInt(minutes) || 0);
                    setAppointmentDate(newDate);
                  }
                }}
                placeholder="HH:MM"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.appointmentSummary}>
            <Text style={styles.summaryTitle}>Appointment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Doctor:</Text>
              <Text style={styles.summaryValue}>{doctorName || 'Not selected'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{formatDate(appointmentDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{formatTime(appointmentDate)}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.bookButton, 
              (!doctorName.trim() || isLoading) && styles.bookButtonDisabled,
              isSuccess && styles.bookButtonSuccess
            ]}
            onPress={handleCreateAppointment}
            disabled={!doctorName.trim() || isLoading || isSuccess}
          >
            <Text style={styles.bookButtonText}>
              {isSuccess ? '✅ Booked Successfully!' : isLoading ? 'Booking...' : 'Book Appointment'}
            </Text>
          </TouchableOpacity>
        </View>


      </View>
      </ScrollView>
      
      {/* Voice & Gesture Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Create appointment screen command executed:', command);
        }}
      />
    </SafeAreaView>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 150, // Increased space for voice button and safe area
    minHeight: '100%',
  },
  content: {
    padding: 24,
    paddingBottom: 40, // Extra bottom padding for better spacing
  },
  successBanner: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  successSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  suggestedDoctors: {
    marginBottom: 24,
  },
  suggestedLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 12,
  },
  doctorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  doctorChip: {
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  doctorChipText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
  },
  dateTimeContainer: {
    marginBottom: 24,
  },

  appointmentSummary: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  summaryValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  bookButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
    elevation: 0,
  },
  bookButtonSuccess: {
    backgroundColor: '#27ae60',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});