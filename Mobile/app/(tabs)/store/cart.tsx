import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

const CartScreen = () => {

    return (
        <View className="p-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Text className="text-blue-500">Trở về</Text>
            </TouchableOpacity>
            <Text>Cart Screen</Text>
        </View>
    );
};

export default CartScreen;