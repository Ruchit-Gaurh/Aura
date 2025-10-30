import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/api';
import { User, LoginRequest, RegisterRequest } from '../types';
import { apiService } from './api';

class AuthService {
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await apiService.login(credentials);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      
      // Get user profile after successful login
      const user = await apiService.getProfile();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await apiService.register(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      
      // Get user profile after successful registration
      const user = await apiService.getProfile();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  }

  async refreshUserData(): Promise<User | null> {
    try {
      const user = await apiService.getProfile();
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  }
}

export const authService = new AuthService();