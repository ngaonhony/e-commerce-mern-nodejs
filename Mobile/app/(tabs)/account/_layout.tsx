import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';

const AccountLayout = () => {
  return (

    <View className="flex-1">
      <Slot />
    </View>
  );
};

export default AccountLayout;