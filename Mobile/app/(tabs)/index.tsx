// app/tabs/HomeScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/productSlice';
import { RootState, AppDispatch } from '../../store';
import Banner1 from '@/components/Banner1';
import ProductGrid from '@/components/ProductGrid';

export default function HomeScreen() {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products]);

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
    <ScrollView className='bg-white'>
      <Banner1></Banner1>
      <ProductGrid tag="feature" title="Featured Products" />
      <ProductGrid tag="popular" title="Popular Products" />
    </ScrollView>
  );
}
