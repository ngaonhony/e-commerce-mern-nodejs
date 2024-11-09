import apiClient from './apiClient';

export const getOrderHistory = () => apiClient.get('/api/user/getmyorders');

export const updateUserProfile = (userData: any) => apiClient.put('/api/user/edit-user', userData);

export const getUserWishlist = () => apiClient.get('/api/user/wishlist');
