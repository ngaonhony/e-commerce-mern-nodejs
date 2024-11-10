import apiClient from './apiClient';

export const getProducts = () => apiClient.get('/api/product');

export const getAllpCategory = () => apiClient.get('/api/category');

