// app/(tabs)/store/product/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import {
  getProductById,
  getProducts,
  addToWishlist as addToWishlistAPI,
  addRating as addRatingAPI,
} from '../../../../services/api/productService';
import { addToCart as addToCartAPI } from '../../../../services/api/userService';
import { fetchUserWishlist } from '../../../../store/userSlice';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StarIcon } from 'react-native-heroicons/solid';
import { AntDesign } from '@expo/vector-icons';
import StarRating from 'react-native-star-rating-widget';
import * as Clipboard from 'expo-clipboard';

// TypeScript Interfaces
interface ImageType {
  public_id: string;
  url: string;
  _id: string;
}

interface ColorType {
  _id: string;
  title: string; // Hex color code
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RatingType {
  star: number;
  comment: string;
  postedby: {
    firstname: string;
    avatar?: string;
  };
  updatedAt: string;
  _id: string;
}

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  quantity: number;
  sold: number;
  images: ImageType[];
  color: ColorType[];
  tags: string; // Assuming comma-separated
  totalrating: number;
  ratings: RatingType[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const ProductDetailScreen = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [star, setStar] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);

  const user = useAppSelector((state: any) => state.auth.user);
  const wishlist = useAppSelector((state: any) => state.user.wishlist);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id as string);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setSelectedImage(response.data.images[0].url);
        }
        if (response.data.color && response.data.color.length > 0) {
          setSelectedColor(response.data.color[0]._id);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserWishlist());
    }
  }, [user]);

  useEffect(() => {
    if (wishlist && product) {
      const inWishlist = wishlist.some((item: any) => item._id === product._id);
      setIsWishlisted(inWishlist);
    }
  }, [wishlist, product]);

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Error', 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
    if (!selectedColor) {
      Alert.alert('Error', 'Vui lòng chọn màu sắc.');
      return;
    }
    if (product) {
      if (quantity > product.quantity) {
        Alert.alert('Lỗi', 'Số lượng vượt quá số lượng có sẵn.');
        return;
      }
      try {
        await addToCartAPI({
          productId: product._id,
          quantity,
          color: selectedColor,
          price: product.price,
        });
        Alert.alert('Success', 'Sản phẩm đã được thêm vào giỏ hàng');
      } catch (error) {
        Alert.alert('Error', 'Không thể thêm sản phẩm vào giỏ hàng');
      }
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      Alert.alert('Error', 'Bạn cần đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      return;
    }
    if (product) {
      try {
        await addToWishlistAPI(product._id);
        // Refresh the wishlist
        dispatch(fetchUserWishlist());
        setIsWishlisted(!isWishlisted);
        Alert.alert(
          'Success',
          isWishlisted
            ? 'Đã xóa khỏi danh sách yêu thích'
            : 'Đã thêm vào danh sách yêu thích'
        );
      } catch (error) {
        Alert.alert('Error', 'Không thể cập nhật danh sách yêu thích');
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert('Error', 'Bạn cần đăng nhập để gửi đánh giá');
      return;
    }
    if (star === 0) {
      Alert.alert('Error', 'Vui lòng thêm đánh giá sao');
      return;
    }
    if (comment.trim() === '') {
      Alert.alert('Error', 'Vui lòng viết nhận xét về sản phẩm');
      return;
    }
    if (product) {
      try {
        await addRatingAPI({ star, prodId: product._id, comment });
        Alert.alert('Success', 'Đánh giá đã được gửi');
        // Reset form
        setStar(0);
        setComment('');
        // Re-fetch the product to get updated reviews
        const response = await getProductById(product._id);
        setProduct(response.data);
      } catch (error) {
        Alert.alert('Error', 'Không thể gửi đánh giá');
      }
    }
  };

  const handleCopyLink = async () => {
    if (product) {
      await Clipboard.setStringAsync(`yourapp://product/${product._id}`);
      Alert.alert('Success', 'Đã sao chép liên kết sản phẩm vào clipboard');
    }
  };

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await getProducts();
        const popular = response.data.filter(
          (p: Product) => p.tags && p.tags.includes('popular')
        );
        setPopularProducts(popular);
      } catch (err) {
        console.error('Failed to fetch popular products');
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-red-500 text-lg mb-4 text-center">{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">Trở về</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white">
        <Text className="text-red-500 text-lg mb-4 text-center">Không tìm thấy sản phẩm.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">Trở về</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-blue-500">Trở về</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }} className="p-4">
        {/* Main Image */}
        <Image
          source={{ uri: selectedImage }}
          className="w-full h-72 rounded-lg mb-4"
          resizeMode="cover"
        />

        {/* Thumbnail Images */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {product.images.map((image) => (
            <TouchableOpacity key={image._id} onPress={() => setSelectedImage(image.url)}>
              <Image
                source={{ uri: image.url }}
                className="w-20 h-20 rounded-lg mr-2"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title */}
        <Text className="text-2xl font-bold mb-2 text-center">{product.title}</Text>

        {/* Price and Rating */}
        <Text className="text-xl font-bold text-black mb-2">
          Giá: {product.price.toLocaleString()}₫
        </Text>
        <View className="flex-row items-center mb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              size={20}
              color={index < Math.round(product.totalrating) ? '#FFD700' : '#ccc'}
            />
          ))}
          <Text className="text-base ml-1">({product.ratings.length} đánh giá)</Text>
        </View>
        <TouchableOpacity onPress={() => {}} className="mb-4">
          <Text className="text-blue-500">Viết đánh giá</Text>
        </TouchableOpacity>

        {/* Product Info */}
        <View className="w-full mb-4">
          <Text className="text-base text-gray-600">Loại: {product.category}</Text>
          <Text className="text-base text-gray-600">Thương hiệu: {product.brand}</Text>
          <Text className="text-base text-gray-600">Tags: {product.tags}</Text>
          <Text className="text-base text-gray-600">
            Tình trạng: {product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
          </Text>
        </View>

        {/* Color Selection */}
        {product.color && product.color.length > 0 && (
          <View className="w-full mb-6">
            <Text className="text-lg font-semibold mb-2">Màu sắc:</Text>
            <View className="flex-row space-x-3">
              {product.color.map((colorItem) => (
                <TouchableOpacity
                  key={colorItem._id}
                  onPress={() => setSelectedColor(colorItem._id)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === colorItem._id ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: colorItem.title }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View className="w-full mb-6">
          <Text className="text-lg font-semibold mb-2">Số lượng:</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                } else {
                  Alert.alert('Lỗi', 'Số lượng tối thiểu là 1.');
                }
              }}
              className="p-2"
            >
              <Text className="text-xl">-</Text>
            </TouchableOpacity>
            <Text className="text-base mx-2">{quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                if (quantity < product.quantity) {
                  setQuantity(quantity + 1);
                } else {
                  Alert.alert('Lỗi', 'Số lượng vượt quá số lượng có sẵn.');
                }
              }}
              className="p-2"
            >
              <Text className="text-xl">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          className={`w-full bg-blue-500 p-3 rounded-lg items-center mb-4 ${
            product.quantity === 0 ? 'opacity-50' : ''
          }`}
          onPress={handleAddToCart}
          disabled={product.quantity === 0}
        >
          <Text className="text-white text-base font-bold">
            {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </Text>
        </TouchableOpacity>

        {/* Wishlist Icon */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={handleWishlist}>
            {isWishlisted ? (
              <AntDesign name="heart" size={24} color="red" />
            ) : (
              <AntDesign name="hearto" size={24} color="gray" />
            )}
          </TouchableOpacity>
        </View>

        {/* Shipping Info */}
        <View className="w-full mb-6">
          <Text className="text-lg font-semibold mb-2">Giao hàng & Trả hàng:</Text>
          <Text className="text-base text-gray-700">
            Miễn phí giao hàng và trả hàng cho tất cả các đơn hàng!
            {'\n'}
            Chúng tôi giao hàng trong nước trong vòng{' '}
            <Text className="font-bold">5-10 ngày làm việc!</Text>
          </Text>
        </View>

        {/* Product Link */}
        <TouchableOpacity onPress={handleCopyLink} className="w-full mb-6">
          <Text className="text-blue-500">Sao chép liên kết sản phẩm</Text>
        </TouchableOpacity>

        {/* Description */}
        <View className="w-full mb-6">
          <Text className="text-lg font-semibold mb-2">Mô tả</Text>
          <Text className="text-base text-gray-800">
            {product.description.replace(/<[^>]+>/g, '')}
          </Text>
        </View>

        {/* Reviews */}
        <View className="w-full mb-6">
          <Text className="text-lg font-semibold mb-2">Đánh giá</Text>
          {/* Review Form */}
          <View className="w-full mb-6">
            <Text className="text-lg font-semibold mb-2">Viết đánh giá</Text>
            <StarRating rating={star} onChange={setStar} starSize={30} />
            <TextInput
              placeholder="Nhận xét"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              className="border border-gray-300 p-2 mt-2"
              style={{ height: 100, textAlignVertical: 'top' }}
            />
            <TouchableOpacity
              onPress={handleSubmitReview}
              className="bg-blue-500 p-3 rounded-lg items-center mt-4"
            >
              <Text className="text-white text-base font-bold">Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
          {/* Existing Reviews */}
          {product.ratings.length > 0 ? (
            product.ratings.map((rating) => (
              <View key={rating._id} className="mb-4 p-3 bg-gray-100 rounded-lg w-full">
                <View className="flex-row items-center mb-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarIcon
                      key={idx}
                      size={16}
                      color={idx < rating.star ? '#FFD700' : '#ccc'}
                    />
                  ))}
                  <Text className="text-sm ml-1">{rating.star} sao</Text>
                </View>
                <Text className="text-sm text-gray-700 mb-1">{rating.comment}</Text>
                <Text className="text-xs text-gray-500">
                  Bởi {rating.postedby?.firstname || 'Người dùng'} vào{' '}
                  {new Date(rating.updatedAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-gray-500">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;
