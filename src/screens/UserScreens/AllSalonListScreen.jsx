import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSalonsByCategory } from '../../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 2 cards with proper spacing

// --- Color Palette ---
const colors = {
  primary: '#156778',
  primaryDark: '#0F4E5C',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  text: '#111111',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  star: '#FFC107',
  shadow: '#000000',
};

// --- Filter Categories ---
const filters = ['All', 'Hairs','Spa' ,'Nails', 'Coloring', 'Wax', 'Makeup', 'Facial', 'Manicure'];

export default function AllSalonListScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { allSalons, loading, error } = useSelector(state => state.user);
  const { category, subCat, lat, lng } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(subCat);

  useEffect(() => {
    if (category && lat && lng) {
      dispatch(fetchAllSalonsByCategory({ category, subCat, lat, lng }));
    }
  }, [category, subCat, lat, lng, dispatch]);

  const filteredSalons = allSalons.filter(salon =>
    salon.shopName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // --- Salon Card Component ---
  const SalonCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ShopDetailsFull', { salonId: item._id })
      }
      activeOpacity={0.7}
    >
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/salonInterior.jpg')}
          style={styles.image}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageGradient}
        />

        {/* Distance Badge */}
        <View style={styles.distanceBadge}>
          <Icon name="location" size={10} color={colors.white} />
          <Text style={styles.distanceText}>
            {(item.distanceInMeters / 1000).toFixed(1)}km
          </Text>
        </View>

        {/* Heart Icon */}
        <TouchableOpacity style={styles.heartButton}>
          <Icon name="heart-outline" size={16} color={colors.white} />
        </TouchableOpacity>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Icon name="star" size={10} color={colors.white} />
          <Text style={styles.ratingBadgeText}>4.8</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Text style={styles.salonName} numberOfLines={1}>
          {item.shopName}
        </Text>

        <View style={styles.categoryRow}>
          <View style={{ height: 20, flexDirection: 'row' }}>
            <Icon
              name="cut-outline"
              style={{ marginTop: 2 }}
              size={11}
              color={colors.primary}
            />
            <Text style={styles.categoryText} numberOfLines={1}>
              Haircut - 299
            </Text>
          </View>
          <View style={{ height: 20, flexDirection: 'row' }}>
            <Icon
              name="cut-outline"
              style={{ marginTop: 2 }}
              size={11}
              color={colors.primary}
            />
            <Text style={styles.categoryText} numberOfLines={1}>
              Wax - 459
            </Text>
          </View>
          <View style={{ height: 20, flexDirection: 'row' }}>
            <Icon
              name="cut-outline"
              style={{ marginTop: 2 }}
              size={11}
              color={colors.primary}
            />
            <Text style={styles.categoryText} numberOfLines={1}>
              Facial - 99
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book</Text>
          <Icon name="arrow-forward" size={10} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* --- Enhanced Header --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-back" size={26} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Popular Near Me</Text>
            {!loading && (
              <Text style={styles.headerSubtitle}>
                {filteredSalons.length} salons found
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="options-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* --- Content Wrapper --- */}
        <View style={styles.contentWrapper}>
          {/* --- Search Bar --- */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputWrapper}>
              <Icon
                name="search-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search salons..."
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Icon
                    name="close-circle"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* --- Filter ScrollView --- */}
          <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {filters.map(filter => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterButton,
                    activeFilter === filter && styles.filterButtonActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filter && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* --- Salon Grid --- */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading salons...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() =>
                  dispatch(fetchAllSalonsByCategory({ category, lat, lng }))
                }
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredSalons.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon
                name="storefront-outline"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No salons found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredSalons}
              keyExtractor={item => item._id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContent}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => <SalonCard item={item} />}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.primaryLight,
    marginTop: 2,
    fontWeight: '500',
  },
  filterContainer: {
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterScrollContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.filterActive,
    borderColor: colors.filterBorder,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  contentWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  gridContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success || '#00A86B',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ratingBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 3,
  },
  cardContent: {
    padding: 12,
  },
  salonName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  categoryRow: {
    flexDirection: 'col',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
