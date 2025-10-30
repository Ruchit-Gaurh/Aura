import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Appointment } from '../types';
import { VoiceNavigator } from '../components/VoiceNavigator';
import { medicineReminderService } from '../services/medicineReminder';
import { voiceNavigationService } from '../services/voiceNavigation';
import { useTranslations } from '../hooks/useTranslations';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const t = useTranslations();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextMedicine, setNextMedicine] = useState<{medicine: any, time: string} | null>(null);

  useEffect(() => {
    loadUpcomingAppointments();
    initializeMedicineReminders();
    initializeVoiceNavigation();
  }, []);

  const initializeVoiceNavigation = () => {
    // Set user language for voice navigation
    voiceNavigationService.setUserLanguage(user?.preferredLanguage || 'en');
  };

  const initializeMedicineReminders = async () => {
    try {
      await medicineReminderService.initialize();
      
      // Set user language provider for medicine reminders
      medicineReminderService.setUserLanguageProvider({
        getUserLanguage: () => user?.preferredLanguage || 'en'
      });
      
      const next = medicineReminderService.getNextReminder();
      setNextMedicine(next);
    } catch (error) {
      console.error('Failed to initialize medicine reminders:', error);
    }
  };

  const loadUpcomingAppointments = async () => {
    try {
      setIsLoading(true);
      const appointments = await apiService.getAppointments();
      
      // Filter for upcoming appointments (scheduled status and future dates)
      const upcoming = appointments
        .filter(apt => apt.status === 'Scheduled')
        .filter(apt => new Date(apt.appointmentTime) > new Date())
        .sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime())
        .slice(0, 3); // Show only next 3 appointments
      
      setUpcomingAppointments(upcoming);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load appointments');
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUpcomingAppointments();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const navigateToAppointments = () => {
    navigation.navigate('Appointments');
  };

  const navigateToCreateAppointment = () => {
    console.log('🔍 Navigating to CreateAppointment...');
    try {
      navigation.navigate('CreateAppointment');
      console.log('✅ Navigation successful');
    } catch (error) {
      console.error('❌ Navigation error:', error);
    }
  };

  const navigateToVoiceCall = (appointmentId: string) => {
    navigation.navigate('VoiceCall', { appointmentId });
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <View style={styles.header}>
        <Text style={styles.greeting}>{t.home.greeting(user?.name || '')}</Text>
        <Text style={styles.subtitle}>{t.home.subtitle}</Text>
      </View>

      {/* Primary Actions - Most Important */}
      <View style={styles.primarySection}>
        <TouchableOpacity
          style={styles.primaryCard}
          onPress={navigateToCreateAppointment}
        >
          <View style={styles.primaryCardContent}>
            <Text style={styles.primaryIcon}>📅</Text>
            <View style={styles.primaryTextContainer}>
              <Text style={styles.primaryTitle}>{t.home.bookAppointment}</Text>
              <Text style={styles.primarySubtitle}>{t.home.scheduleConsultation}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions Grid - 2x2 Layout */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>{t.home.quickActions}</Text>
        <View style={styles.actionGrid}>
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={navigateToAppointments}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionTitle}>My Appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AI')}
            >
              <Text style={styles.actionIcon}>🤖</Text>
              <Text style={styles.actionTitle}>{t.home.aiAssistant}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('MedicineReminders')}
            >
              <Text style={styles.actionIcon}>💊</Text>
              <Text style={styles.actionTitle}>{t.home.medicineReminders}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('MedicineSchedule')}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionTitle}>{t.home.medicineSchedule}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Next Medicine Reminder */}
      {nextMedicine && (
        <View style={styles.medicineSection}>
          <Text style={styles.sectionTitle}>💊 {t.home.nextMedicine}</Text>
          <View style={styles.medicineCard}>
            <View style={styles.medicineInfo}>
              <Text style={styles.medicineName}>{nextMedicine.medicine.name}</Text>
              <Text style={styles.medicineTime}>{t.home.nextDose} {nextMedicine.time}</Text>
              <Text style={styles.medicineDosage}>{nextMedicine.medicine.dosage}</Text>
            </View>
            <TouchableOpacity
              style={styles.medicineButton}
              onPress={() => navigation.navigate('MedicineSchedule')}
            >
              <Text style={styles.medicineButtonText}>{t.home.viewSchedule}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.upcomingSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.home.upcomingAppointments}</Text>
          {upcomingAppointments.length > 0 && (
            <TouchableOpacity onPress={navigateToAppointments}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading appointments...</Text>
          </View>
        ) : upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment._id}
              style={styles.appointmentCard}
              onPress={() => navigateToVoiceCall(appointment._id)}
            >
              <View style={styles.appointmentInfo}>
                <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                <Text style={styles.appointmentTime}>
                  {formatDate(appointment.appointmentTime)}
                </Text>
                <Text style={styles.appointmentStatus}>{appointment.status}</Text>
              </View>
              <View style={styles.appointmentAction}>
                <Text style={styles.joinCallText}>Join Call</Text>
                <Text style={styles.callIcon}>📞</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>{t.home.noUpcomingAppointments}</Text>
            <Text style={styles.emptyStateSubtitle}>
              {t.home.bookFirstAppointment}
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={navigateToCreateAppointment}
            >
              <Text style={styles.emptyStateButtonText}>{t.home.bookNow}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      </ScrollView>
      
      {/* Smart Voice Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Home screen command executed:', command);
          if (command === 'refresh') {
            onRefresh();
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
  header: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  
  // Primary action section
  primarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryCard: {
    backgroundColor: '#3498db',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  primaryTextContainer: {
    flex: 1,
  },
  primaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  primarySubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
  },
  
  // Quick actions section
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  actionGrid: {
    gap: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 18,
  },
  upcomingSection: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Extra padding for voice button
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  appointmentTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  appointmentStatus: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '500',
  },
  appointmentAction: {
    alignItems: 'center',
  },
  joinCallText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 4,
  },
  callIcon: {
    fontSize: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  medicineSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  medicineTime: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '500',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  medicineButton: {
    backgroundColor: '#27ae60',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medicineButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});