import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getProducts } from '../services/api/productService';

interface ProductState {
  products: any[];
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
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<any[]>) => {
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