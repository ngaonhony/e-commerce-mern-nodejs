// app/(tabs)/_layout.tsx
import { Tabs, Redirect } from 'expo-router';
import React, { useContext } from 'react';

import { TabBarIcon } from '../../components/navigation/TabBarIcon'; // Điều chỉnh đường dẫn import nếu cần
import { Colors } from '../../constants/Colors'; // Điều chỉnh đường dẫn import nếu cần
import { useColorScheme } from '../../hooks/useColorScheme'; // Điều chỉnh đường dẫn import nếu cần
import { AuthContext } from '../../contexts/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    // Hiển thị màn hình chờ hoặc gì đó khi đang tải trạng thái xác thực
    return null;
  }

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, điều hướng đến trang đăng nhập
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: 'Blog',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
