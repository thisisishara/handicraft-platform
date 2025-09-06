import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authService, AuthState } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    language: 'en' | 'si';
    defaultMode: 'buyer' | 'seller';
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchMode: (mode: 'buyer' | 'seller') => Promise<void>;
  completeOnboarding: () => Promise<void>;
  sendOTP: (mobileNumber: string) => Promise<string>;
  verifyOTP: (mobileNumber: string, otp: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await authService.getStoredUser();
      setAuthState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.login(email, password);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    language: 'en' | 'si';
    defaultMode: 'buyer' | 'seller';
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.register(userData);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.loginWithGoogle();
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.logout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const switchMode = async (mode: 'buyer' | 'seller') => {
    if (!authState.user) return;
    
    try {
      await authService.switchMode(mode);
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, currentMode: mode } : null,
      }));
    } catch (error) {
      console.error('Error switching mode:', error);
      throw error;
    }
  };

  const sendOTP = async (mobileNumber: string): Promise<string> => {
    return await authService.sendOTP(mobileNumber);
  };

  const completeOnboarding = async () => {
    try {
      await authService.completeOnboarding();
      // Update the local state
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, hasCompletedOnboarding: true } : null,
      }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const verifyOTP = async (mobileNumber: string, otp: string): Promise<boolean> => {
    return await authService.verifyOTP(mobileNumber, otp);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        loginWithGoogle,
        logout,
        switchMode,
        completeOnboarding,
        sendOTP,
        verifyOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
