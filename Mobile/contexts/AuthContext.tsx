import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/api/apiClient';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        // Gọi API để lấy thông tin người dùng
        try {
          const response = await apiClient.get('/api/user/current');
          setUser({ token, userData: response.data });
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Nếu lỗi, xóa token và đặt user là null
          await AsyncStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await loginUser(credentials);
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);
      // Lưu thông tin người dùng
      setUser({ token, userData: response.data });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      await registerUser(userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
