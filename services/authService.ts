import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  language: 'en' | 'si';
  defaultMode: 'buyer' | 'seller';
  currentMode: 'buyer' | 'seller';
  hasCompletedOnboarding?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Mock user database (in a real app, this would be a backend API)
const mockUsers: { [email: string]: User } = {};

export const authService = {
  // Dummy login function
  async login(email: string, password: string): Promise<User> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password combination
    // In a real app, you would validate against your backend
    const user: User = mockUsers[email] || {
      id: Crypto.randomUUID(),
      email,
      firstName: 'Oshada',
      lastName: 'Bandaranayake',
      mobileNumber: '+94771234567',
      language: 'en',
      defaultMode: 'buyer',
      currentMode: 'buyer',
      hasCompletedOnboarding: false,
    };
    
    mockUsers[email] = user;
    await this.storeUser(user);
    return user;
  },

  // Register function
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    language: 'en' | 'si';
    defaultMode: 'buyer' | 'seller';
  }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Crypto.randomUUID(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNumber: userData.mobileNumber,
      language: userData.language,
      defaultMode: userData.defaultMode,
      currentMode: userData.defaultMode,
      hasCompletedOnboarding: false,
    };
    
    mockUsers[userData.email] = user;
    await this.storeUser(user);
    return user;
  },

  // Google OAuth (dummy implementation)
  async loginWithGoogle(): Promise<User> {
    // In a real app, you would use expo-auth-session for actual Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user: User = {
      id: Crypto.randomUUID(),
      email: 'google.user@gmail.com',
      firstName: 'Oshada',
      lastName: 'Bandaranayake',
      mobileNumber: '+94771234567',
      language: 'en',
      defaultMode: 'buyer',
      currentMode: 'buyer',
      hasCompletedOnboarding: false,
    };
    
    await this.storeUser(user);
    return user;
  },

  // Send OTP (dummy)
  async sendOTP(mobileNumber: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return dummy OTP - in real app, this would be sent via SMS
    return '1234';
  },

  // Verify OTP (dummy)
  async verifyOTP(mobileNumber: string, otp: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Accept any 4-digit OTP for demo
    return otp.length === 4;
  },

  // Switch user mode
  async switchMode(mode: 'buyer' | 'seller'): Promise<void> {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userData) {
      const user: User = JSON.parse(userData);
      user.currentMode = mode;
      await this.storeUser(user);
    }
  },

  // Store user data
  async storeUser(user: User): Promise<void> {
    const token = Crypto.randomUUID();
    await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },

  // Get stored user
  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      
      if (userData && token) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error retrieving stored user:', error);
    }
    return null;
  },

  // Mark onboarding as completed
  async completeOnboarding(): Promise<void> {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (userData) {
      const user: User = JSON.parse(userData);
      user.hasCompletedOnboarding = true;
      await this.storeUser(user);
    }
  },

  // Logout
  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  },
};
