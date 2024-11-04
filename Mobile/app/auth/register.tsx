import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
  const { register } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
    password: '',
  });
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      await register(userData);
      router.replace('/auth/login');
    } catch (error) {
      setErrorMessage('Đăng ký thất bại. Vui lòng thử lại.');
    }
  };

  return (
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
      <Button title="Đăng ký" onPress={handleRegister} />
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
      </TouchableOpacity>
    </View>
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
  