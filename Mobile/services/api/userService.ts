// services/api/userService.ts

import apiClient from './apiClient';

// Interface definitions
interface AddToCartData {
  productId: string;
  quantity: number;
  color: string;
  price: number;
}

interface UpdateCartQuantityData {
  cartItemId: string;
  newQuantity: number;
}

interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  email?: string;
  mobile?: string;
  password?: string;
  // Add other user fields if necessary
}

interface ShippingInfo {
  firstname: string;
  lastname: string;
  address: string;
  pincode: string;
  // Add other shipping info fields if necessary
}

interface OrderItem {
  product: string; // Product ID
  quantity: number;
  color: string;
  price: number;
}

interface OrderData {
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  totalPrice: number;
  totalPriceAfterDiscount?: number;
  // Add other order fields if necessary
}

// Fetch the user's order history
export const getOrderHistory = () => apiClient.get('/api/user/getmyorders');

// Update the user's profile
export const updateUserProfile = (userData: UpdateProfileData) =>
  apiClient.put('/api/user/edit-user', userData);

// Fetch the user's wishlist
export const getUserWishlist = () => apiClient.get('/api/user/wishlist');

// Fetch the user's cart
export const getUserCart = () => apiClient.get('/api/user/cart');

// Delete a product from the cart
export const deleteCartProduct = (cartItemId: string) =>
  apiClient.delete(`/api/user/delete-product-cart/${cartItemId}`);

// Update the quantity of a product in the cart
export const updateCartProduct = (cartItemId: string, newQuantity: number) =>
  apiClient.put(`/api/user/update-product-cart/${cartItemId}`, { quantity: newQuantity });

// Add a product to the cart
export const addToCart = (orderData: AddToCartData) =>
  apiClient.post('/api/user/cart', orderData);

// Create an order
export const createOrder = (orderData: OrderData) =>
  apiClient.post('/api/user/cart/create-order', orderData);

// Clear the cart
export const emptyCart = () => apiClient.delete('/api/user/empty-cart');
