import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/authSlice';
import { useRouter } from 'expo-router';
import { RootState, AppDispatch } from '../../store';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { error, loading } = useSelector((state: RootState) => state.auth);

  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      await dispatch(register(userData)).unwrap();
      router.replace('/auth/login');
    } catch (error: any) {
      setErrorMessage(error || 'Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }} className='flex-1 bg-white'>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>
        {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
        <TextInput
          placeholder="Họ"
          value={userData.firstname}
          onChangeText={(text) => setUserData({ ...userData, firstname: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Tên"
          value={userData.lastname}
          onChangeText={(text) => setUserData({ ...userData, lastname: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Số điện thoại"
          value={userData.mobile}
          onChangeText={(text) => setUserData({ ...userData, mobile: text })}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Mật khẩu"
          value={userData.password}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
          style={styles.input}
          secureTextEntry
        />
        <Button title="Đăng ký" onPress={handleRegister} disabled={loading} />
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
        </TouchableOpacity>
        {error && <Text style={{ color: 'red', marginTop: 8 }}>{error}</Text>}
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  linkText: {
    marginTop: 16,
    color: 'blue',
    textAlign: 'center',
  },
});