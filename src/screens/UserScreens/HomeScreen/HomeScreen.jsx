import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHomeSalonsBySalonCategory,
  fetchHomeIndependentprosByCategory,
  getAllCategories,
  fetchUnisexSalons,
} from '../../../redux/slices/userSlice';
import HomeHeader from '../../../components/HomeHeader';
import SectionHeader from '../../../components/SectionHeader';
import SalonCard from './SalonCard';
import NearbyOfferCard from './NearbyOfferCard';
import UnisexCard from './UnisexCard';
import ServiceAtHomeCard from './ServiceAtHomeCard';
import PromoBanner, { PROMO_BANNER_DURATION } from './PromoBanner';
import PromoBanner2, { PROMO_BANNER_2_DURATION } from './PromoBanner2';
import SkeletonLoadingScreen from './SkeletonLoadingScreen';
import { LocationContext } from '../../../components/LocationProvider';
const { width } = Dimensions.get('window');
import CategoriesMarquee from './CategoriesMarquee';

const colors = {
  primary: '#156778',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  background: '#FFFFFF',
  textSecondary: '#6B7280',
};

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { location } = useContext(LocationContext);
  const user = useSelector(state => state.auth.user);
  const {
    loading,
    homeSalonsBySalonCategory,
    homeIndependentProsByCategory,
    unisexSalons,
    categories,
  } = useSelector(state => state.user);

  const salonList = Array.isArray(homeSalonsBySalonCategory?.data?.salons)
    ? homeSalonsBySalonCategory.data.salons
    : Array.isArray(homeSalonsBySalonCategory?.data)
    ? homeSalonsBySalonCategory.data
    : [];

  const independentProsList = Array.isArray(
    homeIndependentProsByCategory?.data?.independentPros,
  )
    ? homeIndependentProsByCategory.data.independentPros
    : Array.isArray(homeIndependentProsByCategory?.data)
    ? homeIndependentProsByCategory.data
    : [];

  const [refreshing, setRefreshing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('women');
  const prosScrollRef = useRef(null);
  const [currentProIndex, setCurrentProIndex] = useState(0);

  const promoScrollRef = useRef(null);
  const transitionAnim = useRef(new Animated.Value(0)).current;
  const BANNER_EXIT_DURATION = 2500;
  const [activeBanner, setActiveBanner] = useState(0);
  const [nextBanner, setNextBanner] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const promoImages = [
    require('../../../assets/promos/promo1.png'),
    require('../../../assets/promos/promo2.png'),
    require('../../../assets/promos/promo3.png'),
  ];

  const womenImage = require('../../../assets/men-women/woman.png');
  const menImage = require('../../../assets/men-women/men.png');

  const handleSelectSalonCategory = category => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (selectedCategory && location?.latitude && location?.longitude) {
      const lat = location.latitude;
      const lng = location.longitude;
      dispatch(getAllCategories(selectedCategory));
      dispatch(
        fetchHomeSalonsBySalonCategory({
          category: selectedCategory,
          lat,
          lng,
        }),
      );
      dispatch(
        fetchHomeIndependentprosByCategory({
          category: selectedCategory,
          lat,
          lng,
        }),
      );
      dispatch(fetchUnisexSalons({ lat, lng }));
    }
  }, [selectedCategory, dispatch, location]);

  const displayDuration =
    activeBanner === 0 ? PROMO_BANNER_DURATION : PROMO_BANNER_2_DURATION;

  // Right-to-left banner transition; mounts new banner only when visible
  const startBannerTransition = useCallback(() => {
    if (isTransitioning) return;
    const upcomingBanner = activeBanner === 0 ? 1 : 0;
    setNextBanner(upcomingBanner);
    setIsTransitioning(true);
    transitionAnim.setValue(0);

    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: BANNER_EXIT_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setActiveBanner(upcomingBanner);
      setIsTransitioning(false);
    });
  }, [activeBanner, transitionAnim, isTransitioning]);

  // Synchronize parent slideshow cycle with child banner animations
  useEffect(() => {
    if (isTransitioning) return;
    const timer = setTimeout(startBannerTransition, displayDuration);
    return () => clearTimeout(timer);
  }, [startBannerTransition, displayDuration, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % promoImages.length;
      setCurrentSlide(nextSlide);

      if (promoScrollRef.current) {
        promoScrollRef.current.scrollTo({
          x: nextSlide * width,
          animated: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSlide, promoImages.length]);

  useEffect(() => {
    if (!independentProsList || independentProsList.length === 0) return;

    const interval = setInterval(() => {
      let nextIndex = (currentProIndex + 1) % independentProsList.length;
      setCurrentProIndex(nextIndex);

      if (prosScrollRef.current) {
        prosScrollRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentProIndex, independentProsList]);

  const onRefresh = async () => {
    setRefreshing(true);
    const lat = location?.latitude;
    const lng = location?.longitude;
    dispatch(getAllCategories(selectedCategory));
    dispatch(
      fetchHomeSalonsBySalonCategory({
        category: selectedCategory,
        lat,
        lng,
      }),
    );
    dispatch(
      fetchHomeIndependentprosByCategory({
        category: selectedCategory,
        lat,
        lng,
      }),
    );
    dispatch(fetchUnisexSalons({ lat, lng }));
    setRefreshing(false);
  };

  const renderSalonSection = (title, data) => {
    const listData = Array.isArray(data?.salons)
      ? data.salons
      : Array.isArray(data)
      ? data
      : [];

    if (listData.length === 0) return null;

    const lat = location?.latitude;
    const lng = location?.longitude;

    return (
      <View style={{ marginBottom: 20 }}>
        <SectionHeader
          title={title}
          showViewAll
          onPress={() =>
            navigation.navigate('AllSalonListScreen', {
              category: selectedCategory,
              lat,
              lng,
            })
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {listData.map(salon => (
            <View key={salon._id} style={styles.salonCardWrapper}>
              <SalonCard salon={salon} />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading && !refreshing) {
    return <SkeletonLoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <HomeHeader user={user} navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Banner Slideshow - mounts only the active banner so animations restart */}
          <View style={styles.bannerContainer}>
            {isTransitioning ? (
              <>
                <Animated.View
                  style={[
                    styles.bannerSlide,
                    {
                      transform: [
                        {
                          translateX: transitionAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -width],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {activeBanner === 0 ? <PromoBanner /> : <PromoBanner2 />}
                </Animated.View>

                <Animated.View
                  style={[
                    styles.bannerSlide,
                    StyleSheet.absoluteFill,
                    {
                      transform: [
                        {
                          translateX: transitionAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [width, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {nextBanner === 0 ? <PromoBanner /> : <PromoBanner2 />}
                </Animated.View>
              </>
            ) : activeBanner === 0 ? (
              <PromoBanner />
            ) : (
              <PromoBanner2 />
            )}
          </View>

          {/* Gender Category Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonLeft,
                selectedCategory === 'women' && styles.toggleButtonActive,
              ]}
              onPress={() => handleSelectSalonCategory('women')}
              activeOpacity={0.8}
            >
              <Image
                style={styles.toggleIcon}
                source={womenImage}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.toggleText,
                  selectedCategory === 'women' && styles.toggleTextActive,
                ]}
              >
                Women
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                styles.toggleButtonRight,
                selectedCategory === 'men' && styles.toggleButtonActive,
              ]}
              onPress={() => handleSelectSalonCategory('men')}
              activeOpacity={0.8}
            >
              <Image
                style={styles.toggleIcon}
                source={menImage}
                resizeMode="contain"
              />
              <Text
                style={[
                  styles.toggleText,
                  selectedCategory === 'men' && styles.toggleTextActive,
                ]}
              >
                Men
              </Text>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <SectionHeader title="What do you want to get?" />
          <CategoriesMarquee
            categories={categories}
            navigation={navigation}
            location={location}
            selectedCategory={selectedCategory}
          />

          {/* --- Salon Sections --- */}
          {renderSalonSection(selectedCategory.toUpperCase(), salonList)}

          {/* --- Service at Home Card --- */}
          <SectionHeader
            title="Service At Home"
            onPress={() => navigation.navigate('ProfessionalsListScreen')}
          />
          <FlatList
            ref={prosScrollRef}
            data={independentProsList}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <ServiceAtHomeCard
                independentPro={item}
                onPress={() =>
                  navigation.navigate('ProfessionalDetailScreen', {
                    id: item._id,
                  })
                }
              />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={() => {}}
          />

          {/* --- Nearby Offers --- */}
          <SectionHeader title="Salon Home Services" />
          <View style={{ paddingHorizontal: 16 }}>
            <NearbyOfferCard
              imageUrl={require('../../../assets/featuredSalon.png')}
              category="Hair • Facial"
              name="Maroon's Luxury Salon"
              address="Kukatpally, Hyderabad"
              rating="4.8"
              reviews="3.7k"
              discount="15% Off"
              icon="home"
              salonBadge="Home Services"
            />
          </View>

          <SectionHeader title="Unisex Salons" />
          <View style={{ paddingHorizontal: 16 }}>
            {unisexSalons.length === 0 ? (
              <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                No unisex salons found nearby
              </Text>
            ) : (
              unisexSalons.map(unisexSalon => (
                <UnisexCard
                  key={unisexSalon._id}
                  unisexSalon={unisexSalon}
                  icon="male-female"
                  salonBadge="Unisex"
                  onPress={() =>
                    navigation.navigate('SalonDetailScreen', {
                      salonId: unisexSalon._id,
                    })
                  }
                />
              ))
            )}
          </View>
          <View style={[styles.footerLogoContainer]}>
            <Image 
              source={require('../../../assets/GlownifyLogoPng.png')} 
              style={styles.glownify}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  promoContainer: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  promoImage: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
    marginRight: 16,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 8,
    justifyContent: 'flex-start',
    gap: 10, // ⭐ adds equal space between items
  },

  categoryItem: {
    alignItems: 'center',
    width: '23%', // ⭐ adjust to fit 4 items per row OR 3 (your choice)
    marginBottom: 16,
  },
  categoryIcon: {
    backgroundColor: colors.primaryLight,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  toggleButtonLeft: {
    borderRadius: 30,
  },
  toggleButtonRight: {
    borderRadius: 30,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleIcon: {
    width: 30,
    height: 30,
    marginRight: 6,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  toggleTextActive: {
    color: colors.white,
  },

  horizontalScroll: {
    paddingLeft: 16,
    paddingVertical: 10,
  },
  salonCardWrapper: {
    marginRight: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    height: 'auto',
    overflow: 'hidden',
    position: 'relative',
  },
  bannerSlide: {
    width: '100%',
  },
  footerLogoContainer: {
    alignItems: 'center',
    opacity: 0.5,
    paddingBottom: 20
  },
  glownify:{height: 100, width: 110}
});
