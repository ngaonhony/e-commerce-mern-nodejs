// src/components/ProductGrid.tsx

import React, { useMemo } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";  
import { RootState } from "../store";

interface Product {
  _id: string;
  title: string;
  brand: string;
  tags: string[];
  totalrating: number;
  price: number;
  images: { url: string }[];
}

interface ProductGridProps {
  tag: string;
  title: string;
}

// Helper function to get a random subset of products
const getRandomProducts = (products: Product[], count: number) => {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const ProductGrid: React.FC<ProductGridProps> = ({ tag, title }) => {
  const router = useRouter();  // Initialize router
  const productState = useSelector((state: RootState) => state.product.products);

  // Get a random subset of products (limited to 10)
  const randomProducts = useMemo(() => {
    // Filter products by tag and then select a random 10 from the filtered results
    const filteredProducts = productState.filter((product) => product.tags.includes(tag));
    return getRandomProducts(filteredProducts, 10);
  }, [productState, tag]);

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={{ width: 200 }} // Set a fixed width for each item
      className="bg-white m-2 p-4 rounded-lg shadow"
      onPress={() => router.push(`/store/product/${item._id}`)} // Use router.push here
    >
      <Image
        source={{ uri: item.images[0]?.url }}
        className="w-40 h-40 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-lg font-semibold mt-2" numberOfLines={2}>
        {item.title.length > 50 ? item.title.substr(0, 50) + "..." : item.title}
      </Text>
      <Text className="text-gray-600 mt-1">${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View className="">
      <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>{title}</Text>
      <FlatList
        data={randomProducts} // Use the randomly selected products
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        horizontal // Enable horizontal scrolling
        showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator if desired
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20, paddingTop: 10 }}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default ProductGrid;
