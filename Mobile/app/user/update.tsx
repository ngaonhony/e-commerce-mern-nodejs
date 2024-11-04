import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../services/api/userService';
import { useRouter } from 'expo-router';

const UpdateProfileScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  const [firstname, setFirstname] = useState(user?.userData?.firstname || '');
  const [lastname, setLastname] = useState(user?.userData?.lastname || '');
  const [mobile, setMobile] = useState(user?.userData?.mobile || '');
  const router = useRouter();

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { firstname, lastname, mobile };
      const response = await updateUserProfile(updatedData);
      // Cập nhật thông tin người dùng trong context
      setUser((prevUser: any) => ({
        ...prevUser,
        userData: {
          ...prevUser.userData,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          mobile: response.data.mobile,
        },
      }));
      Alert.alert('Thông báo', 'Cập nhật thông tin thành công', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Lỗi', 'Cập nhật thông tin thất bại');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.select({ ios: 'padding' })}>
      <View style={styles.form}>
        <Text style={styles.title}>Cập nhật thông tin</Text>
        <TextInput
          placeholder="Họ"
          value={firstname}
          onChangeText={setFirstname}
          style={styles.input}
        />
        <TextInput
          placeholder="Tên"
          value={lastname}
          onChangeText={setLastname}
          style={styles.input}
        />
        <TextInput
          placeholder="Số điện thoại"
          value={mobile}
          onChangeText={setMobile}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  form: {
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
