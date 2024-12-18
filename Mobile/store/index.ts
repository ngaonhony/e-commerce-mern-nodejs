// store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import enquiryReducer from './enquirySlice';
import userReducer from './userSlice';
import brandReducer from './brandSlice';
import blogReducer from './blogSlice';

// Import other reducers as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    enquiry: enquiryReducer,
    user: userReducer,
    brand: brandReducer,
    blog: blogReducer,
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
