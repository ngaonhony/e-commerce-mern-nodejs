import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchUserOrders } from '../../../store/userSlice';
import { Order } from '../../../store/userSlice';

const OrderScreen = () => {
    const dispatch: AppDispatch = useDispatch();

    // Destructuring orders, loading, and error from the user state
    const { orders = [], loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const renderOrderItem = ({ item }: { item: Order }) => {
        return (
            <TouchableOpacity
                onPress={() => router.push(`/`)}
                className="p-4 mb-4 bg-white rounded-lg border-2 mt-2"
            >
                <Text className="font-bold text-lg">Order ID: {item._id}</Text>
                <Text>Total Price: ${item.totalPrice}</Text>
                <Text>Status: {item.orderStatus}</Text>
                <Text>Paid At: {new Date(item.paidAt).toLocaleDateString()}</Text>
            </TouchableOpacity>
        );
    };
    

    return (
        <View className="flex-1 p-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Text className="text-blue-500">Trở về</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold mb-6 text-center">Lịch sử đơn hàng</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#ffffff" />
            ) : error ? (
                <Text className="text-center text-red-500">{error}</Text>
            ) : orders.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500 text-lg">Empty</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderOrderItem}
                />
            )}
        </View>
    );
};

export default OrderScreen;
