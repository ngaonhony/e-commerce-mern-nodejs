import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../services/api/authService';
import { updateUserProfile } from '../services/api/userService';

interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
}

interface AuthState {
  user: {
    token: string;
    userData: UserData;
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Async thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await loginUser(credentials);
      const token = response.data.token;
      // Extract user data directly from response.data
      const customer: UserData = {
        _id: response.data._id,
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        mobile: response.data.mobile,
        email: response.data.email,
        // Add other fields if necessary
      };

      if (!customer) {
        // If user data is missing, reject with an error
        return rejectWithValue('User data is missing from the response.');
      }

      // Save token and user data to AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('customer', JSON.stringify(customer));

      return { token, userData: customer };
    } catch (error: any) {
      // Enhanced error handling for more detailed messages
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk for registering
export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { firstname: string; lastname: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await registerUser(userData);
      // Optionally, auto-login after registration
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Async thunk for logging out
export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('customer');
});

// Async thunk to load user from AsyncStorage
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async () => {
    const customer = await AsyncStorage.getItem('customer');
    const token = await AsyncStorage.getItem('token');
    if (customer && token) {
      return { token, userData: JSON.parse(customer) };
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Define synchronous actions here if needed
  },
  extraReducers: (builder) => {
    // Handle loadUser
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loadUser.fulfilled,
        (state, action: PayloadAction<{ token: string; userData: UserData } | null>) => {
          if (action.payload) {
            state.user = action.payload;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
          state.loading = false;
        }
      )
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Handle login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ token: string; userData: UserData }>) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.loading = false;
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Handle register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        // Optionally, set user data if auto-login after registration
      })
      .addCase(register.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Handle logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
  },
});

export default authSlice.reducer;