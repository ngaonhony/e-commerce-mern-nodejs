import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const OrderScreen = () => {
    return (
        <View className="p-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Text className="text-blue-500">Trở về</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold mb-6 text-center">Lịch sử đơn hàng</Text>
        </View>
    );
};

export default OrderScreen;