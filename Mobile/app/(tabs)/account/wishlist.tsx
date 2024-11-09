import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const WishlistScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
      className="flex-1 bg-white"
    >
      <View className="flex-1 p-4">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-blue-500">Trở về</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold mb-6 text-center">Wishlist</Text>
        {/* Nội dung Wishlist */}
      </View>
    </SafeAreaView>
  );
};

export default WishlistScreen;