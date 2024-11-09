import React, { useState } from 'react';
import { View, TextInput, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../../store';
import { logout } from '../../../store/authSlice';
import { updateProfile } from '../../../store/userSlice';

const UpdateProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const [firstname, setFirstname] = useState(user?.userData?.firstname || '');
  const [lastname, setLastname] = useState(user?.userData?.lastname || '');
  const [mobile, setMobile] = useState(user?.userData?.mobile || '');

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { firstname, lastname, mobile };
      await dispatch(updateProfile(updatedData)).unwrap();
      Alert.alert('Thông báo', 'Cập nhật thông tin thành công', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err as string || 'Cập nhật thông tin thất bại');
    }
  };

  const handleLogout = () => {
    dispatch(logout()).then(() => {
      router.push('/auth/login');
    });
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Bạn cần đăng nhập để xem thông tin tài khoản.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView className="flex-1 p-4" behavior={Platform.select({ ios: 'padding' })}>
        <View className="mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-blue-500">Trở về</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold mb-6 text-center">Cập nhật thông tin</Text>
          <TextInput
            placeholder="Họ"
            value={firstname}
            onChangeText={setFirstname}
            className="h-12 border border-gray-300 mb-3 px-3 rounded-lg"
          />
          <TextInput
            placeholder="Tên"
            value={lastname}
            onChangeText={setLastname}
            className="h-12 border border-gray-300 mb-3 px-3 rounded-lg"
          />
          <TextInput
            placeholder="Số điện thoại"
            value={mobile}
            onChangeText={setMobile}
            className="h-12 border border-gray-300 mb-3 px-3 rounded-lg"
            keyboardType="phone-pad"
          />
        </View>
        <View>
          <TouchableOpacity
            className="bg-blue-500 py-3 rounded-lg items-center mt-2"
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text className="text-white text-lg">Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-600 py-3 rounded-lg mt-4 items-center"
            onPress={handleLogout}
          >
            <Text className="text-white text-base">Đăng xuất</Text>
          </TouchableOpacity>
          {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UpdateProfileScreen;