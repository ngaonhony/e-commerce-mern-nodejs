import apiClient from './apiClient';

export const getBrand = () => apiClient.get('/api/brand');

