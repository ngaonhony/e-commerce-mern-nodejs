// userSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  updateUserProfile,
  getOrderHistory,
  getUserWishlist,
  getUserCart,
  deleteCartProduct as apiDeleteCartProduct,
  updateCartProduct,
  createOrder as apiCreateOrder,
  emptyCart as apiEmptyCart,
} from '../services/api/userService';

// Interface definitions
interface Image {
  public_id: string;
  url: string;
  _id: string;
}

interface Rating {
  star: number;
  comment: string;
  postedby: string;
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  quantity: number;
  sold: number;
  images: Image[];
  color: string[];
  tags: string;
  totalrating: number;
  ratings: Rating[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Color {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  price: number;
  color: Color;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ShippingInfo {
  firstname: string;
  lastname: string;
  address: string;
  city?: string;
  state?: string;
  other?: string;
  pincode: string;
}

interface OrderItem {
  product: Product | string; // Could be product object or product ID
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  totalPrice: number;
  orderStatus: string;
  paidAt: string;
  shippingInfo: ShippingInfo;
  orderItems: OrderItem[];
  month?: number;
  totalPriceAfterDiscount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface WishlistItem extends Product {}

interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  isBlocked: boolean;
  cart: any[];
  wishlist: WishlistItem[];
  orders: Order[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
}

interface UserState {
  userData: UserData | null;
  wishlist: WishlistItem[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
  isSuccess: boolean;
}

// Initial state
const initialState: UserState = {
  userData: null,
  wishlist: [],
  cart: [],
  orders: [],
  loading: false,
  error: null,
  isSuccess: false,
};

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedData: Partial<UserData>, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(updatedData);
      const updatedUser: UserData = response.data;

      // Update AsyncStorage
      await AsyncStorage.setItem('customer', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const fetchUserWishlist = createAsyncThunk(
  'user/fetchUserWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserWishlist();
      return response.data.wishlist;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'user/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrderHistory();
      return response.data.orders || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order history');
    }
  }
);

export const fetchUserCart = createAsyncThunk(
  'user/fetchUserCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserCart();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const deleteCartProduct = createAsyncThunk(
  'user/deleteCartProduct',
  async (cartItemId: string, { rejectWithValue }) => {
    try {
      await apiDeleteCartProduct(cartItemId);
      return cartItemId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product from cart');
    }
  }
);

export const updateCartProductQuantity = createAsyncThunk(
  'user/updateCartProductQuantity',
  async (
    { cartItemId, newQuantity }: { cartItemId: string; newQuantity: number },
    { rejectWithValue }
  ) => {
    try {
      await updateCartProduct(cartItemId, newQuantity);
      return { cartItemId, newQuantity };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product quantity');
    }
  }
);

export const createOrder = createAsyncThunk(
  'user/createOrder',
  async (orderData: any, { rejectWithValue }) => {
    try {
      const response = await apiCreateOrder(orderData);
      const data: { success: boolean; order: Order } = response.data;
      return data.order;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const clearCart = createAsyncThunk(
  'user/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiEmptyCart();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserData>) {
      state.userData = action.payload;
      state.wishlist = action.payload.wishlist;
    },
    resetOrderState(state) {
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<UserData>) => {
        state.userData = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      })
      // Fetch wishlist
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserWishlist.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wishlist';
      })
      // Fetch orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order history';
      })
      // Fetch cart
      .addCase(fetchUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      // Delete from cart
      .addCase(deleteCartProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.cart = state.cart.filter((item) => item._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCartProduct.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product from cart';
      })
      // Update cart product quantity
      .addCase(updateCartProductQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartProductQuantity.fulfilled,
        (state, action: PayloadAction<{ cartItemId: string; newQuantity: number }>) => {
          const { cartItemId, newQuantity } = action.payload;
          const item = state.cart.find((item) => item._id === cartItemId);
          if (item) {
            item.quantity = newQuantity;
          }
          state.loading = false;
        }
      )
      .addCase(updateCartProductQuantity.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product quantity';
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSuccess = false;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.orders.push(action.payload);
        state.loading = false;
        state.isSuccess = true;
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
        state.isSuccess = false;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = [];
        state.loading = false;
      })
      .addCase(clearCart.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to clear cart';
      });
  },
});

export const { setUserData, resetOrderState } = userSlice.actions;
export default userSlice.reducer;
