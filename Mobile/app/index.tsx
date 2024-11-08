import React from 'react';
import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { RootState } from '../store';

export default function Index() {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}