// services/api/authService.ts
import apiClient from './apiClient';

export const enquiry = (userData: any) => apiClient.post('/api/enquiry', userData);

