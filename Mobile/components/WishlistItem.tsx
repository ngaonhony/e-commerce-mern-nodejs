import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface WishlistItemProps {
    item: {
        _id: string;
        title: string;
        price: number;
        images: { url: string }[];
    };
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.images[0].url }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    details: {
        marginLeft: 16,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#888',
        marginTop: 4,
    },
});

export default WishlistItem;