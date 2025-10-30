import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { SUPPORTED_LANGUAGES } from '../config/api';
import { VoiceNavigator } from '../components/VoiceNavigator';
import { useTranslations } from '../hooks/useTranslations';

export const ProfileScreen: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const t = useTranslations();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedLanguage, setEditedLanguage] = useState(user?.preferredLanguage || 'en-US');

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      await apiService.updateProfile({
        name: editedName.trim(),
        preferredLanguage: editedLanguage,
      });
      
      await refreshUser();
      setIsEditing(false);
      Alert.alert(t.common.success, 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditedLanguage(user?.preferredLanguage || 'en-US');
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getLanguageName = (code: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
    return language ? `${language.flag} ${language.name}` : code;
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.header}>
        <Text style={styles.title}>{t.profile.profile}</Text>
        {!isEditing && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonText}>{t.common.edit}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.profile.name}</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                editable={!isLoading}
              />
            ) : (
              <Text style={styles.value}>{user?.name}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.profile.email}</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>{t.profile.preferredLanguage}</Text>
            {isEditing ? (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={editedLanguage}
                  onValueChange={setEditedLanguage}
                  enabled={!isLoading}
                  style={styles.picker}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <Picker.Item
                      key={lang.code}
                      label={`${lang.flag} ${lang.name}`}
                      value={lang.code}
                    />
                  ))}
                </Picker>
              </View>
            ) : (
              <Text style={styles.value}>
                {getLanguageName(user?.preferredLanguage || 'en-US')}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelEdit}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleSaveProfile}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? `${t.common.save}...` : t.common.save}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>{t.profile.accountSettings}</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>🔔</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingSubtitle}>Manage your notification preferences</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>🔒</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Privacy</Text>
            <Text style={styles.settingSubtitle}>Control your privacy settings</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>❓</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help & Support</Text>
            <Text style={styles.settingSubtitle}>Get help and contact support</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingIcon}>ℹ️</Text>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>About</Text>
            <Text style={styles.settingSubtitle}>App version and information</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t.profile.logout}</Text>
      </TouchableOpacity>
      </ScrollView>
      
      {/* Voice & Gesture Navigation */}
      <VoiceNavigator
        enabled={true}
        showIndicator={true}
        onCommandExecuted={(command) => {
          console.log('🎯 Profile screen command executed:', command);
          if (command === 'logout') {
            handleLogout();
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Extra space for voice button
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
  editButton: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  profileCard: {
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    fontSize: 64,
    backgroundColor: '#ecf0f1',
    borderRadius: 40,
    width: 80,
    height: 80,
    textAlign: 'center',
    lineHeight: 80,
  },
  profileInfo: {
    marginBottom: 24,
  },
  infoRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#2c3e50',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#ecf0f1',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  settingArrow: {
    fontSize: 20,
    color: '#bdc3c7',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    marginHorizontal: 24,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});