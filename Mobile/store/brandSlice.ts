import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBrand } from '../services/api/brandService';

// Define the BrandState interface
export interface BrandState {
  brands: any[]; // Array to hold brand data
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

// Async thunk to fetch brands
export const fetchBrands = createAsyncThunk(
  'brand/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBrand();
      return response.data; // Return the brand data
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    // Add synchronous reducers if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchBrands
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.brands = action.payload; // Store brands in state
        state.loading = false;
      })
      .addCase(fetchBrands.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch brands';
      });
  },
});

export default brandSlice.reducer;