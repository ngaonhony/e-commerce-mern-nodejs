import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Platform, SafeAreaView, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../store';

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await dispatch(login({ email, password })).unwrap();
      router.replace('/');
    } catch (err) {
      // Optionally, handle additional error logic here
      console.error('Login failed:', err);
    }
  };

  return (
    <SafeAreaView style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }} className='flex-1 bg-white'>
      <View className="flex-1 p-4">
        <Text className="text-4xl my-4 text-center">Đăng nhập</Text>
      {error ? <Text className="text-red-500">{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="h-12 border border-gray-300 mb-3 px-2 rounded"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        className="h-12 border border-gray-300 mb-3 px-2 rounded"
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} disabled={loading} />
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text className="mt-4 text-blue-500 text-center">Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;