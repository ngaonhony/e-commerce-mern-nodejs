import React from 'react';
import { SafeAreaView, View, Platform, StatusBar } from 'react-native';
import { Slot } from 'expo-router';

const AccountLayout = () => {
  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
};

export default AccountLayout;