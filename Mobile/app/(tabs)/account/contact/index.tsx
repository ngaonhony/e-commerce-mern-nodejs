import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { submitEnquiry, resetEnquiryState } from '../../../../store/enquirySlice';
import { RootState, AppDispatch } from '../../../../store';

const ContactScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, success } = useSelector((state: RootState) => state.enquiry);
  const { user } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (user) {
      const fullName = `${user.userData.firstname} ${user.userData.lastname}`;
      setName(fullName);
      setEmail(user.userData.email);
      setMobile(user.userData.mobile);
    }
  }, [user]);

  useEffect(() => {
    if (success) {
      Alert.alert('Thành công', 'Gửi liên hệ thành công!', [
        {
          text: 'OK',
          onPress: () => {
            dispatch(resetEnquiryState());
            router.back();
          },
        },
      ]);
    }
  }, [success, dispatch, router]);

  useEffect(() => {
    if (error) {
      Alert.alert('Lỗi', error, [
        {
          text: 'OK',
          onPress: () => dispatch(resetEnquiryState()),
        },
      ]);
    }
  }, [error, dispatch]);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !mobile.trim() || !comment.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hợp lệ từ 10 đến 15 chữ số.');
      return;
    }

    const enquiryData = {
      name,
      email,
      mobile,
      comment,
    };

    dispatch(submitEnquiry(enquiryData));
  };

  return (

    <View className="flex-1 p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-500">Trở về</Text>
      </TouchableOpacity>
      <Text className="text-2xl font-bold mb-6 text-center">Liên Hệ</Text>

      <Text className="text-lg text-gray-700 mb-2">Tên</Text>
      <TextInput
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
        className="h-12 border border-gray-300 mb-4 px-3 rounded-lg bg-gray-100"
        accessibilityLabel="Tên"
        accessibilityHint="Nhập tên của bạn vào đây"
      />

      <Text className="text-lg text-gray-700 mb-2">Email</Text>
      <TextInput
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        className="h-12 border border-gray-300 mb-4 px-3 rounded-lg bg-gray-100"
        keyboardType="email-address"
        autoCapitalize="none"
        accessibilityLabel="Email"
        accessibilityHint="Nhập địa chỉ email của bạn vào đây"
      />

      <Text className="text-lg text-gray-700 mb-2">Số Điện Thoại</Text>
      <TextInput
        placeholder="Nhập số điện thoại của bạn"
        value={mobile}
        onChangeText={setMobile}
        className="h-12 border border-gray-300 mb-4 px-3 rounded-lg bg-gray-100"
        keyboardType="phone-pad"
        accessibilityLabel="Số Điện Thoại"
        accessibilityHint="Nhập số điện thoại của bạn vào đây"
      />

      <Text className="text-lg text-gray-700 mb-2">Nội Dung</Text>
      <TextInput
        placeholder="Nhập nội dung bạn muốn liên hệ"
        value={comment}
        onChangeText={setComment}
        className="h-32 border border-gray-300 mb-6 px-3 rounded-lg bg-gray-100 text-base text-gray-800"
        multiline
        numberOfLines={4}
        accessibilityLabel="Nội Dung"
        accessibilityHint="Nhập nội dung liên hệ của bạn vào đây"
      />

      <TouchableOpacity
        className={`bg-blue-500 py-3 rounded-lg items-center ${loading ? 'bg-blue-300' : ''}`}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Gửi Liên Hệ"
        accessibilityHint="Nhấn để gửi thông tin liên hệ"
      >
        <Text className="text-white text-lg">
          {loading ? 'Đang gửi...' : 'Gửi Liên Hệ'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactScreen;
