// services/api/authService.ts
import apiClient from './apiClient';

export const registerUser = (userData: any) => apiClient.post('/api/user/register', userData);

export const loginUser = (credentials: any) => apiClient.post('/api/user/login', credentials);
