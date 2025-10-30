import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { apiService } from '../services/api';
import { Appointment } from '../types';
import { VoiceNavigator } from '../components/VoiceNavigator';

interface AppointmentsScreenProps {
  navigation: any;
}

export const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ navigation }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getAppointments();
      // Sort by appointment time (newest first)
      const sortedAppointments = data.sort(
        (a, b) => new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime()
      );
      setAppointments(sortedAppointments);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load appointments');
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter(apt => apt.status.toLowerCase() === filter);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  const navigateToAppointmentDetail = (appointmentId: string) => {
    navigation.navigate('AppointmentDetail', { appointmentId });
  };

  const navigateToCreateAppointment = () => {
    navigation.navigate('CreateAppointment');
  };

  const navigateToVoiceCall = (appointmentId: string) => {
    navigation.navigate('VoiceCall', { appointmentId });
  };

  const renderAppointmentItem = ({ item }: { item: Appointment }) => {
    const isUpcoming = item.status === 'Scheduled' && new Date(item.appointmentTime) > new Date();
    
    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => navigateToAppointmentDetail(item._id)}
      >
        <View style={styles.appointmentHeader}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.appointmentTime}>{formatDate(item.appointmentTime)}</Text>
        
        {item.transcript && (
          <Text style={styles.transcriptPreview} numberOfLines={2}>
            {item.transcript}
          </Text>
        )}
        
        <View style={styles.appointmentActions}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => navigateToAppointmentDetail(item._id)}
          >
            <Text style={styles.detailButtonText}>View Details</Text>
          </TouchableOpacity>
          
          {isUpcoming && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => navigateToVoiceCall(item._id)}
            >
              <Text style={styles.callButtonText}>Join Call</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterType: typeof filter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.activeFilterButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const filteredAppointments = getFilteredAppointments();

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={navigateToCreateAppointment}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('scheduled', 'Scheduled')}
        {renderFilterButton('completed', 'Completed')}
        {renderFilterButton('cancelled', 'Cancelled')}
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>
              {filter === 'all' ? 'No Appointments' : `No ${filter} Appointments`}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {filter === 'all'
                ? 'Book your first appointment to get started'
                : `You don't have any ${filter} appointments`}
            </Text>
            {filter === 'all' && (
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={navigateToCreateAppointment}
              >
                <Text style={styles.emptyStateButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
      </View>
      
      {/* Voice & Gesture Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Appointments screen command executed:', command);
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
  addButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeFilterButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Extra space for voice button
    flexGrow: 1,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  transcriptPreview: {
    fontSize: 14,
    color: '#34495e',
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 20,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  detailButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  callButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
});