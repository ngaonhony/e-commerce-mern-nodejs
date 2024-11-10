// services/api/productService.ts

import apiClient from './apiClient';

// Fetch all products
export const getProducts = () => apiClient.get('/api/product');

// Fetch all product categories
export const getAllpCategory = () => apiClient.get('/api/category');

// Fetch a product by ID
export const getProductById = (id: string) => apiClient.get(`/api/product/${id}`);

// Add a product to the wishlist
export const addToWishlist = (prodId: string) =>
  apiClient.put('/api/product/wishlist', { prodId });

// Submit a rating for a product
export const addRating = (ratingData: { star: number; prodId: string; comment: string }) =>
  apiClient.put('/api/product/rating', ratingData);

// Other product-related functions can be added here if needed
