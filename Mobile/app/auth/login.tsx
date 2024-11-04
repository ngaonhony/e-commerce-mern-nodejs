import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  