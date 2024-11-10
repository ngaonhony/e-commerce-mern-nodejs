// src/store/blogSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAllBlogs, getBlog, getCategory, getallCategory } from '../services/api/blogService';

// Blog and Category Interfaces
export interface Blog {
    _id: string;
    title: string;
    description: string;
    category: string;  // Adjusted to be a single string
    numViews: number;
    isLiked: boolean;
    isDisliked: boolean;
    likes: string[]; // Array of user IDs
    dislikes: string[];
    author: string;
    images: { public_id: string; url: string; _id: string }[];
    createdAt: string;
    updatedAt: string;
  }
  

export interface BlogCategory {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// BlogState Interface
interface BlogState {
  blogs: Blog[];
  categories: BlogCategory[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: BlogState = {
  blogs: [],
  categories: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllBlogs = createAsyncThunk(
  'blog/fetchAllBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllBlogs();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch blogs');
    }
  }
);

export const fetchBlog = createAsyncThunk(
  'blog/fetchBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getBlog(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch blog');
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  'blog/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getallCategory();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchCategory = createAsyncThunk(
  'blog/fetchCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getCategory(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch category');
    }
  }
);

// Blog slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSelectedBlog(state, action: PayloadAction<Blog | null>) {
      state.selectedBlog = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<BlogCategory | null>) {
      state.categories = state.categories.map((category) =>
        category._id === action.payload?._id ? action.payload : category
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all blogs
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action: PayloadAction<Blog[]>) => {
        state.blogs = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllBlogs.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch blogs';
      })

      // Fetch single blog
      .addCase(fetchBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlog.fulfilled, (state, action: PayloadAction<Blog>) => {
        state.selectedBlog = action.payload;
        state.loading = false;
      })
      .addCase(fetchBlog.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch blog';
      })

      // Fetch all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action: PayloadAction<BlogCategory[]>) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllCategories.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      })

      // Fetch single category
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action: PayloadAction<BlogCategory>) => {
        const updatedCategories = state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        );
        state.categories = updatedCategories;
        state.loading = false;
      })
      .addCase(fetchCategory.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch category';
      });
  },
});

export const { setSelectedBlog, setSelectedCategory } = blogSlice.actions;
export default blogSlice.reducer;
