import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ServiceCard from './ServiceCard';
import SpecialistCard from './SpecialistCard';
import ReviewCard from './ReviewCard';
import { useSelector, useDispatch } from 'react-redux';
import ShopDetailsSkeleton from './ShopDetailsSkeleton';
import { fetchSalonById, fetchServiceItemsByCategory } from '../../../redux/slices/userSlice';
const { height, width } = Dimensions.get('window');
import { addToCart } from '../../../utils/cartStorage';
import { showSnackbar } from '../../../redux/slices/snackbarSlice';

// Mock Data
const shopData = {
  distance: '18 km away available',
  rating: 4.7,
  reviews: '12k',
  views: '12k',
  images: [
    require('../../../assets/featuredSalon.png'),
    require('../../../assets/featuredSalon.png'),
    require('../../../assets/featuredSalon.png'),
    require('../../../assets/featuredSalon.png'),
  ],
  reviews: [
    {
      id: '1',
      userName: 'Jennie Whang',
      userImage: require('../../../assets/featuredSalon.png'),
      rating: 4,
      date: '2 days ago',
      comment: 'The place was clean, great service, staff are friendly. I will certainly recommend to my friends and visit again! :)',
    },
    {
      id: '2',
      userName: 'Nathalie',
      userImage: require('../../../assets/featuredSalon.png'),
      rating: 5,
      date: '1 weeks ago',
      comment: 'Very nice service from the specialist. I always going here for my treatment.',
    },
    {
      id: '3',
      userName: 'Julia Martha',
      userImage: require('../../../assets/featuredSalon.png'),
      rating: 4,
      date: '2 weeks ago',
      comment: 'This is my favourite place to treat my hair :)',
    },
  ],
};

export default function ShopDetailsScreen({ navigation, route }) {
  const { salonId } = route.params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const [showHours, setShowHours] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const dispatch = useDispatch();
  const { salonDetails: salonData, serviceItemsByCategory, loading } = useSelector((state) => state.user);

  const [modeModalVisible, setModeModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const { user } = useSelector(state => state.auth);
  const userId = user?._id || 'guest';

  console.log('Salon Data:', salonData);
  const defaultOpeningHours = [
    { day: 'Monday', start: '08:00am', end: '09:00pm' },
    { day: 'Tuesday', start: '08:00am', end: '09:00pm' },
    { day: 'Wednesday', start: '08:00am', end: '09:00pm' },
    { day: 'Thursday', start: '08:00am', end: '09:00pm' },
  ];

  useEffect(() => {
    dispatch(fetchSalonById(salonId));
  }, [dispatch, salonId]);

  // Set initial category and fetch services when salon data loads
  useEffect(() => {
    if (salonData?.serviceCategories?.length > 0 && !activeCategoryId) {
      const firstCatId = salonData.serviceCategories[0]._id;
      setActiveCategoryId(firstCatId);
      dispatch(fetchServiceItemsByCategory({ salonId, categoryId: firstCatId }));
    }
  }, [salonData]);

  const handleSelectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
    dispatch(fetchServiceItemsByCategory({ salonId, categoryId }));
  };

  const handleAddService = async (service) => {
    if (service.serviceMode === 'both') {
      setSelectedService(service);
      setModeModalVisible(true);
      return;
    }

   await addToCart(
      dispatch,
      userId,
      { _id: salonData._id, name: salonData.shopName },
      service,
      service.serviceMode
    );

    // dispatch(showSnackbar({ message: 'Added to cart', type: 'success' }));
  };

  const confirmModeSelection = async () => {
    if (!selectedMode || !selectedService) return;

    await addToCart(
      dispatch,
      userId,
      { _id: salonData._id, name: salonData.shopName },
      selectedService,
      selectedMode
    );

    setModeModalVisible(false);
    setSelectedMode(null);
    setSelectedService(null);

    // dispatch(showSnackbar({ message: 'Added to cart', type: 'success' }));
  };



  if (!salonData && loading) {
    return (
      <ShopDetailsSkeleton />
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#156678' }]} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
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
              onScroll={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / width);
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {salonData?.galleryImages?.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
              ))}
            </ScrollView>

            {/* Image Indicators */}
            <View style={styles.imageIndicators}>
              {salonData?.galleryImages?.map((_, index) => (
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
            <Text style={styles.shopName}>{salonData?.shopName}</Text>

            <View style={styles.locationRow}>
              <Icon name="location-outline" size={16} color="#6B7280" />
              <Text style={styles.locationText}>{salonData?.location?.address || "Unknown Location"}</Text>
              <View style={styles.dot} />
              <Text style={styles.distanceText}>{salonData?.distance}</Text>
            </View>

            {/* Home Service & Open Now Row */}
            <View style={styles.statusRow}>
              <View style={styles.statusItem1}>
                <Icon name="home-outline" size={16} color="#ffffffff" />
                <Text style={styles.statusText}>Home Service Available</Text>
              </View>

              <View style={styles.statusItem2}>
                <Icon name="time-outline" size={16} color='#ffffffff' />
                <Text style={styles.statusText}>Open Now</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="star" size={16} color="#FACC15" />
                <Text style={styles.statText}>{shopData.rating}</Text>
                <Text style={styles.statSubText}>({shopData.reviewCount || shopData.reviews.length})</Text>
              </View>



              <View style={styles.statDivider} />

              <Icon name="navigate-outline" size={16} color="#6B7280" />
              <Text style={styles.statText}>Directions</Text>

            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{salonData?.about || "The salon will update its details soon! Meanwhile, you're welcome to explore services and enjoy great grooming & beauty care."}</Text>
          </View>

          {/* Opening Hours */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.openingHeader}
              onPress={() => setShowHours(!showHours)}
            >
              <Text style={styles.sectionTitle}>Opening Hours</Text>

              <Icon
                name={showHours ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color="#111827"
              />
            </TouchableOpacity>

            {showHours && (
              <View>
                {((salonData?.openingHours && salonData.openingHours.length > 0)
                  ? salonData.openingHours
                  : defaultOpeningHours
                ).map((hour) => (
                  <View key={hour.day} style={styles.hourRow}>
                    <Text style={styles.dayText}>{hour.day}</Text>

                    {hour.start && hour.end ? (
                      <Text style={styles.timeText}>{hour.start} - {hour.end}</Text>
                    ) : (
                      <Text style={[styles.timeText, styles.closedText]}>Closed</Text>
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
            </View>

            {/* Service Filter Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterTabsContainer}
            >
              {salonData?.serviceCategories?.map((category) => {
                const isActive = activeCategoryId === category._id;
                return (
                  <TouchableOpacity
                    key={category._id}
                    style={[
                      styles.filterTab,
                      isActive && styles.filterTabActive // Apply green border/bg
                    ]}
                    onPress={() => handleSelectCategory(category._id)}
                  >
                    <Text style={[
                      styles.filterTabText,
                      isActive && styles.filterTabTextActive // Apply green text
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {serviceItemsByCategory.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onAdd={handleAddService}
              />
            ))}

          </View>

          {/* Gallery */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gallery</Text>
              {/* <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity> */}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {salonData?.galleryImages.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryThumb} />
              ))}
            </ScrollView>
          </View>

          {/* Our Specialist */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Specialist</Text>
              {/* <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity> */}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {salonData?.specialistsData?.length === 0 ? (
                <Text style={styles.aboutText}>No specialists available at the moment.</Text>
              ) : (
                salonData?.specialistsData?.map((specialist) => (
                  <SpecialistCard key={specialist._id} specialist={specialist} />
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

            {shopData.reviews.map((review) => (
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
              <Text style={styles.totalPrice}>₹ 100</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('HomeTab', {
  screen: 'CartScreen',
})}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View> */}
      </View>

  {modeModalVisible && (
  <TouchableWithoutFeedback onPress={() => {
    setModeModalVisible(false);
    setSelectedMode(null);
    setSelectedService(null);
  }}>
    <View style={styles.modalOverlay}>
      
      {/* Stop propagation so modal itself doesn’t close */}
      <TouchableWithoutFeedback>
        <View style={styles.modalContainer}>

          {/* Close Icon */}
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setModeModalVisible(false);
              setSelectedMode(null);
              setSelectedService(null);
            }}
          >
            <Icon name="close" size={22} color="#6B7280" />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Select Service Mode</Text>

          <TouchableOpacity
            style={[
              styles.modeOption,
              selectedMode === 'salon' && styles.modeActive
            ]}
            onPress={() => setSelectedMode('salon')}
          >
            <Icon name="cut-outline" size={20} color="#156778" />
            <Text style={styles.modeText}>At Salon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeOption,
              selectedMode === 'home' && styles.modeActive
            ]}
            onPress={() => setSelectedMode('home')}
          >
            <Icon name="home-outline" size={20} color="#156778" />
            <Text style={styles.modeText}>At Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !selectedMode && { opacity: 0.5 }
            ]}
            disabled={!selectedMode}
            onPress={confirmModeSelection}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
)}


    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#156678',
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
    modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 20,
  textAlign: 'center',
},

modeOption: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  marginBottom: 12,
},

modeActive: {
  backgroundColor: '#E6F2F4',
  borderColor: '#156778',
},
modeText: {
  fontSize: 16,
  marginLeft: 10,
  color: '#111827',
},

confirmButton: {
  backgroundColor: '#156778',
  paddingVertical: 14,
  borderRadius: 20,
  alignItems: 'center',
  marginTop: 10,
},

confirmText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
closeIcon: {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 10,
},
});