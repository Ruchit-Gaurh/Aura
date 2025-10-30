import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicineReminderService, Medicine } from '../services/medicineReminder';
import { useAuth } from '../context/AuthContext';
import { useTranslations } from '../hooks/useTranslations';
import { VoiceNavigator } from '../components/VoiceNavigator';

export const MedicineRemindersScreen: React.FC = () => {
  const { user } = useAuth();
  const t = useTranslations();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    dosage: '',
    frequency: 'daily' as const,
    times: ['08:00'],
    instructions: '',
    withFood: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    loadMedicines();
    initializeMedicineService();
  }, []);

  const initializeMedicineService = async () => {
    await medicineReminderService.initialize();
    
    // Set user language provider
    medicineReminderService.setUserLanguageProvider({
      getUserLanguage: () => user?.preferredLanguage || 'en'
    });
    
    medicineReminderService.setCallbacks({
      onReminderTriggered: (medicine, time) => {
        Alert.alert(
          '💊 Medicine Reminder',
          `Time to take ${medicine.name} (${medicine.dosage})\nScheduled time: ${time}${medicine.withFood ? '\n⚠️ Take with food' : ''}`,
          [
            { text: 'Skip', onPress: () => handleMedicineSkipped(medicine.id, time) },
            { text: 'Taken', onPress: () => handleMedicineTaken(medicine.id, time) },
          ]
        );
      },
      onMedicineTaken: (medicine, log) => {
        console.log('Medicine taken:', medicine.name);
      },
      onMedicineSkipped: (medicine, log) => {
        console.log('Medicine skipped:', medicine.name);
      },
    });
  };

  const loadMedicines = () => {
    const allMedicines = medicineReminderService.getMedicines();
    setMedicines(allMedicines);
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.name.trim() || !newMedicine.dosage.trim()) {
      Alert.alert('Error', 'Please fill in medicine name and dosage');
      return;
    }

    try {
      await medicineReminderService.addMedicine({
        ...newMedicine,
        isActive: true,
      });
      
      loadMedicines();
      setShowAddModal(false);
      resetNewMedicine();
      
      Alert.alert('Success', 'Medicine reminder added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add medicine reminder');
    }
  };

  const handleDeleteMedicine = (medicine: Medicine) => {
    Alert.alert(
      'Delete Medicine',
      `Are you sure you want to delete ${medicine.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await medicineReminderService.deleteMedicine(medicine.id);
            loadMedicines();
          },
        },
      ]
    );
  };

  const handleMedicineTaken = async (medicineId: string, scheduledTime: string) => {
    try {
      await medicineReminderService.logMedicineTaken(medicineId, scheduledTime);
      // Voice announcement is handled by the service
    } catch (error) {
      Alert.alert('Error', 'Failed to log medicine');
    }
  };

  const handleMedicineSkipped = async (medicineId: string, scheduledTime: string) => {
    try {
      await medicineReminderService.logMedicineSkipped(medicineId, scheduledTime);
      // Voice announcement is handled by the service
    } catch (error) {
      Alert.alert('Error', 'Failed to log medicine');
    }
  };

  const resetNewMedicine = () => {
    setNewMedicine({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['08:00'],
      instructions: '',
      withFood: false,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const updateMedicineTimes = (frequency: string) => {
    let times: string[] = [];
    switch (frequency) {
      case 'daily':
        times = ['08:00'];
        break;
      case 'twice_daily':
        times = ['08:00', '20:00'];
        break;
      case 'three_times_daily':
        times = ['08:00', '14:00', '20:00'];
        break;
      case 'weekly':
        times = ['08:00'];
        break;
      default:
        times = ['08:00'];
    }
    setNewMedicine(prev => ({ ...prev, frequency: frequency as any, times }));
  };

  const formatFrequency = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'Once daily';
      case 'twice_daily': return 'Twice daily';
      case 'three_times_daily': return 'Three times daily';
      case 'weekly': return 'Weekly';
      case 'as_needed': return 'As needed';
      default: return frequency;
    }
  };

  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💊 {t.medicine.medicineReminders}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => medicineReminderService.announceCurrentTime()}
          >
            <Text style={styles.testButtonText}>🔊 {t.medicine.testVoice}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addButtonText}>+ {t.medicine.addMedicine}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {medicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No medicine reminders set</Text>
            <Text style={styles.emptySubtext}>
              Tap "Add Medicine" to set up your first reminder
            </Text>
          </View>
        ) : (
          medicines.map((medicine) => (
            <View key={medicine.id} style={styles.medicineCard}>
              <View style={styles.medicineHeader}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteMedicine(medicine)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
              <Text style={styles.medicineFrequency}>
                {formatFrequency(medicine.frequency)}
              </Text>
              
              <View style={styles.timesContainer}>
                <Text style={styles.timesLabel}>Times:</Text>
                {medicine.times.map((time, index) => (
                  <Text key={index} style={styles.timeChip}>{time}</Text>
                ))}
              </View>
              
              {medicine.instructions && (
                <Text style={styles.instructions}>
                  📝 {medicine.instructions}
                </Text>
              )}
              
              {medicine.withFood && (
                <Text style={styles.withFood}>🍽️ Take with food</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Medicine Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Medicine</Text>
            <TouchableOpacity onPress={handleAddMedicine}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Medicine Name *</Text>
              <TextInput
                style={styles.textInput}
                value={newMedicine.name}
                onChangeText={(text) => setNewMedicine(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Aspirin, Metformin"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Dosage *</Text>
              <TextInput
                style={styles.textInput}
                value={newMedicine.dosage}
                onChangeText={(text) => setNewMedicine(prev => ({ ...prev, dosage: text }))}
                placeholder="e.g., 100mg, 1 tablet"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Frequency</Text>
              <View style={styles.frequencyButtons}>
                {[
                  { key: 'daily', label: 'Once daily' },
                  { key: 'twice_daily', label: 'Twice daily' },
                  { key: 'three_times_daily', label: '3 times daily' },
                  { key: 'weekly', label: 'Weekly' },
                ].map((freq) => (
                  <TouchableOpacity
                    key={freq.key}
                    style={[
                      styles.frequencyButton,
                      newMedicine.frequency === freq.key && styles.frequencyButtonActive
                    ]}
                    onPress={() => updateMedicineTimes(freq.key)}
                  >
                    <Text style={[
                      styles.frequencyButtonText,
                      newMedicine.frequency === freq.key && styles.frequencyButtonTextActive
                    ]}>
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instructions</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newMedicine.instructions}
                onChangeText={(text) => setNewMedicine(prev => ({ ...prev, instructions: text }))}
                placeholder="Special instructions..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.switchGroup}>
              <Text style={styles.inputLabel}>Take with food</Text>
              <Switch
                value={newMedicine.withFood}
                onValueChange={(value) => setNewMedicine(prev => ({ ...prev, withFood: value }))}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
      </SafeAreaView>
      
      {/* Voice Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Medicine reminders command executed:', command);
          if (command === 'refresh') {
            loadMedicines();
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  testButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  medicineCard: {
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
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  medicineDosage: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 4,
  },
  medicineFrequency: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  timesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  timesLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginRight: 8,
  },
  timeChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#495057',
    marginRight: 4,
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
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6c757d',
  },
  saveButton: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  frequencyButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  frequencyButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  frequencyButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  frequencyButtonTextActive: {
    color: '#fff',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});