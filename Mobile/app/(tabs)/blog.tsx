// app/(tabs)/blog.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BlogScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blog Screen</Text>
      {/* Nội dung khác */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
