// src/screens/StoreScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../store/productSlice';
import { RootState, AppDispatch } from '../../../store';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  quantity: number;
  sold: number;
  images: { public_id: string; url: string; _id: string }[];
  color: string[];
  tags: string[];
  totalrating: number;
  ratings: { star: number; comment: string; postedby: string; _id: string }[];
  createdAt: string;
  updatedAt: string;
}

const StoreScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.product
  );

  // Filter States
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sort, setSort] = useState<string>('title'); // Default sort

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modal visibility
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products) {
      const newBrands = products.map((product) => product.brand);
      const newCategories = products.map((product) => product.category);
      const newTags = products.flatMap((product) => product.tags);

      setBrands([...new Set(newBrands)]);
      setCategories([...new Set(newCategories)]);
      setTags([...new Set(newTags)]);
    }
  }, [products]);

  // Apply filters and sorting
  const applyFilters = () => {
    let filteredProducts = [...products];

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedBrand) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand === selectedBrand
      );
    }

    if (selectedTag) {
      filteredProducts = filteredProducts.filter((product) =>
        product.tags.includes(selectedTag)
      );
    }

    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(minPrice)
      );
    }

    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(maxPrice)
      );
    }

    // Apply sorting
    if (sort) {
      const sortKey = sort.replace('-', '');
      const sortOrder = sort.startsWith('-') ? -1 : 1;

      filteredProducts.sort((a, b) => {
        if (a[sortKey as keyof Product] < b[sortKey as keyof Product]) return -1 * sortOrder;
        if (a[sortKey as keyof Product] > b[sortKey as keyof Product]) return 1 * sortOrder;
        return 0;
      });
    }

    setTotalPages(Math.ceil(filteredProducts.length / pageSize));
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [
    selectedCategory,
    selectedBrand,
    selectedTag,
    minPrice,
    maxPrice,
    sort,
    products,
  ]);

  // Handle pagination
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Get paginated products
  const paginatedProducts = products.slice(0, currentPage * pageSize);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="flex-1 bg-white m-2 p-4 rounded-lg shadow"
      // onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image
        source={{ uri: item.images[0]?.url }}
        className="w-full h-40 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-lg font-semibold mt-2" numberOfLines={2}>
        {item.title}
      </Text>
      <Text className="text-gray-600 mt-1">${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold">Our Store</Text>
        <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sorting */}
      <View className="flex-row items-center mb-4">
        <Text className="mr-2">Sort By:</Text>
        <RNPickerSelect
          onValueChange={(value) => setSort(value)}
          items={[
            { label: 'Alphabetically, A-Z', value: 'title' },
            { label: 'Alphabetically, Z-A', value: '-title' },
            { label: 'Price, low to high', value: 'price' },
            { label: 'Price, high to low', value: '-price' },
            { label: 'Date, old to new', value: 'createdAt' },
            { label: 'Date, new to old', value: '-createdAt' },
          ]}
          style={{
            inputIOS: {
              fontSize: 16,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              color: 'black',
              paddingRight: 30, // to ensure the text is never behind the icon
            },
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 0.5,
              borderColor: '#ccc',
              borderRadius: 5,
              color: 'black',
              paddingRight: 30, // to ensure the text is never behind the icon
            },
          }}
          value={sort}
          placeholder={{}}
        />
      </View>

      {/* Product List */}
      {loading ? (
        <Text className="text-center mt-4">Loading...</Text>
      ) : error ? (
        <Text className="text-center mt-4 text-red-500">{error}</Text>
      ) : (
        <FlatList
          data={paginatedProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            currentPage < totalPages ? (
              <Text className="text-center mt-4">Loading more...</Text>
            ) : null
          }
        />
      )}

      {/* Floating Cart Button */}
      <TouchableOpacity className="absolute w-16 h-16 p-4 items-center justify-center bg-red-500 rounded-full right-5 bottom-5 shadow-lg">
        <Ionicons name="cart" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <ScrollView className="flex-1 p-6 bg-white">
          <Text className="text-2xl font-bold mb-4 text-center">Filter By</Text>

          {/* Categories */}
          <Text className="text-xl font-semibold mb-2">Categories</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              className="py-2"
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                className={`text-lg ${
                  selectedCategory === category ? 'text-blue-500 font-bold' : 'text-gray-700'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Brands */}
          <Text className="text-xl font-semibold mt-4 mb-2">Brands</Text>
          {brands.map((brand) => (
            <TouchableOpacity
              key={brand}
              className="py-2"
              onPress={() => setSelectedBrand(brand)}
            >
              <Text
                className={`text-lg ${
                  selectedBrand === brand ? 'text-blue-500 font-bold' : 'text-gray-700'
                }`}
              >
                {brand}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Tags */}
          <Text className="text-xl font-semibold mt-4 mb-2">Tags</Text>
          <View className="flex-row flex-wrap">
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                className={`mr-2 mb-2 px-3 py-1 rounded-full ${
                  selectedTag === tag ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onPress={() => setSelectedTag(tag)}
              >
                <Text
                  className={`text-sm ${
                    selectedTag === tag ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text className="text-xl font-semibold mt-4 mb-2">Price</Text>
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 border border-gray-300 rounded px-3 py-2 mr-2"
              placeholder="Min"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={(text) => setMinPrice(text)}
            />
            <Text className="text-lg">to</Text>
            <TextInput
              className="flex-1 border border-gray-300 rounded px-3 py-2 ml-2"
              placeholder="Max"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={(text) => setMaxPrice(text)}
            />
          </View>

          {/* Apply and Reset Buttons */}
          <View className="flex-row justify-around mt-6">
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded"
              onPress={() => {
                applyFilters();
                setIsFilterModalVisible(false);
              }}
            >
              <Text className="text-white text-lg">Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-500 px-6 py-3 rounded"
              onPress={() => {
                setSelectedCategory(null);
                setSelectedBrand(null);
                setSelectedTag(null);
                setMinPrice('');
                setMaxPrice('');
                setSort('title');
              }}
            >
              <Text className="text-white text-lg">Reset Filters</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

export default StoreScreen;
