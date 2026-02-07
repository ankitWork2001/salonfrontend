import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens
import HomeScreen from '../screens/UserScreens/HomeScreen/HomeScreen';
import BookingScreen from '../screens/UserScreens/Bookings/BookingScreen';
import SearchScreen from '../screens/UserScreens/SearchScreen';
import MessageScreen from '../screens/UserScreens/MessageScreen';
import OfferScreen from '../screens/UserScreens/OfferScreen'
import ShopDetailsSummaryScreen from '../screens/UserScreens/ShopDetails/ShopDetailsSummaryScreen';
import ShopDetailsFullScreen from '../screens/UserScreens/ShopDetails/ShopDetailsFullScreen';
import ServiceDetailsScreen from '../screens/UserScreens/ServiceDetails/ServiceDetailsScreen';
import ProfileScreen from '../screens/UserScreens/ProfileScreen';
import UserBookingsScreen from '../screens/UserScreens/BookingScreen';
import AIBasedHairs from '../screens/UserScreens/AIBasedHairs';
import SalonsListScreen from '../screens/UserScreens/SalonsListScreen';
import AllSalonListScreen from '../screens/UserScreens/AllSalonListScreen';
import ProfileEditScreen from '../screens/UserScreens/ProfileEditScreen';
import ServicesMenuScreen from '../screens/UserScreens/ServiceAtHomeScreen/ServicesMenuScreen'
import ProfessionalsListScreen from '../screens/UserScreens/ServiceAtHomeScreen/ProfessionalsListScreen'
import ProfessionalDetailScreen from '../screens/UserScreens/ServiceAtHomeScreen/ProfessionalDetailScreen'

import SelectDateAndTime from '../screens/UserScreens/Bookings/SelectDateAndTime';
import CartScreen from '../screens/UserScreens/CartScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

// --- AESTHETIC REFINEMENT: Define color palette ---

const colors = {
  primary: '#156778',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  inactive: '#B0BEC5',
  inactiveLight: '#E0E0E0',
  black: '#000000',
  badge: '#FFA500', // Orange
  shadow: '#000000',
};

// --- Tab Icon Images ---
const tabIcons = {
  home: {
    active: require('../assets/tab-icons/GlownifyLogoPng.png'),
    inactive: require('../assets/tab-icons/GlownifyLogoPng.png'),
  },
  offer: {
    active: require('../assets/tab-icons/offer_fill.png'),
    inactive: require('../assets/tab-icons/offer.png'),
  },
  cart: {
    active: require('../assets/tab-icons/cart_fill.png'),
    inactive: require('../assets/tab-icons/cart.png'),
  },
  bookings: {
    active: require('../assets/tab-icons/booking_fill.png'),
    inactive: require('../assets/tab-icons/booking.png'),
  },
  profile: {
    active: require('../assets/tab-icons/profile_fill.png'),
    inactive: require('../assets/tab-icons/profile.png'),
  },
};

// --- Custom Tab Icon Component ---
const TabIcon = ({ focused, icon, size = 26, showBadge = false }) => {
  return (
    <View style={styles.iconContainer}>
      {focused && <View style={styles.activeBar} />}
      <View style={[
        styles.iconWrapper,
        focused && styles.iconWrapperActive
      ]}>
        <Image
          source={focused ? icon.active : icon.inactive}
          style={{
            width: size,
            height: size,
          }}
          resizeMode="contain"
        />
      </View>
      {!focused && showBadge && <View style={styles.badge} />}
    </View>
  );
};

export function CartStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="SelectDateAndTime" component={SelectDateAndTime} />
    </Stack.Navigator>
  );
}


// --- Your Navigators ---
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="ShopDetailsSummary" component={ShopDetailsSummaryScreen} />
      <Stack.Screen name="ShopDetailsFull" component={ShopDetailsFullScreen} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="UserBookingsScreen" component={UserBookingsScreen} />
      <Stack.Screen name="ProfileEditScreen" component={ProfileEditScreen} />
      <Stack.Screen name="SalonsListScreen" component={SalonsListScreen} />
      <Stack.Screen name="ServicesMenuScreen" component={ServicesMenuScreen}/>
      <Stack.Screen name="ProfessionalsListScreen" component={ProfessionalsListScreen} />
      <Stack.Screen name="ProfessionalDetailScreen" component={ProfessionalDetailScreen} />
      <Stack.Screen name="AllSalonListScreen" component={AllSalonListScreen} />

    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.primary }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 65,
            backgroundColor: colors.white,
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
            elevation: 10,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }}
      >
        {/* --- Screen 1: Home --- */}
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={({ route }) => ({
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
              if (
                [
                  // 'ShopDetailsSummary',
                  // 'ShopDetailsFull',
                  // 'ServiceDetails',
                  'Booking',
                  'SearchScreen',
                ].includes(routeName)
              ) {
                return { display: 'none' };
              }
              return {
                height: 65,
                backgroundColor: colors.white,
                borderTopWidth: 1,
                borderTopColor: '#F0F0F0',
                elevation: 10,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                paddingBottom: 8,
                paddingTop: 8,
              };
            })(route),
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={tabIcons.home}
                size={focused ? 34 : 26}  // Increased size when active
              />
            ),
          })}
        />

        {/* --- Screen 2: Offers --- */}
        <Tab.Screen
          name="OfferTab"
          component={OfferScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tabIcons.offer} showBadge={true} />
            ),
          }}
        />

        {/* --- Screen 4: Bookings --- */}
        <Tab.Screen
          name="BookingsTab"
          component={UserBookingsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tabIcons.bookings} />
            ),
          }}
        />

        {/* --- Screen 5: Profile --- */}
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tabIcons.profile} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- FAB Styles ---
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -35,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: colors.white, // Default border color
  },
  fabIcon: {
    width: 54,
    height: 54,
  },
  
  // --- Icon Container Styles ---
  iconContainer: {
    width: 50,
    height: 36,
    justifyContent: 'flex-end', 
    alignItems: 'center',
    position: 'relative',
  },
  
  // Icon Wrapper for background effect
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  iconWrapperActive: {
    backgroundColor: colors.primaryLight,
  },
  
  // Badge
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badge,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  
  // Active Bar Indicator
  activeBar: {
    position: 'absolute',
    top: 0,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
