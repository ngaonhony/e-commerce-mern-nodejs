import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const Banner1: React.FC = () => {
    return (
        <View className=" bg-gray-900 flex-col justify-between p-4 mb-3">
            <View className="flex-1 justify-center items-center">
                <Image
                    source={{ uri: "https://i.ibb.co/YQjkqWr/juan-burgos-FIy-XGZ1q0mc-unsplash-1.png" }}
                    className="w-full h-52 object-cover"
                    alt="image with decent chairs"
                />
            </View>
            <View className=" bg-gray-500 p-4 justify-center">
                <Text className="text-2xl font-bold text-white mb-2">Modern Interior Decor</Text>
                <Text className="text-base text-white mb-4">
                    Get inspired by our curated selection of luxiwood interiors. We hope get inspired to have luxiwood interior yourself. You’ll find tips here where you can buy a lot of cool furniture, decorations, plants, etc.
                </Text>
                <TouchableOpacity className="bg-white py-3 px-6 items-center rounded">
                    <Text className="text-gray-800 text-base font-bold">Explore</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Banner1;