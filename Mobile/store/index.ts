import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import enquiryReducer from './enquirySlice';
import userReducer from './userSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    enquiry: enquiryReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;