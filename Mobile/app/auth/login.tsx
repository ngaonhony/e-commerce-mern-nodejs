import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      await login({ email, password });
      router.replace('/');
    } catch (error) {
      setErrorMessage('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <View className="flex-1 p-4">
      <Text className="text-4xl my-4 text-center">Đăng nhập</Text>
      {errorMessage ? <Text className="text-red-500">{errorMessage}</Text> : null}
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
      <Button title="Đăng nhập" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text className="mt-4 text-blue-500 text-center">Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
  