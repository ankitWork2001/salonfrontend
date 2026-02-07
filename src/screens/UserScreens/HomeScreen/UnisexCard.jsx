import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Define colors for this component
const colors = {
  primary: '#156778',
  white: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  star: '#FACC15',
  like: '#EF4444',
  likeBg: 'rgba(255, 255, 255, 0.9)',
  discountBg: '#FEE2E2',
  discountText: '#B91C1C',
  border: '#E5E7EB',
  homeServiceBg: '#DBEAFE',
  homeServiceText: '#1E40AF',
};

const UnisexCard = ({ unisexSalon, icon, salonBadge, onPress }) => {
  const { salonCategory, shopName, rating, reviews, distanceInMeters, galleryImages } = unisexSalon || {};
  const navigation = useNavigation();

    const imgSource =
    galleryImages?.length > 0
      ? { uri: galleryImages[0] }
      : require('../../../assets/featuredSalon.png');

       const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}`+ 'm';
    return `${(meters / 1000).toFixed(1)}` +'km';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShopDetailsFull', { salonId: unisexSalon._id })}
      activeOpacity={0.8}
    >
      {/* --- HOME SERVICE BADGE AT TOP RIGHT OF CARD --- */}
      <View style={styles.homeServiceBadge}>
        <Ionicons name={icon} size={12} color={colors.homeServiceText} />
        <Text style={styles.homeServiceText}>{salonBadge}</Text>
      </View>

      {/* --- IMAGE CONTAINER for positioning badges --- */}
      <View style={styles.imageContainer}>
        <Image
          source={imgSource}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* --- HEART BUTTON --- */}
        <TouchableOpacity style={styles.heartButton}>
          <Ionicons name="heart-outline" size={20} color={colors.like} />
        </TouchableOpacity>

        {/* --- DISCOUNT TAG --- */}
        {/* {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )} */}
      </View>

      <View style={styles.info}>
        <Text style={styles.category}>{salonCategory}</Text>
        <Text style={styles.name} numberOfLines={1}>{shopName}</Text>
        <Text style={styles.address} numberOfLines={1}>{formatDistance(distanceInMeters)}</Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.star} />
          <Text style={styles.rating}>{rating || 0}</Text>
          <Text style={styles.reviews}>({reviews || 0})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'visible', // Changed to 'visible' to allow badge overflow
    marginBottom: 20,
  },
  // --- HOME SERVICE BADGE AT TOP RIGHT ---
  homeServiceBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    zIndex: 10,
    backgroundColor: colors.homeServiceBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  homeServiceText: {
    color: colors.homeServiceText,
    fontSize: 10,
    fontWeight: '600',
  },
  imageContainer: {
    width: 110,
    height: 140,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: colors.likeBg,
    borderRadius: 16,
    padding: 4,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  category: {
    fontSize: 11,
    color: colors.primary,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 2,
  },
  address: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    color: colors.text,
  },
  reviews: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  discountBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: colors.discountBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  discountText: {
    color: colors.discountText,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default UnisexCard;
