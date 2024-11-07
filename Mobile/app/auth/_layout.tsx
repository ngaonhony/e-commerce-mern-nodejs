// app/auth/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import "../../global.css";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
