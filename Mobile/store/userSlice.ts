import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserProfile, getOrderHistory, getUserWishlist, getUserCart, deleteCartProduct as apiDeleteCartProduct, updateCartProduct } from '../services/api/userService';

// Định nghĩa các giao diện nếu chưa được định nghĩa
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

interface WishlistItem {
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

interface UserData {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  isBlocked: boolean;
  cart: any[]; // Bạn có thể định nghĩa chi tiết hơn nếu cần
  wishlist: WishlistItem[];
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
  loading: boolean;
  error: string | null;
}

// **Định nghĩa initialState**
const initialState: UserState = {
  userData: null,
  wishlist: [],
  cart: [],
  loading: false,
  error: null,
};

// Async thunk để cập nhật hồ sơ người dùng
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (updatedData: Partial<UserData>, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(updatedData);
      const updatedUser: UserData = response.data;

      // Cập nhật AsyncStorage
      const token = (await AsyncStorage.getItem('token')) || '';
      await AsyncStorage.setItem('customer', JSON.stringify(updatedUser));

      return { token, userData: updatedUser };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

// Async thunk để lấy lịch sử đơn hàng
export const fetchOrderHistory = createAsyncThunk(
  'user/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrderHistory();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order history');
    }
  }
);

// Async thunk để lấy wishlist người dùng
export const fetchUserWishlist = createAsyncThunk(
  'user/fetchUserWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserWishlist();
      // Giả sử response.data là object user với thuộc tính wishlist
      return response.data.wishlist;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// Async thunk to fetch user cart
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

// Async thunk to delete a product from the cart
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

// Async thunk to update product quantity in the cart
export const updateCartProductQuantity = createAsyncThunk(
  'user/updateCartProductQuantity',
  async ({ cartItemId, newQuantity }: { cartItemId: string; newQuantity: number }) => {
    const response = await updateCartProduct(cartItemId, newQuantity);
    return { cartItemId, newQuantity };
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState, // Sử dụng initialState đã định nghĩa
  reducers: {
    // Định nghĩa các hành động đồng bộ nếu cần
    setUserData(state, action: PayloadAction<UserData>) {
      state.userData = action.payload;
      state.wishlist = action.payload.wishlist;
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý pending
      .addCase(fetchUserWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Xử lý fulfilled
      .addCase(fetchUserWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      // Xử lý rejected
      .addCase(fetchUserWishlist.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch wishlist';
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
      // Handle deleteCartProductThunk
      .addCase(deleteCartProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartProductThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.cart = state.cart.filter(item => item._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteCartProductThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete product from cart';
      })
      // Handle updateCartProductQuantity
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