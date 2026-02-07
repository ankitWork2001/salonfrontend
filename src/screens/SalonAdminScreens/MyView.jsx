import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ServiceCard from '../UserScreens/ShopDetails/ServiceCard';
import SpecialistCard from '../UserScreens/ShopDetails/SpecialistCard';
import ReviewCard from '../UserScreens/ShopDetails/ReviewCard';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSalonById } from '../../../src/redux/slices/userSlice';
const { height, width } = Dimensions.get('window');

// Mock Data
const shopData = {
  distance: '18 km away available',
  rating: 4.7,
  reviews: '12k',
  views: '12k',
  images: [
    require('../../../src/assets/featuredSalon.png'),
    require('../../../src/assets/featuredSalon.png'),
    require('../../../src/assets/featuredSalon.png'),
    require('../../../src/assets/featuredSalon.png'),
  ],
  services: [
    {
      id: '1',
      name: 'Women Haircut',
      price: 55,
      duration: '1.5 hour',
      description: 'A clean cut does is a shorter hairstyle Spec 1',
      discount: '-20%',
      image: require('../../../src/assets/featuredSalon.png'),
    },
    {
      id: '2',
      name: 'Bob/ Lob Cut',
      price: 55,
      duration: '1.5 hour',
      description: "The haircut is a women's hairstyle that is cut short...",
      discount: null,
      image: require('../../../src/assets/featuredSalon.png'),
    },
    {
      id: '3',
      name: 'Medium Length Layer Cut',
      price: 80,
      duration: '1 hour',
      description:
        'A layered hair is a hairstyle that gives the illusion of...',
      discount: null,
      image: require('../../../src/assets/featuredSalon.png'),
    },
    {
      id: '4',
      name: 'V-Shaped Cut',
      price: 90,
      duration: '2.5 hour',
      description: 'There are a lot of variations between which...',
      discount: '-5%',
      image: require('../../../src/assets/featuredSalon.png'),
    },
  ],
  reviews: [
    {
      id: '1',
      userName: 'Jennie Whang',
      userImage: require('../../../src/assets/featuredSalon.png'),
      rating: 4,
      date: '2 days ago',
      comment:
        'The place was clean, great service, staff are friendly. I will certainly recommend to my friends and visit again! :)',
    },
    {
      id: '2',
      userName: 'Nathalie',
      userImage: require('../../../src/assets/featuredSalon.png'),
      rating: 5,
      date: '1 weeks ago',
      comment:
        'Very nice service from the specialist. I always going here for my treatment.',
    },
    {
      id: '3',
      userName: 'Julia Martha',
      userImage: require('../../../src/assets/featuredSalon.png'),
      rating: 4,
      date: '2 weeks ago',
      comment: 'This is my favourite place to treat my hair :)',
    },
  ],
};

export default function MyView({ navigation, route }) {
  //   const { salonId } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const [showHours, setShowHours] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isEditingShopName, setIsEditingShopName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [about,setAbout] = useState(userDetails?.roleDetails?.about ||
                  "The salon will update its details soon! Meanwhile, you're welcome to explore services and enjoy great grooming & beauty care.")
  const [shopName, setShopName] = useState(
    userDetails?.roleDetails?.shopName || 'Unknown',
  );

  const defaultOpeningHours = [
    { day: 'Monday', start: '08:00am', end: '09:00pm' },
    { day: 'Tuesday', start: '08:00am', end: '09:00pm' },
    { day: 'Wednesday', start: '08:00am', end: '09:00pm' },
    { day: 'Thursday', start: '08:00am', end: '09:00pm' },
  ];

  //   useEffect(() => {
  //     dispatch(fetchSalonById(salonId));
  //   }, [dispatch, salonId]);

  const dispatch = useDispatch();
  const salonData = useSelector(state => state.user.salonDetails);
  const userDetails = useSelector(state => state.auth.user);
  console.log(userDetails);

  const specialists = salonData?.specialistsData || [];
  const serviceCategories = salonData?.serviceCategories || [];

  console.log(serviceCategories);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: 'transparent' }]}
      edges={[]}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top - 25 }]}>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image Gallery */}
          <View style={styles.imageGallery}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={event => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {shopData.images.map((image, index) => (
                <Image key={index} source={image} style={styles.galleryImage} />
              ))}
            </ScrollView>

            {/* Pencil Icon */}
            <TouchableOpacity style={styles.editIcon}>
              <Icon name="pencil" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {shopData.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.activeIndicator,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Shop Info */}
          <View style={styles.infoSection}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              {isEditingShopName ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TextInput
                    value={shopName}
                    onChangeText={setShopName}
                    style={styles.shopNameInput}
                    autoFocus
                    placeholder="Enter shop name"
                  />

                  <TouchableOpacity
                    onPress={() => setIsEditingShopName(false)}
                    style={{ marginLeft: 8 }}
                  >
                    <Icon name="checkmark" size={22} color="#22C55E" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.shopName}>
                    {userDetails?.roleDetails?.shopName}
                  </Text>
                  <TouchableOpacity onPress={() => setIsEditingShopName(true)}>
                    <Icon name="pencil" size={18} color="#6B7280" />
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.locationRow}>
              <Icon name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.locationText}>
                {userDetails?.roleDetails?.location?.address ||
                  'Unknown Location'}
              </Text>
              <View style={styles.dot} />
              <Text style={styles.distanceText}>{userDetails?.distance}</Text>
            </View>

            {/* Home Service & Open Now Row */}
            <View style={styles.statusRow}>
              <View style={styles.statusItem1}>
                <Icon name="home-outline" size={16} color="#ffffffff" />
                <Text style={styles.statusText}>Home Service Available</Text>
              </View>

              <TouchableOpacity>
                <Icon name="pencil" size={16} color="#6B7280" />
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  style={[
                    styles.statusItem2,
                    !isOpen && { backgroundColor: '#6B7280' },
                  ]}
                  onPress={() => setIsOpen(!isOpen)}
                >
                  <Icon name="time-outline" size={16} color="#fff" />
                  <Text style={styles.statusText}>
                    {isOpen ? 'Open Now' : 'Closed Now'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="star" size={16} color="#FACC15" />
                <Text style={styles.statText}>
                  {userDetails?.roleDetails?.rating}
                </Text>
                <Text style={styles.statSubText}>
                  ({shopData.reviewCount || shopData.reviews.length})
                </Text>
              </View>

              <View style={styles.statDivider} />

              <Icon name="navigate-outline" size={16} color="#6B7280" />
              <Text style={styles.statText}>Directions</Text>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.sectionTitle}>About</Text>

              <TouchableOpacity onPress={() => setIsEditingAbout(true)}>
                <Icon name="pencil" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {isEditingAbout ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <TextInput
                  value={about}
                  onChangeText={setAbout}
                  style={styles.aboutText}
                  autoFocus
                  placeholder="Enter shop name"
                />

                <TouchableOpacity
                  onPress={() => setIsEditingAbout(false)}
                  style={{ marginLeft: 8 }}
                >
                  <Icon name="checkmark" size={22} color="#22C55E" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.aboutText}>
                {about}
              </Text>
            )}
          </View>

          {/* Opening Hours */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.openingHeader}
              onPress={() => setShowHours(!showHours)}
            >
              <Text style={styles.sectionTitle}>Opening Hours</Text>

              <Icon
                name={showHours ? 'chevron-up-outline' : 'chevron-down-outline'}
                size={22}
                color="#111827"
              />
            </TouchableOpacity>

            {showHours && (
              <View>
                {(salonData?.openingHours && salonData.openingHours.length > 0
                  ? salonData.openingHours
                  : defaultOpeningHours
                ).map(hour => (
                  <View key={hour.day} style={styles.hourRow}>
                    <Text style={styles.dayText}>{hour.day}</Text>

                    {hour.start && hour.end ? (
                      <Text style={styles.timeText}>
                        {hour.start} - {hour.end}
                      </Text>
                    ) : (
                      <Text style={[styles.timeText, styles.closedText]}>
                        Closed
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Our Services */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Services</Text>
              {/* <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ManageServices')}
              >
                <Icon name="pencil" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Service Filter Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterTabsContainer}
            >
              {serviceCategories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.filterTab /* Add active style conditionally */,
                  ]}
                  onPress={() => console.log(category._id)}
                >
                  <Text style={styles.filterTabText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {shopData.services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
            {/* <TouchableOpacity style={styles.viewAllServicesButton}>
              <Text style={styles.viewAllServicesText}>View All Services</Text>
            </TouchableOpacity> */}
          </View>

          {/* Gallery */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {shopData.images.map((image, index) => (
                <Image key={index} source={image} style={styles.galleryThumb} />
              ))}
            </ScrollView>
          </View>

          {/* Our Specialist */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Specialist</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {specialists.length === 0 ? (
                <Text style={styles.aboutText}>
                  No specialists available at the moment.
                </Text>
              ) : (
                specialists.map(specialist => (
                  <SpecialistCard
                    key={specialist._id}
                    specialist={specialist}
                  />
                ))
              )}
            </ScrollView>
          </View>

          {/* Reviews */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>

            {shopData.reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </ScrollView>

        {/* Fixed Bottom Bar */}
        {/* <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <Icon name="checkmark-circle" size={24} color="#156778" />
            <View style={styles.priceInfo}>
              <Text style={styles.totalLabel}>Total (1 Service)</Text>
              <Text style={styles.totalPrice}>₹ 2500</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('Booking')}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageGallery: {
    height: 200,
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  editIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  shopNameInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 2,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  openingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 10,
  },
  shopName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // or space-between if you want them spread
    alignItems: 'center',
    marginBottom: 12,
    gap: 16, // space between items
  },
  statusItem1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9C6ADE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  statusItem2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#47C676',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '300',
    color: '#ffffffff',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
    marginHorizontal: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  statSubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 2,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06B6D4',
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.8,
    borderBottomColor: '#E5E7EB',
  },

  dayText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16A34A', // Green for open time
  },

  closedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626', // Red for closed
  },
  viewAllServicesButton: {
    borderWidth: 1,
    borderColor: '#156778',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  viewAllServicesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#156778',
  },
  galleryThumb: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priceInfo: {
    marginLeft: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  bookButton: {
    backgroundColor: '#156778',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  filterTabsContainer: {
    marginBottom: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#E1F5FA',
    borderColor: '#156778',
  },
  filterIconContainer: {
    marginRight: 8,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#156778',
    fontWeight: '600',
  },
});
