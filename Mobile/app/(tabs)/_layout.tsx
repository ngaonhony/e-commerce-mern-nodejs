// app/(tabs)/_layout.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Redirect } from 'expo-router';

import { TabBarIcon } from '../../components/navigation/TabBarIcon';
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { RootState } from '../../store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    // You can render a loading spinner or any placeholder here
    return null;
  }

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to the login screen
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
