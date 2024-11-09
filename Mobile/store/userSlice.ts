import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  updateUserProfile,
  getOrderHistory,
  getUserWishlist,
  getUserCart,
  deleteCartProduct as apiDeleteCartProduct,
  updateCartProduct,
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

interface ShippingInfo {
  firstname: string;
  lastname: string;
  address: string;
  city: string;
  state: string;
  other?: string;
  pincode: number;
}

interface PaymentInfo {
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

interface OrderItem {
  product: string;
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
  paymentInfo: PaymentInfo;
  orderItems: OrderItem[];
  month: number;
  totalPriceAfterDiscount: number;
  createdAt: string;
  updatedAt: string;
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

interface UserState {
  userData: UserData | null;
  wishlist: WishlistItem[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  userData: null,
  wishlist: [],
  cart: [],
  orders: [],
  loading: false,
  error: null,
};

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedData: Partial<UserData>, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(updatedData);
      const updatedUser: UserData = response.data;

      const token = (await AsyncStorage.getItem('token')) || '';
      await AsyncStorage.setItem('customer', JSON.stringify(updatedUser));

      return { token, userData: updatedUser };
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

export const deleteCartProductThunk = createAsyncThunk(
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
  async ({ cartItemId, newQuantity }: { cartItemId: string; newQuantity: number }) => {
    const response = await updateCartProduct(cartItemId, newQuantity);
    return { cartItemId, newQuantity };
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
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order history';
      })
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
      .addCase(deleteCartProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartProductThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.cart = state.cart.filter((item) => item._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCartProductThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product from cart';
      })
      .addCase(updateCartProductQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartProductQuantity.fulfilled, (state, action) => {
        const { cartItemId, newQuantity } = action.payload;
        const item = state.cart.find((item) => item._id === cartItemId);
        if (item) {
          item.quantity = newQuantity;
        }
        state.loading = false;
      })
      .addCase(updateCartProductQuantity.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product quantity';
      });
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;
