import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, ActivityIndicator } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { getOrderHistory } from '../../services/api/userService';

const AccountScreen = () => {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    // Gọi API để lấy lịch sử đơn hàng
    const fetchOrderHistory = async () => {
      try {
        const response = await getOrderHistory();
        setOrderHistory(response.data.orders);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleUpdateProfile = () => {
    router.push('/user/update');
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text>Bạn cần đăng nhập để xem thông tin tài khoản.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Thông tin tài khoản */}
      <View style={styles.profileContainer}>
        <Text style={styles.name}>
          {user.userData.firstname} {user.userData.lastname}
        </Text>
        <Text style={styles.email}>{user.userData.email}</Text>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
      </View>
     

      {/* Nút đăng xuất */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  orderHistoryContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
  },
  orderId: {
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
