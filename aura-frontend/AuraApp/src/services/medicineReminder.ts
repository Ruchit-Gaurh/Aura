import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { textToSpeechService } from './textToSpeech';
import { getMedicineMessages } from './medicineMessages';

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'three_times_daily' | 'weekly' | 'as_needed';
  times: string[]; // Array of time strings like ['08:00', '20:00']
  startDate: string;
  endDate?: string;
  instructions?: string;
  withFood?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineLog {
  id: string;
  medicineId: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'taken' | 'skipped' | 'missed';
  notes?: string;
  date: string;
}

export interface MedicineReminderCallbacks {
  onReminderTriggered?: (medicine: Medicine, scheduledTime: string) => void;
  onMedicineTaken?: (medicine: Medicine, log: MedicineLog) => void;
  onMedicineSkipped?: (medicine: Medicine, log: MedicineLog) => void;
  onMedicineMissed?: (medicine: Medicine, log: MedicineLog) => void;
}

export interface UserLanguageProvider {
  getUserLanguage: () => string;
}

class MedicineReminderService {
  private medicines: Medicine[] = [];
  private medicineLogs: MedicineLog[] = [];
  private callbacks: MedicineReminderCallbacks = {};
  private reminderIntervals: Map<string, NodeJS.Timeout> = new Map();
  private isInitialized = false;
  private userLanguageProvider: UserLanguageProvider | null = null;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      await this.loadMedicines();
      await this.loadMedicineLogs();
      this.setupReminders();
      this.isInitialized = true;
      console.log('💊 Medicine reminder service initialized');
    } catch (error) {
      console.error('💊 Failed to initialize medicine reminder service:', error);
    }
  }

  setCallbacks(callbacks: MedicineReminderCallbacks) {
    this.callbacks = callbacks;
  }

  setUserLanguageProvider(provider: UserLanguageProvider) {
    this.userLanguageProvider = provider;
  }

  private getUserLanguage(): string {
    if (this.userLanguageProvider) {
      return this.userLanguageProvider.getUserLanguage();
    }
    // Fallback to browser language or English
    return Platform.OS === 'web' ? navigator.language : 'en';
  }

  // Medicine management
  async addMedicine(medicine: Omit<Medicine, 'id' | 'createdAt' | 'updatedAt'>): Promise<Medicine> {
    const newMedicine: Medicine = {
      ...medicine,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.medicines.push(newMedicine);
    await this.saveMedicines();
    this.setupReminderForMedicine(newMedicine);
    
    console.log('💊 Medicine added:', newMedicine.name);
    return newMedicine;
  }

  async updateMedicine(id: string, updates: Partial<Medicine>): Promise<Medicine | null> {
    const index = this.medicines.findIndex(m => m.id === id);
    if (index === -1) return null;

    this.medicines[index] = {
      ...this.medicines[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveMedicines();
    this.setupReminderForMedicine(this.medicines[index]);
    
    console.log('💊 Medicine updated:', this.medicines[index].name);
    return this.medicines[index];
  }

  async deleteMedicine(id: string): Promise<boolean> {
    const index = this.medicines.findIndex(m => m.id === id);
    if (index === -1) return false;

    const medicine = this.medicines[index];
    this.medicines.splice(index, 1);
    await this.saveMedicines();
    
    // Clear reminders for this medicine
    this.clearReminderForMedicine(id);
    
    console.log('💊 Medicine deleted:', medicine.name);
    return true;
  }

  getMedicines(): Medicine[] {
    return this.medicines.filter(m => m.isActive);
  }

  getMedicine(id: string): Medicine | null {
    return this.medicines.find(m => m.id === id) || null;
  }

  // Medicine logging
  async logMedicineTaken(medicineId: string, scheduledTime: string, notes?: string): Promise<MedicineLog> {
    const medicine = this.getMedicine(medicineId);
    if (!medicine) throw new Error('Medicine not found');

    const log: MedicineLog = {
      id: this.generateId(),
      medicineId,
      scheduledTime,
      actualTime: new Date().toISOString(),
      status: 'taken',
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    this.medicineLogs.push(log);
    await this.saveMedicineLogs();
    
    console.log('💊 Medicine taken logged:', medicine.name);
    this.callbacks.onMedicineTaken?.(medicine, log);
    
    // Voice announcement for taken medicine
    await this.announceMessage('takenConfirmation', medicine.name);
    
    return log;
  }

  async logMedicineSkipped(medicineId: string, scheduledTime: string, notes?: string): Promise<MedicineLog> {
    const medicine = this.getMedicine(medicineId);
    if (!medicine) throw new Error('Medicine not found');

    const log: MedicineLog = {
      id: this.generateId(),
      medicineId,
      scheduledTime,
      status: 'skipped',
      notes,
      date: new Date().toISOString().split('T')[0],
    };

    this.medicineLogs.push(log);
    await this.saveMedicineLogs();
    
    console.log('💊 Medicine skipped logged:', medicine.name);
    this.callbacks.onMedicineSkipped?.(medicine, log);
    
    // Voice announcement for skipped medicine
    await this.announceMessage('skippedWarning', medicine.name);
    
    return log;
  }

  // Get medicine schedule for today
  getTodaySchedule(): Array<{medicine: Medicine, times: string[]}> {
    const today = new Date().toISOString().split('T')[0];
    
    return this.medicines
      .filter(m => m.isActive)
      .filter(m => {
        const startDate = new Date(m.startDate).toISOString().split('T')[0];
        const endDate = m.endDate ? new Date(m.endDate).toISOString().split('T')[0] : null;
        
        return today >= startDate && (!endDate || today <= endDate);
      })
      .map(medicine => ({
        medicine,
        times: medicine.times
      }));
  }

  // Get medicine logs for a specific date
  getMedicineLogsForDate(date: string): MedicineLog[] {
    return this.medicineLogs.filter(log => log.date === date);
  }

  // Check if medicine was taken at scheduled time
  wasMedicineTaken(medicineId: string, scheduledTime: string, date: string): boolean {
    return this.medicineLogs.some(log => 
      log.medicineId === medicineId &&
      log.scheduledTime === scheduledTime &&
      log.date === date &&
      log.status === 'taken'
    );
  }

  // Get next medicine reminder
  getNextReminder(): {medicine: Medicine, time: string} | null {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const today = now.toISOString().split('T')[0];
    
    let nextReminder: {medicine: Medicine, time: string} | null = null;
    let nextTime: Date | null = null;

    for (const medicine of this.medicines.filter(m => m.isActive)) {
      for (const time of medicine.times) {
        // Check if this medicine time hasn't been taken today
        if (!this.wasMedicineTaken(medicine.id, time, today)) {
          const reminderTime = new Date();
          const [hours, minutes] = time.split(':').map(Number);
          reminderTime.setHours(hours, minutes, 0, 0);
          
          // If the time has passed today, schedule for tomorrow
          if (reminderTime <= now) {
            reminderTime.setDate(reminderTime.getDate() + 1);
          }
          
          if (!nextTime || reminderTime < nextTime) {
            nextTime = reminderTime;
            nextReminder = { medicine, time };
          }
        }
      }
    }

    return nextReminder;
  }

  // Setup reminders
  private setupReminders() {
    // Clear existing reminders
    this.reminderIntervals.forEach(interval => clearInterval(interval));
    this.reminderIntervals.clear();

    // Setup new reminders for each active medicine
    this.medicines.filter(m => m.isActive).forEach(medicine => {
      this.setupReminderForMedicine(medicine);
    });
  }

  private setupReminderForMedicine(medicine: Medicine) {
    // Clear existing reminder for this medicine
    this.clearReminderForMedicine(medicine.id);

    // Setup reminder for each time
    medicine.times.forEach(time => {
      const intervalId = setInterval(() => {
        this.checkAndTriggerReminder(medicine, time);
      }, 60000); // Check every minute

      this.reminderIntervals.set(`${medicine.id}-${time}`, intervalId);
    });
  }

  private clearReminderForMedicine(medicineId: string) {
    this.reminderIntervals.forEach((interval, key) => {
      if (key.startsWith(medicineId)) {
        clearInterval(interval);
        this.reminderIntervals.delete(key);
      }
    });
  }

  private async checkAndTriggerReminder(medicine: Medicine, scheduledTime: string) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const today = now.toISOString().split('T')[0];

    // Check if it's time for this medicine
    if (currentTime === scheduledTime) {
      // Check if medicine hasn't been taken yet today
      if (!this.wasMedicineTaken(medicine.id, scheduledTime, today)) {
        console.log('💊 Medicine reminder triggered:', medicine.name, 'at', scheduledTime);
        
        // Voice announcement for medicine reminder
        await this.announceMedicineReminder(medicine, scheduledTime);
        
        this.callbacks.onReminderTriggered?.(medicine, scheduledTime);
      }
    }
  }

  // Storage methods
  private async saveMedicines() {
    try {
      await AsyncStorage.setItem('medicines', JSON.stringify(this.medicines));
    } catch (error) {
      console.error('💊 Failed to save medicines:', error);
    }
  }

  private async loadMedicines() {
    try {
      const stored = await AsyncStorage.getItem('medicines');
      if (stored) {
        this.medicines = JSON.parse(stored);
      }
    } catch (error) {
      console.error('💊 Failed to load medicines:', error);
    }
  }

  private async saveMedicineLogs() {
    try {
      await AsyncStorage.setItem('medicineLogs', JSON.stringify(this.medicineLogs));
    } catch (error) {
      console.error('💊 Failed to save medicine logs:', error);
    }
  }

  private async loadMedicineLogs() {
    try {
      const stored = await AsyncStorage.getItem('medicineLogs');
      if (stored) {
        this.medicineLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('💊 Failed to load medicine logs:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Voice announcement methods
  private async announceMedicineReminder(medicine: Medicine, scheduledTime: string) {
    try {
      const userLanguage = this.getUserLanguage();
      const messages = getMedicineMessages(userLanguage);
      
      // Create the main reminder message
      const reminderText = messages.reminderMessage(medicine.name, medicine.dosage);
      
      // Add time announcement
      const timeText = messages.timeAnnouncement(scheduledTime);
      
      // Add food instruction if needed
      const foodText = medicine.withFood ? messages.withFoodMessage : '';
      
      // Combine messages
      const fullMessage = [timeText, reminderText, foodText].filter(Boolean).join('. ');
      
      console.log('🔊 Announcing medicine reminder:', fullMessage);
      
      // Speak the message
      await textToSpeechService.speak(fullMessage, {
        language: userLanguage,
        rate: 0.8, // Slower for elderly users
        volume: 1.0
      });
      
    } catch (error) {
      console.error('🔊 Failed to announce medicine reminder:', error);
    }
  }

  private async announceMessage(messageType: keyof typeof getMedicineMessages, medicineName?: string) {
    try {
      const userLanguage = this.getUserLanguage();
      const messages = getMedicineMessages(userLanguage);
      
      let messageText = '';
      
      switch (messageType) {
        case 'takenConfirmation':
          messageText = messages.takenConfirmation(medicineName || '');
          break;
        case 'skippedWarning':
          messageText = messages.skippedWarning(medicineName || '');
          break;
        case 'missedWarning':
          messageText = messages.missedWarning(medicineName || '');
          break;
        default:
          messageText = messages.goodJob;
      }
      
      console.log('🔊 Announcing message:', messageText);
      
      // Speak the message
      await textToSpeechService.speak(messageText, {
        language: userLanguage,
        rate: 0.8,
        volume: 1.0
      });
      
    } catch (error) {
      console.error('🔊 Failed to announce message:', error);
    }
  }

  // Public method to announce current time in user's language
  async announceCurrentTime() {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString(this.getUserLanguage(), { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      const userLanguage = this.getUserLanguage();
      const messages = getMedicineMessages(userLanguage);
      const timeMessage = messages.timeAnnouncement(timeString);
      
      await textToSpeechService.speak(timeMessage, {
        language: userLanguage,
        rate: 0.8,
        volume: 1.0
      });
      
    } catch (error) {
      console.error('🔊 Failed to announce time:', error);
    }
  }

  // Cleanup
  destroy() {
    this.reminderIntervals.forEach(interval => clearInterval(interval));
    this.reminderIntervals.clear();
    this.isInitialized = false;
    console.log('💊 Medicine reminder service destroyed');
  }
}

export const medicineReminderService = new MedicineReminderService();