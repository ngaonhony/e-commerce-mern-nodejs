import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/productSlice';
import { RootState } from '../../store';
import Banner1 from '@/components/Banner1';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error fetching products: {error}</Text>
      </View>
    );
  }

  return (
    <View >
      <Banner1 />
    </View>
  );
}