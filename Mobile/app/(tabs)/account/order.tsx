import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, FlatList, ActivityIndicator, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { fetchUserOrders } from '../../../store/userSlice';
import { Order } from '../../../store/userSlice';
import { useRouter } from 'expo-router';

const OrderScreen = () => {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const { orders = [], loading, error } = useSelector((state: RootState) => state.user);

    // State for modal visibility and selected order
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        dispatch(fetchUserOrders());
    }, [dispatch]);

    const openOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const closeOrderModal = () => {
        setModalVisible(false);
        setSelectedOrder(null);
    };

    const renderOrderItem = ({ item }: { item: Order }) => (
        <TouchableOpacity
            onPress={() => openOrderModal(item)}
            className="p-4 mb-4 bg-white rounded-lg border-2 mt-2"
        >
            <Text className="font-bold text-lg">Order ID: {item._id}</Text>
            <Text>Total Price: ${item.totalPrice}</Text>
            <Text>Total Amount after Discount: ${item.totalPriceAfterDiscount}</Text>
            <Text>Status: {item.orderStatus}</Text>
            <Text>Paid At: {new Date(item.paidAt).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );

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

            {/* Modal for Order Details */}
            {selectedOrder && (
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={closeOrderModal}
                >
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                        <View className="bg-white rounded-lg p-6 w-4/5">
                            <Text className="text-lg font-bold mb-2">Order Items</Text>

                            <View className="bg-gray-800 p-2 rounded mt-2">
                                {selectedOrder.orderItems.map((i, index) => (
                                    <View key={index} className="py-2">
                                        <Text className="text-white">Product: {i.product.title}</Text>
                                        <Text className="text-white">Quantity: {i.quantity}</Text>
                                        <Text className="text-white">Price: ${i.price}</Text>
                                        <View className="w-6 h-6 rounded-full mt-1" style={{ backgroundColor: i.color }} />
                                    </View>
                                ))}
                            </View>

                            <TouchableOpacity onPress={closeOrderModal} className="mt-4">
                                <Text className="text-blue-500">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default OrderScreen;
