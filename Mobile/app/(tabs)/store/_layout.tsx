import React from 'react';
import { View } from 'react-native';
import { Slot } from 'expo-router';

const StoreLayout = () => {
  return (
   
      <View className="flex-1">
        <Slot />
      </View>
  );
};

export default StoreLayout;