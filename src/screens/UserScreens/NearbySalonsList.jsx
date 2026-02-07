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

// Mock data based on your image
const salonData = [
  {
    id: '1',
    name: 'Lakme Salon',
    location: 'Banjara hills, Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.7,
    reviews: '2.7k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../assets/nearby.png'), // Using placeholder
  },
  {
    id: '2',
    name: 'Lovely Lather',
    location: 'Hitech city road, Madhapur,Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.5,
    reviews: '2.8k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../assets/nearby.png'), // Using placeholder
  },
  {
    id: '3',
    name: 'Cute Stuff Salon',
    location: 'Nexus mall, Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.3,
    reviews: '1.7k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../assets/nearby.png'), // Using placeholder
  },
  {
    id: '4',
    name: 'Love Live Salon',
    location: 'Kondapur, Hyderabad..',
    categories: 'Hair . Facial',
    rating: 4.9,
    reviews: '3.1k',
    discount: '-58%',
    distance: '5.1km',
    image: require('../../assets/nearby.png'), // Using placeholder
  },
];

// --- Salon Card Component (Updated) ---
const SalonCard = ({ item }) => (
  <TouchableOpacity style={styles.cardContainer}>
    {/* Image Container (Left Side) */}
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.cardImage} />
      {/* Favorite Icon */}
      <TouchableOpacity style={styles.heartIcon}>
        <Icon name="heart" size={18} color="#ED4C5C" />
      </TouchableOpacity>
      {/* Distance Tag */}
      <View style={styles.distanceTag}>
        <Text style={styles.distanceText}>{item.distance}</Text>
      </View>
    </View>

    {/* Card Content (Right Side) */}
    <View style={styles.cardContent}>
      {/* Top part of content */}
      <View>
        <Text style={styles.cardCategories}>{item.categories}</Text>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardLocation}>{item.location}</Text>
      </View>
      {/* Footer part of content */}
      <View style={styles.cardFooter}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={18} color="#FFC107" />
          <Text style={styles.ratingText}>
            {item.rating}
          </Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <View style={styles.discountContainer}>
          <Icon name="pricetag" size={16} color="#156778" />
          <Text style={styles.discountText}>{item.discount}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// --- Filter Categories ---
const filters = ['Hair', 'Nails', 'Facial', 'Color'];

export default function SalonsListScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('Facial');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nearby Salon List</Text>
          {/* This button lets you close the modal */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-down-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* --- Filter ScrollView --- */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  activeFilter === filter && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter(filter)}>
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterTextActive,
                  ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Salon List --- */}
        <FlatList
          data={salonData}
          renderItem={SalonCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Styles (Updated) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA', // Light background for the whole screen
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#FFFFFF', // White header background
    marginHorizontal: -20, // Extend to screen edges
    paddingHorizontal: 20, // Re-apply padding
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600', // Semi-bold
    color: '#111111',
  },
  filterContainer: {
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // White filter background
    marginHorizontal: -20, // Extend to screen edges
    paddingHorizontal: 20, // Re-apply padding
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#F3F4F6', // Default light grey
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Default grey border
  },
  filterButtonActive: {
    backgroundColor: '#E1F5FE', // Light blue background
    borderColor: '#0288D1', // Blue border
  },
  filterText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111111', // Darker grey text
  },
  filterTextActive: {
    color: '#156778', // Blue text
    fontWeight: '600',
  },
  cardContainer: {
    flexDirection: 'row', // Main change: layout side-by-side
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    height: 140, // Fixed height for a horizontal card
  },
  imageContainer: {
    width: 130, // Fixed width for the image container
    height: '100%',
    position: 'relative', // Needed for absolute positioning of icons
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12, // Apply border radius to the image
    borderBottomLeftRadius: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 6,
    borderRadius: 15,
  },
  distanceTag: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    backgroundColor: '#FFF9E5', // Light orange as in image
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F98600', // Dark orange text
  },
  cardContent: {
    flex: 1, // Take up remaining space
    padding: 14,
    justifyContent: 'space-between', // Space content vertically
  },
  cardCategories: {
    fontSize: 13,
    color: '#156778',
  },
  cardTitle: {
    fontSize: 18, // Slightly smaller for horizontal card
    fontWeight: 'bold',
    color: '#111111',
    marginVertical: 2,
  },
  cardLocation: {
    fontSize: 13,
    color: '#50555C',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
  },
  reviewText: {
    marginLeft: 6,
    fontSize: 14,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Removed background color to match UI
  },
  discountText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#111111', // Blue text to match icon
  },
});

