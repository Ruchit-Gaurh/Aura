import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicineReminderService, Medicine, MedicineLog } from '../services/medicineReminder';
import { useAuth } from '../context/AuthContext';
import { VoiceNavigator } from '../components/VoiceNavigator';

interface ScheduleItem {
  medicine: Medicine;
  time: string;
  status: 'pending' | 'taken' | 'skipped' | 'missed';
  log?: MedicineLog;
}

export const MedicineScheduleScreen: React.FC = () => {
  const { user } = useAuth();
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadSchedule();
    initializeMedicineService();
  }, [selectedDate]);

  const initializeMedicineService = async () => {
    // Set user language provider
    medicineReminderService.setUserLanguageProvider({
      getUserLanguage: () => user?.preferredLanguage || 'en'
    });
  };

  const loadSchedule = () => {
    const schedule = medicineReminderService.getTodaySchedule();
    const logs = medicineReminderService.getMedicineLogsForDate(selectedDate);
    
    const scheduleItems: ScheduleItem[] = [];
    
    schedule.forEach(({ medicine, times }) => {
      times.forEach(time => {
        const log = logs.find(l => 
          l.medicineId === medicine.id && 
          l.scheduledTime === time
        );
        
        let status: 'pending' | 'taken' | 'skipped' | 'missed' = 'pending';
        
        if (log) {
          status = log.status as any;
        } else {
          // Check if time has passed and mark as missed
          const now = new Date();
          const currentTime = now.toTimeString().slice(0, 5);
          const currentDate = now.toISOString().split('T')[0];
          
          if (selectedDate === currentDate && time < currentTime) {
            status = 'missed';
          }
        }
        
        scheduleItems.push({
          medicine,
          time,
          status,
          log,
        });
      });
    });
    
    // Sort by time
    scheduleItems.sort((a, b) => a.time.localeCompare(b.time));
    setTodaySchedule(scheduleItems);
  };

  const handleMedicineTaken = async (item: ScheduleItem) => {
    try {
      await medicineReminderService.logMedicineTaken(
        item.medicine.id,
        item.time,
        'Marked from schedule'
      );
      loadSchedule();
      // Voice announcement is handled by the service
    } catch (error) {
      Alert.alert('Error', 'Failed to log medicine');
    }
  };

  const handleMedicineSkipped = async (item: ScheduleItem) => {
    Alert.alert(
      'Skip Medicine',
      `Are you sure you want to skip ${item.medicine.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: async () => {
            try {
              await medicineReminderService.logMedicineSkipped(
                item.medicine.id,
                item.time,
                'Skipped from schedule'
              );
              loadSchedule();
              // Voice announcement is handled by the service
            } catch (error) {
              Alert.alert('Error', 'Failed to log medicine');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken': return '#27ae60';
      case 'skipped': return '#f39c12';
      case 'missed': return '#e74c3c';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken': return '✅';
      case 'skipped': return '⚠️';
      case 'missed': return '❌';
      default: return '⏰';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken': return 'Taken';
      case 'skipped': return 'Skipped';
      case 'missed': return 'Missed';
      default: return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const changeDateBy = (days: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 Medicine Schedule</Text>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => changeDateBy(-1)}
        >
          <Text style={styles.dateButtonText}>← Previous</Text>
        </TouchableOpacity>
        
        <Text style={styles.selectedDate}>{formatDate(selectedDate)}</Text>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => changeDateBy(1)}
        >
          <Text style={styles.dateButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {todaySchedule.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medicines scheduled</Text>
            <Text style={styles.emptySubtext}>
              {selectedDate === new Date().toISOString().split('T')[0] 
                ? 'No medicines scheduled for today'
                : 'No medicines scheduled for this date'
              }
            </Text>
          </View>
        ) : (
          todaySchedule.map((item, index) => (
            <View key={`${item.medicine.id}-${item.time}`} style={styles.scheduleCard}>
              <View style={styles.timeSection}>
                <Text style={styles.timeText}>{item.time}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
                  <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
              </View>
              
              <View style={styles.medicineSection}>
                <Text style={styles.medicineName}>{item.medicine.name}</Text>
                <Text style={styles.medicineDosage}>{item.medicine.dosage}</Text>
                
                {item.medicine.instructions && (
                  <Text style={styles.instructions}>
                    📝 {item.medicine.instructions}
                  </Text>
                )}
                
                {item.medicine.withFood && (
                  <Text style={styles.withFood}>🍽️ Take with food</Text>
                )}
                
                {item.log?.notes && (
                  <Text style={styles.logNotes}>
                    💬 {item.log.notes}
                  </Text>
                )}
              </View>
              
              {item.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.skipButton]}
                    onPress={() => handleMedicineSkipped(item)}
                  >
                    <Text style={styles.skipButtonText}>Skip</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.takenButton]}
                    onPress={() => handleMedicineTaken(item)}
                  >
                    <Text style={styles.takenButtonText}>Taken</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {todaySchedule.filter(item => item.status === 'taken').length}
          </Text>
          <Text style={styles.summaryLabel}>Taken</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {todaySchedule.filter(item => item.status === 'pending').length}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {todaySchedule.filter(item => item.status === 'skipped').length}
          </Text>
          <Text style={styles.summaryLabel}>Skipped</Text>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>
            {todaySchedule.filter(item => item.status === 'missed').length}
          </Text>
          <Text style={styles.summaryLabel}>Missed</Text>
        </View>
      </View>
      </SafeAreaView>
      
      {/* Voice Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Medicine schedule command executed:', command);
          if (command === 'refresh') {
            loadSchedule();
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#3498db',
    fontWeight: '500',
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra space for voice button
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  medicineSection: {
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  withFood: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '500',
    marginBottom: 4,
  },
  logNotes: {
    fontSize: 14,
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  takenButton: {
    backgroundColor: '#27ae60',
  },
  takenButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
  },
});