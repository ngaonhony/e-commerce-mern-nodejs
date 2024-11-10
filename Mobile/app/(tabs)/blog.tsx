import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView, Image, ImageBackground, Platform, StatusBar, SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBlogs, fetchAllCategories, fetchBlog } from "../../store/blogSlice";
import { RootState, AppDispatch } from '../../store';
import { Ionicons } from '@expo/vector-icons';

const BlogScreen = () => {
  const dispatch: AppDispatch = useDispatch();
  const blogState = useSelector((state: RootState) => state.blog.blogs);
  const categories = useSelector((state: RootState) => state.blog.categories);
  const selectedBlog = useSelector((state: RootState) => state.blog.selectedBlog);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllBlogs());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const openBlogDetail = (id: string) => {
    dispatch(fetchBlog(id));
    setModalVisible(true);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  // Find the title of the selected category based on the selectedCategory ID
  const selectedCategoryTitle = categories.find(cat => cat._id === selectedCategory)?.title;

  const filteredBlogs = selectedCategoryTitle
    ? blogState.filter(blog => blog.category === selectedCategoryTitle)  // Match by title
    : blogState;

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
      className="flex-1 bg-white"
    >
      <View className="flex-1 p-2">
        {/* Categories List */}
        <View className="mb-2">
          <Text className="text-xl font-semibold mb-2">Categories</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item._id}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`py-2 px-4 mr-2 rounded-lg ${selectedCategory === item._id ? 'bg-slate-400' : 'bg-white'}`}
                style={{ height: 30 }}
                onPress={() => toggleCategory(item._id)}
              >
                <Text className="text-gray-700">{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Blog List */}
        <View>
          <Text className="text-xl font-semibold mb-2">Blog List</Text>
          <FlatList
            data={filteredBlogs}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-1 m-2 overflow-hidden rounded-lg shadow-lg"
                onPress={() => openBlogDetail(item._id)}
              >
                <ImageBackground
                  source={{ uri: item?.images[0]?.url || "https://via.placeholder.com/400x300" }}
                  className="h-52 w-full rounded-lg"
                >
                  <View
                    className="absolute inset-0 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <Text className="text-2xl font-semibold text-white px-4">{item?.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Blog Detail Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <SafeAreaView
            style={{
              flex: 1,
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            }}
          >
            {selectedBlog ? (
              <ScrollView className="p-5">
                <TouchableOpacity onPress={() => setModalVisible(false)} className="absolute top-5 right-5 z-10">
                  <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>
                <Text className="text-3xl font-bold text-gray-800 mb-4">{selectedBlog.title}</Text>
                <Image
                  source={{ uri: selectedBlog.images[0]?.url }}
                  className="w-full h-64 rounded-lg mb-4"
                  resizeMode="cover"
                />
                <Text className="text-gray-700 text-base leading-6">{selectedBlog.description}</Text>
              </ScrollView>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-lg font-semibold">Blog not found</Text>
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default BlogScreen;
