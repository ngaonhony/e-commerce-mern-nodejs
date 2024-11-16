// CheckoutScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  fetchUserCart,
  createOrder,
  clearCart,
  resetOrderState,
} from '../../../store/userSlice';

interface CartItem {
  _id: string;
  productId: {
    _id: string;
    title: string;
    brand: string;
    category: string;
    price: number;
    quantity: number;
    images: { url: string }[];
  };
  quantity: number;
  price: number;
  color: {
    title: string;
  };
}

const shippingSchema = yup.object().shape({
  firstname: yup.string().required('First Name is Required'),
  lastname: yup.string().required('Last Name is Required'),
  address: yup.string().required('Address is Required'),
  pincode: yup.string().required('Pincode is Required'),
});

interface ShippingInfo {
  firstname: string;
  lastname: string;
  address: string;
  pincode: string;
}

const CheckoutScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const userCartState = useAppSelector((state: RootState) => state.user.cart);
  const userState = useAppSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  useEffect(() => {
    let sum = 0;
    userCartState.forEach((item: CartItem) => {
      sum += Number(item.quantity) * item.price;
    });
    setTotalAmount(sum);
  }, [userCartState]);

  useEffect(() => {
    if (userState.isSuccess) {
      dispatch(clearCart());
      dispatch(resetOrderState());
      // Notify the user and navigate as needed
      Alert.alert('Order placed successfully');
      navigation.navigate('Home' as never); // Adjust navigation as per your app structure
    }
  }, [userState.isSuccess, navigation, dispatch]);

  const formik = useFormik<ShippingInfo>({
    initialValues: {
      firstname: '',
      lastname: '',
      address: '',
      pincode: '',
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      handleOrder(values);
    },
  });

  const handleOrder = (shippingInfo: ShippingInfo) => {
    const orderItems = userCartState.map((item: CartItem) => ({
      product: item.productId._id,
      quantity: item.quantity,
      color: item.color.title,
      price: item.price,
    }));

    const orderData = {
      shippingInfo,
      orderItems,
      totalPrice: totalAmount,
    };

    // Optional: Validate orderData before dispatching
    console.log('Order Data to Dispatch:', orderData);
    dispatch(createOrder(orderData));
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    if (!item.productId || !item.productId.images || !item.productId.images[0]) {
      return null;
    }

    return (
      <View className="flex-row bg-white mb-3 rounded-lg overflow-hidden shadow-md">
        <Image
          source={{ uri: item.productId.images[0].url }}
          className="w-24 h-24"
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-sm text-gray-500">{item.productId.brand}</Text>
            <Text className="text-base font-bold text-gray-800">{item.productId.title}</Text>
          </View>
          <View>
            <Text className="text-sm text-gray-600">Quantity: {item.quantity}</Text>
            <Text className="text-sm text-gray-600">Price: Rs. {item.price}</Text>
          </View>
          <View className="mt-2">
            <Text className="text-lg font-bold text-gray-800">
              Total: Rs. {item.quantity * item.price}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Header Component for FlatList
  const ListHeader = () => (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="flex-row items-center mb-5"
      >
        <Ionicons name="arrow-back" size={24} color="#1e90ff" />
        <Text className="text-blue-500 ml-2 text-base">Back</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-gray-800 mb-5">Checkout</Text>
    </View>
  );

  // Footer Component for FlatList
  const ListFooter = () => (
    <View>
      <View className="bg-white p-4 rounded-lg mt-5 shadow-md">
        <Text className="text-xl font-bold text-gray-800 mb-4">Shipping Information</Text>

        <TextInput
          placeholder="First Name"
          className="border border-gray-300 rounded-md mb-2 p-2"
          onChangeText={formik.handleChange('firstname')}
          onBlur={formik.handleBlur('firstname')}
          value={formik.values.firstname}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <Text className="text-red-500 text-xs mb-2">{formik.errors.firstname}</Text>
        )}

        <TextInput
          placeholder="Last Name"
          className="border border-gray-300 rounded-md mb-2 p-2"
          onChangeText={formik.handleChange('lastname')}
          onBlur={formik.handleBlur('lastname')}
          value={formik.values.lastname}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <Text className="text-red-500 text-xs mb-2">{formik.errors.lastname}</Text>
        )}

        <TextInput
          placeholder="Address"
          className="border border-gray-300 rounded-md mb-2 p-2"
          onChangeText={formik.handleChange('address')}
          onBlur={formik.handleBlur('address')}
          value={formik.values.address}
        />
        {formik.touched.address && formik.errors.address && (
          <Text className="text-red-500 text-xs mb-2">{formik.errors.address}</Text>
        )}

        <TextInput
          placeholder="Pincode"
          className="border border-gray-300 rounded-md mb-2 p-2"
          onChangeText={formik.handleChange('pincode')}
          onBlur={formik.handleBlur('pincode')}
          value={formik.values.pincode}
          keyboardType="numeric"
        />
        {formik.touched.pincode && formik.errors.pincode && (
          <Text className="text-red-500 text-xs mb-2">{formik.errors.pincode}</Text>
        )}
      </View>

      <View className="bg-white p-4 rounded-lg mt-5 shadow-md mb-5">
        <Text className="text-xl font-bold text-gray-800 mb-4">Order Summary</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-base text-gray-600">Subtotal</Text>
          <Text className="text-base font-bold text-gray-800">Rs. {totalAmount}</Text>
        </View>
        <Text className="text-xs text-gray-500 mb-4">
          Taxes and shipping calculated at checkout
        </Text>

        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          className="bg-blue-500 py-3 rounded-lg items-center"
        >
          <Text className="text-white text-lg font-bold">Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        contentContainerStyle={{ padding: 16 }}
        data={userCartState}
        renderItem={renderCartItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={() => (
          <View className="items-center">
            <Text className="text-lg text-gray-500">Your cart is empty</Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default CheckoutScreen;
