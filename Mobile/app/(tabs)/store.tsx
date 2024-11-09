// app/(tabs)/store.tsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchProducts, fetchCategories } from '../../store/productSlice';
import { fetchBrands } from '../../store/brandSlice';

export default function StoreScreen() {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error, categories } = useSelector((state: RootState) => state.product);
  const { brands } = useSelector((state: RootState) => state.brand);

  useEffect(() => {
    dispatch(fetchProducts() as any);
    dispatch(fetchCategories() as any);
    dispatch(fetchBrands() as any);
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    }} className='flex-1 bg-white'>
      <View className="p-4">
        <Text className="text-xl font-bold">Categories</Text>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id ? item.id.toString() : 'defaultKey'}
          horizontal
          renderItem={({ item }) => (
            <View className="mr-4">
              <Text className="text-lg font-semibold">{item.title}</Text>
            </View>
          )}
        />
      </View>

      <View className="p-4">
        <Text className="text-xl font-bold">Brands</Text>
        <FlatList
          data={brands}
          keyExtractor={(item) => item.id ? item.id.toString() : 'defaultKey'}
          horizontal
          renderItem={({ item }) => (
            <View className="mr-4">
              <Text className="text-lg font-semibold">{item.title}</Text>
            </View>
          )}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id ? item.id.toString() : 'defaultKey'}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-neutral-950">{item.title}</Text>
            <Text className="text-blue-500 font-bold">${item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
