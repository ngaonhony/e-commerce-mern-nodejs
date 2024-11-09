import apiClient from './apiClient';

export const getOrderHistory = () => apiClient.get('/api/user/getmyorders');

export const updateUserProfile = (userData: any) => apiClient.put('/api/user/edit-user', userData);

export const getUserWishlist = () => apiClient.get('/api/user/wishlist');

export const getUserCart = () => apiClient.get('/api/user/cart');

export const deleteCartProduct = (cartItemId: string) =>
    apiClient.delete(`/api/user/delete-product-cart/${cartItemId}`);

export const updateCartProduct = (cartItemId: string, newQuantity: number) =>
    apiClient.delete(`/api/user/update-product-cart/${cartItemId}/${newQuantity}`);

