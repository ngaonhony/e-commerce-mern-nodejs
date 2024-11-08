import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
// Import other reducers as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    // Add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;