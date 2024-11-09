// CartScreen.tsx

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store'; // Adjust the path based on your project structure
import { fetchUserCart, deleteCartProductThunk, updateCartProductQuantity } from '../../../store/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

const CartScreen: React.FC = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [totalAmount, setTotalAmount] = useState<number>(0);

    const userCartState = useSelector((state: RootState) => state.user.cart);

    useEffect(() => {
        dispatch(fetchUserCart() as any);
    }, [dispatch]);

    useEffect(() => {
        let sum = 0;
        userCartState.forEach((item: CartItem) => {
            sum += Number(item.quantity) * item.price;
        });
        setTotalAmount(sum);
    }, [userCartState]);

    const handleDeleteProduct = (cartItemId: string) => {
        dispatch(deleteCartProductThunk(cartItemId) as any);
    };

    const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
        if (newQuantity > 0) {
            dispatch(updateCartProductQuantity({ cartItemId, newQuantity }) as any);
        } else {
            handleDeleteProduct(cartItemId);
        }
    };

    const renderCartItem = ({ item }: { item: CartItem }) => {
        if (!item.productId || !item.productId.images || !item.productId.images[0]) {
            return null; // Skip rendering if essential data is missing
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
                        <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-gray-600 w-24">Quantity:</Text>
                            <Text className="text-sm text-gray-800">{item.quantity}</Text>
                            <TouchableOpacity onPress={() => handleUpdateQuantity(item._id, item.quantity + 1)}>
                                <Ionicons name="add-circle-outline" size={20} color="#1e90ff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUpdateQuantity(item._id, item.quantity - 1)}>
                                <Ionicons name="remove-circle-outline" size={20} color="#1e90ff" />
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-gray-600 w-24">Category:</Text>
                            <Text className="text-sm text-gray-800">{item.productId.category}</Text>
                        </View>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-gray-600 w-24">Color:</Text>
                            <View
                                className="w-4 h-4 rounded-full border border-gray-300 ml-2"
                                style={{ backgroundColor: item.color.title || '#000' }}
                            />
                        </View>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-sm text-gray-600 w-24">Available Stock:</Text>
                            <Text className="text-sm text-gray-800">{item.productId.quantity}</Text>
                        </View>
                    </View>
                    <View className="mt-2">
                        <Text className="text-lg font-bold text-gray-800">Rs. {item.quantity * item.price}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
                        <Ionicons name="trash-outline" size={24} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const ListHeader = () => (
        <View className="mb-4">
            <TouchableOpacity onPress={() => navigation.goBack()} className="flex-row items-center">
                <Ionicons name="arrow-back" size={24} color="#1e90ff" />
                <Text className="text-blue-500 ml-2 text-base">Back</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold mt-2 text-gray-800">Cart</Text>
        </View>
    );

    const ListFooter = () => (
        <View className="p-4 bg-white rounded-lg shadow-md mt-4">
            <Text className="text-xl font-bold text-gray-800 mb-4">Summary</Text>
            <View className="flex-row justify-between mb-2">
                <Text className="text-base text-gray-600">Subtotal</Text>
                <Text className="text-base font-bold text-gray-800">Rs. {totalAmount}</Text>
            </View>
            <Text className="text-xs text-gray-500 mb-4">
                Taxes and shipping calculated at checkout
            </Text>
            <TouchableOpacity
                className="bg-blue-500 py-3 rounded-lg items-center"
                // onPress={() => navigation.navigate('Checkout')}
            >
                <Text className="text-white text-lg font-bold">Checkout</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            className="flex-1 p-4 bg-gray-100"
            data={userCartState}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            ListHeaderComponent={ListHeader}
            ListFooterComponent={userCartState.length > 0 ? ListFooter : null}
            ListEmptyComponent={() => (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg text-gray-500">Your cart is empty</Text>
                </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
};

export default CartScreen;