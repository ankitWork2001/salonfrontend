import React, { useState, memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const colors = {
  primary: '#156778',
  white: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  star: '#FACC15',
  like: '#EF4444',
  likeFilled: '#DC2626',
  likeBg: 'rgba(255, 255, 255, 0.95)',
  border: '#E5E7EB',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shadow: '#000',
};

const PRICE_MAP = [
  { name: 'Haircut', price: 20 },
  { name: 'Wax', price: 40 },
  { name: 'Facial', price: 100 },
];

const SalonCard = memo(({ salon, onToggleLike }) => {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}`+ 'm';
    return `${(meters / 1000).toFixed(1)}` +'km';
  };

  const handleLikePress = () => {
    setIsLiked(!isLiked);
    onToggleLike?.(_id);
  };

  const {
    _id,
    shopName,
    salonCategory,
    galleryImages,
    categories,
    distanceInMeters,
    rating = '4.8',
    reviews = '200',
  } = salon || {};

  const imageSource =
    galleryImages?.length > 0
      ? { uri: galleryImages[0] }
      : require('../../../assets/featuredSalon.png');

  const displayCategories = categories?.length ? categories.slice(0, 3) : PRICE_MAP;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ShopDetailsFull', { salonId: _id })}
    >
      {/* IMAGE SECTION */}
      <View style={styles.imageWrapper}>
        <Image 
          source={imageSource} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Distance Badge - Bottom Left */}
        <View style={styles.distanceBadge}>
          <Ionicons name="location" size={12} color={colors.white} />
          <Text style={styles.badgeText}>
            {distanceInMeters !== undefined
              ? formatDistance(distanceInMeters)
              : 'N/A'}
          </Text>
        </View>

        {/* Rating Badge - Bottom Right */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color={colors.star} />
          <Text style={styles.badgeText}>{rating}</Text>
          <Text style={styles.reviewsText}>({reviews})</Text>
        </View>

        {/* Heart Button */}
        <TouchableOpacity 
          style={styles.heartButton}
          onPress={handleLikePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={20}
            color={isLiked ? colors.likeFilled : colors.like}
          />
        </TouchableOpacity>
      </View>

      {/* INFO SECTION */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.category} numberOfLines={1}>
            {salonCategory}
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {shopName || 'Unnamed Salon'}
        </Text>

        <View style={styles.categories}>
          {displayCategories.map((cat, index) => (
            <View key={index} style={styles.categoryRow}>
              <Text style={styles.categoryDot}>•</Text>
              <Text style={styles.categoryItem} numberOfLines={1}>
                {cat.name} - ₹{cat.price}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
});

SalonCard.displayName = 'SalonCard';

export default SalonCard;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  card: {
    width: width * 0.45,
    borderRadius: 16,
    backgroundColor: colors.white,
    marginBottom: 14,
    height: 250,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  imageWrapper: {
    position: 'relative',
    height: 140,
    backgroundColor: colors.border,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.likeBg,
    padding: 4,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 3,
  },

  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 3,
  },

  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  reviewsText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
    opacity: 0.9,
  },

  info: {
    padding: 10,
    gap: 0,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  category: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },

  categories: {
    gap: 0,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  categoryDot: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },

  categoryItem: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
})