import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserWishlist } from '../../../store/userSlice';
import { RootState, AppDispatch } from '../../../store';
import WishlistItem from '../../../components/WishlistItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Wishlist = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { wishlist, loading, error } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(fetchUserWishlist());
    }, [dispatch]);

    const renderItem = ({ item }: { item: any }) => (
        <WishlistItem item={item} />
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-red-500">{error}</Text>
            </View>
        );
    }

    if (wishlist.length === 0) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-500">Your wishlist is empty.</Text>
            </View>
        );
    }

    return (
        <View className="p-4">
            <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <Text className="text-blue-500">Trở về</Text>
            </TouchableOpacity>
            <FlatList
                data={wishlist}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16 }}
            />
        </View>
    );
};

export default Wishlist;