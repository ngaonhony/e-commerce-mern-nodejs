import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Slot } from 'expo-router';
import "../../global.css";

const WishlishLayout = () => {
    const router = useRouter();
    return (
        <SafeAreaView style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }} className='flex-1 bg-white'>
            <View className="flex-1">
                <View className="flex-row items-center p-4">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Text className="text-blue-500">Trở về</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-1">
                    <Slot />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WishlishLayout;