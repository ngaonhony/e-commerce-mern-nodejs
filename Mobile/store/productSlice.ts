// src/store/productSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getProducts } from '../services/api/productService';

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  quantity: number;
  sold: number;
  images: { public_id: string; url: string; _id: string }[];
  color: string[];
  tags: string[]; // Changed from 'string' to 'string[]'
  totalrating: number;
  ratings: { star: number; comment: string; postedby: string; _id: string }[];
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getProducts();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Add synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export default productSlice.reducer;
