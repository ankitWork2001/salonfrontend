import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function ShopDetailsSummaryScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const shopData = {
    name: 'Plush Beauty Lounge',
    address: '360 Stillwater Rd, Palm City, FL 34990',
    category: 'Hair · Facial · Nails · 2+',
    rating: 4.7,
    reviews: '2.7k',
    discount: '-58% (6 pax available)',
    image: require('../../../assets/shopBg.png'),
    status: 'OPEN',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Background Image */}
        <Image source={shopData.image} style={styles.backgroundImage} />

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Icon name="arrow-back" size={24} color="#156778" />
          </TouchableOpacity>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="heart-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="map-outline" size={24} color="#156778" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Card */}
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            {/* Category and Status */}
            <View style={styles.categoryRow}>
              <Text style={styles.categoryText}>{shopData.category}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{shopData.status}</Text>
              </View>
            </View>

            {/* Shop Name */}
            <Text style={styles.shopName}>{shopData.name}</Text>

            {/* Address */}
            <Text style={styles.address}>{shopData.address}</Text>

            {/* Rating and Discount */}
            <View style={styles.infoRow}>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FACC15" />
                <Text style={styles.ratingText}>{shopData.rating}</Text>
                <Text style={styles.reviewsText}>({shopData.reviews})</Text>
              </View>

              <View style={styles.discountContainer}>
                <Icon name="pricetag" size={16} color="#F59E0B" />
                <Text style={styles.discountText}>{shopData.discount}</Text>
              </View>
            </View>

            {/* Book Now Button */}
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate('ShopDetailsFull')}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>

          {/* View More Details */}
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate('ShopDetailsFull')}
          >
            <Text style={styles.viewMoreText}>View More Details</Text>
            <Icon name="chevron-down" size={20} color="#156778" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    width: width,
    height: height,
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  cardContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  card: {
    width: width - 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#156778',
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  shopName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  address: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  bookButton: {
    backgroundColor: '#156778',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#156778',
    marginRight: 4,
  },
});
