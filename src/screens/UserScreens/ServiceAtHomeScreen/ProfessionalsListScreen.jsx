import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Color Palette ---
const colors = {
  primary: '#156778',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  background: '#F8F9FA',
  text: '#111111',
  textSecondary: '#6B7075',
  border: '#E5E7EB',
  success: '#00A86B',
  filterActive: '#E1F5FE',
  filterBorder: '#0288D1',
};

// Mock data based on your image
const salonData = [
  {
    id: '1',
    name: 'Ashok Sinha',
    location: 'Banjara hills, Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.7,
    reviews: '2.7k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../../assets/profileImg.jpg'),
  },
  {
    id: '2',
    name: 'Kumar roy',
    location: 'Hitech city road, Madhapur,Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.5,
    reviews: '2.8k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../../assets/profileImg.jpg'),
  },
  {
    id: '3',
    name: 'Vinit Singh',
    location: 'Nexus mall, Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.3,
    reviews: '1.7k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../../assets/profileImg.jpg'),
  },
  {
    id: '4',
    name: 'Dinesh Kapoor',
    location: 'Kondapur, Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.9,
    reviews: '3.1k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../../assets/profileImg.jpg'),
  },
];

// --- Salon Card Component (Enhanced) ---
const SalonCard = ({ item, navigation }) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={() => navigation.navigate('ProfessionalDetailScreen')}
    activeOpacity={0.7}
  >
    {/* IMAGE + RATING BADGE */}
    <View style={styles.leftSection}>
      <Image source={item.image} style={styles.profileImg} />

      {/* Green Rating Badge */}
      <View style={styles.ratingBadge}>
        <Icon name="star" size={12} color={colors.white} />
        <Text style={styles.ratingBadgeText}>{item.rating}</Text>
      </View>
    </View>

    {/* MIDDLE CONTENT */}
    <View style={styles.middleSection}>
      <Text style={styles.nameText} numberOfLines={1}>
        {item.name}
      </Text>

      <View style={styles.row}>
        <Icon name="location-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.detailText} numberOfLines={1}>
          {item.location}
        </Text>
      </View>

      <View style={styles.row}>
        <Icon name="briefcase-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.detailText}>{item.categories}</Text>
      </View>

      <View style={styles.row}>
        <Icon name="cut-outline" size={14} color={colors.textSecondary} />
        <Text style={styles.detailText} numberOfLines={1}>
          Makeup | Wax | Spa
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.genderBadge}>
          <Icon name="female-outline" size={12} color={colors.primary} />
          <Text style={styles.genderText}>FEMALE</Text>
        </View>
      </View>
    </View>

    {/* RIGHT ARROW */}
    <View style={styles.rightSection}>
      <Icon name="chevron-forward" size={24} color={colors.primary} />
    </View>
  </TouchableOpacity>
);

// --- Filter Categories ---
const filters = ['All', 'Hair', 'Nails', 'Facial', 'Color', 'Makeup'];

export default function ProfessionalsListScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('Facial');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-back" size={26} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nearby Specialists</Text>
          <View style={styles.headerRight} />
        </View>

        {/* --- Content Wrapper --- */}
        <View style={styles.contentWrapper}>
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

          {/* --- Results Count --- */}
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>
              {salonData.length} specialists found
            </Text>
          </View>

          {/* --- Salon List --- */}
          <FlatList
            data={salonData}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <SalonCard item={item} navigation={navigation} />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Enhanced Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary, // Primary color for SafeAreaView
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.3,
  },
  headerRight: {
    width: 40, // Spacer for centering title
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
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
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  resultsText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  leftSection: {
    position: 'relative',
    marginRight: 14,
  },
  profileImg: {
    width: 75,
    height: 75,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: -4,
    left: -2,
    backgroundColor: colors.success,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  ratingBadgeText: {
    color: colors.white,
    fontSize: 11,
    marginLeft: 3,
    fontWeight: '700',
  },
  middleSection: {
    flex: 1,
  },
  nameText: {
    fontSize: 17,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genderText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
});
