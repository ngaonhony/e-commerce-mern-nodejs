import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '../../../store';

const AccountScreen = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleUpdateProfile = () => {
    router.push('/(tabs)/account/update');
  };

  const handleContact = () => {
    router.push('/(tabs)/account/contact');
  };

  const handleWishlist = () => {
    router.push('/(tabs)/account/wishlist');
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Bạn cần đăng nhập để xem thông tin tài khoản.</Text>
      </View>
    );
  }

  return (

    <View className="flex-1 p-4 justify-between">
      <View>
        <View className="items-center mb-4">
          <Text className="text-lg font-bold">
            Xin chào {user.userData.lastname} {user.userData.firstname}
          </Text>
        </View>
        <TouchableOpacity onPress={handleUpdateProfile} className="py-3 border-b border-gray-300">
          <Text className="text-base">Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleWishlist} className="py-3 border-b border-gray-300">
          <Text className="text-base">Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleContact} className="py-3 border-b border-gray-300">
          <Text className="text-base">Contact Us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountScreen;