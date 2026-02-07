import React, { memo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 48 = 16 (left margin) + 16 (right margin) + 16 (gap)

const colors = {
  primary: '#156778',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  success: '#059669',
  warning: '#F59E0B',
  star: '#FACC15',
  border: '#E5E7EB',
  shadow: '#000',
  like: '#EF4444',
  likeFilled: '#DC2626',
  likeBg: 'rgba(255, 255, 255, 0.95)',
  badge: '#8B5CF6',
};

const SalonHomeServiceCard = memo(({ salon, onToggleLike }) => {
  const navigation = useNavigation();
  const [isLiked, setIsLiked] = useState(false);

  const formatDistance = (meters) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
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
    homeServiceCharges,
  } = salon || {};

  const imageSource =
    galleryImages?.length > 0
      ? { uri: galleryImages[0] }
      : require('../../../assets/featuredSalon.png');

  const displayService = categories?.[0];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ShopDetailsFull', { salonId: _id })}
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${shopName}, ${salonCategory}, rating ${rating}`}
      accessibilityHint="Double tap to view salon details"
    >
      {/* IMAGE SECTION */}
      <View style={styles.imageWrapper}>
        <Image 
          source={imageSource} 
          style={styles.image}
          resizeMode="cover"
        />

        {/* Home Service Badge - Top */}
        <View style={styles.homeServiceBadge}>
          <Ionicons name="home" size={10} color={colors.white} />
          <Text style={styles.homeServiceText}>Home</Text>
        </View>

        {/* Heart Button - Top Right */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleLikePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={16}
            color={isLiked ? colors.likeFilled : colors.like}
          />
        </TouchableOpacity>

        {/* Rating Badge - Bottom */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color={colors.star} />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>

      {/* INFO SECTION */}
      <View style={styles.infoContainer}>
        {/* Category */}
        <Text style={styles.category} numberOfLines={1}>
          {salonCategory}
        </Text>

        {/* Salon Name */}
        <Text style={styles.shopName} numberOfLines={1} ellipsizeMode="tail">
          {shopName || 'Unnamed Salon'}
        </Text>

        {/* Distance & Charge Row */}
        <View style={styles.metaRow}>
          <View style={styles.distanceInfo}>
            <Ionicons name="location" size={11} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              {distanceInMeters !== undefined
                ? formatDistance(distanceInMeters)
                : 'N/A'}
            </Text>
          </View>
          
          {homeServiceCharges && (
            <View style={styles.chargesBadge}>
              <Text style={styles.chargesText}>₹{homeServiceCharges}</Text>
            </View>
          )}
        </View>

        {/* Single Service Display */}
        {displayService && (
          <View style={styles.serviceRow}>
            <Ionicons name="cut" size={11} color={colors.primary} />
            <Text style={styles.serviceText} numberOfLines={1}>
              {displayService.name}
            </Text>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => navigation.navigate('ShopDetailsFull', { salonId: _id })}
          activeOpacity={0.8}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
          <Ionicons name="arrow-forward" size={12} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
});

SalonHomeServiceCard.displayName = 'SalonHomeServiceCard';

export default SalonHomeServiceCard;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  imageWrapper: {
    position: 'relative',
    height: 120,
    backgroundColor: colors.primaryLight,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  homeServiceBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.badge,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },

  homeServiceText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
  },

  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.likeBg,
    padding: 6,
    borderRadius: 16,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },

  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 3,
  },

  ratingText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },

  infoContainer: {
    padding: 10,
    gap: 6,
  },

  category: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  shopName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },

  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },

  chargesBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  chargesText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },

  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  serviceText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },

  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 4,
    gap: 5,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },

  bookButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
