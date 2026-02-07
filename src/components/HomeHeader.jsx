import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LocationContext } from '../components/LocationProvider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAddressFromCoords } from '../utils/geocoding';
import { LinearGradient } from 'react-native-linear-gradient';

export default function HomeHeader({ user, navigation }) {
  const { location, loading } = useContext(LocationContext);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (location) {
      getAddressFromCoords(location.latitude, location.longitude).then(
        setAddress,
      );
    }
  }, [location]);

  const renderLocation = () => {
    if (loading) {
      return (
        <View style={styles.locationBadge}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.locationText}>Fetching location...</Text>
        </View>
      );
    }

    if (location) {
      return (
        <View style={styles.locationBadge}>
          <View style={styles.locationIconContainer}>
            <Ionicons name="location-sharp" size={14} color="#fff" />
          </View>
          <Text style={styles.locationText} numberOfLines={1}>
            {address ||
              `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(
                4,
              )}`}
          </Text>
          <TouchableOpacity style={styles.changeLocationBtn}>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.locationBadge}>
        <Ionicons name="location-outline" size={14} color="#E1F5FA" />
        <Text style={styles.locationText}>Location unavailable</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#156778', '#156778', '#156778']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientHeader}
    >
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <View style={styles.greetingRow}>
            {/* <Text style={styles.waveEmoji}>👋</Text>
            <Text style={styles.headerTitle}>Hello, {user?.name || 'Guest'}!</Text> */}
            <Image
              source={require('../assets/tab-icons/GlownifyLogoPng.png')}
              style={styles.glonifyLogo}
            />
            <Text style={styles.headerTitle}>lownify</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Find the service you want, and book now!
          </Text>
          {renderLocation()}
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchScreen')}
            style={styles.searchButton}
          >
            <Ionicons name="search-outline" size={20} color="#156778" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={styles.notificationButton}
          >
            <Ionicons name="notifications-outline" size={20} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  glonifyLogo:{ width: 25, height: 25, marginTop:7 },
  gradientHeader: {
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    // paddingVertical: 8,
    paddingBottom: 14,
  },
  leftContainer: {
    flex: 1,
    paddingRight: 12,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  waveEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#E1F5FA',
    marginBottom: 12,
    lineHeight: 18,
    opacity: 0.9,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: '95%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 3,
    marginRight: 6,
  },
  locationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    letterSpacing: 0.2,
  },
  changeLocationBtn: {
    marginLeft: 4,
    padding: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  searchButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  notificationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF4757',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

// import React, { useContext, useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { LocationContext } from '../components/LocationProvider';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { getAddressFromCoords } from '../utils/geocoding';

// export default function HomeHeader({ user, navigation }) {
//   const { location, loading } = useContext(LocationContext);
//   const [address, setAddress] = useState('');

//   const colors = {
//     primary: '#156778',
//     white: '#FFFFFF',
//     textSecondary: '#E1F5FA',
//   };

//   useEffect(() => {
//     if (location) {
//       getAddressFromCoords(location.latitude, location.longitude).then(addr => {
//         setAddress(addr);
//       });
//     }
//   }, [location]);

//   const renderLocation = () => {
//     if (loading) {
//       return (
//         <View style={styles.locationContainer}>
//           <ActivityIndicator size="small" color={colors.white} />
//           <Text style={styles.locationText}>Fetching location...</Text>
//         </View>
//       );
//     }

//     if (location) {
//       return (
//         <View style={styles.locationContainer}>
//           <Ionicons name="location-sharp" size={16} color={colors.white} />
//           <Text style={styles.locationText} numberOfLines={1}>
//             {address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.locationContainer}>
//         <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
//         <Text style={styles.locationText}>Location unavailable</Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.header}>
//       <View style={styles.leftContainer}>
//         <Text style={styles.headerTitle}>Hello, {user?.name}</Text>
//         <Text style={styles.headerSubtitle}>Find the service you want, and book now!</Text>
//         {renderLocation()}
//       </View>

//       <TouchableOpacity
//         onPress={() => navigation.navigate('SearchScreen')}
//         style={styles.searchButton}
//       >
//         <Ionicons name="search-outline" size={22} color={colors.primary} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 18,
//     backgroundColor: '#156778',
//     borderBottomLeftRadius: 16,
//     borderBottomRightRadius: 16,
//   },
//   leftContainer: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     color: '#E1F5FA',
//     marginBottom: 8,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     maxWidth: '90%',
//   },
//   locationText: {
//     color: '#fff',
//     marginLeft: 4,
//     fontSize: 12,
//   },
//   searchButton: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
