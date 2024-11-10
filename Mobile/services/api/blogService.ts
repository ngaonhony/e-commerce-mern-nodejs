// src/services/api/blogService.ts

import apiClient from './apiClient';

export const getAllBlogs = () => apiClient.get('/api/blog/');

export const getBlog = (id: string) => apiClient.get(`/api/blog/${id}`);

export const getCategory = (id: string) => apiClient.get(`/api/blogcategory/${id}`);

export const getallCategory = () => apiClient.get('/api/blogcategory/');
