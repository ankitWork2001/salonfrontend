import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { logoutUser } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAndGoToSalonRegistration } from '../../utils/NavigationHelper';

// Menu Items
const MENU_ITEMS = [
  {
    id: 1,
    title: 'My Profile',
    subtitle: 'View and edit profile',
    icon: 'person',
    section: 'account',
  },
  {
    id: 2,
    title: 'Bookings',
    subtitle: 'View your bookings',
    icon: 'calendar',
    section: 'account',
  },
  {
    id: 3,
    title: 'Saved Salons',
    subtitle: 'Your favorite salons',
    icon: 'heart',
    section: 'account',
  },
  {
    id: 4,
    title: 'Refer & Earn',
    subtitle: 'Earn rewards with referral',
    icon: 'gift',
    section: 'rewards',
    badge: 'New',
  },
  {
    id: 5,
    title: 'Promotions',
    subtitle: 'Active deals & offers',
    icon: 'pricetag',
    section: 'rewards',
  },
  {
    id: 6,
    title: 'Wallet',
    subtitle: 'Check your balance',
    icon: 'wallet',
    section: 'rewards',
  },
  {
    id: 7,
    title: 'About Us',
    subtitle: 'Learn more about us',
    icon: 'information-circle',
    section: 'other',
  },
  {
    id: 8,
    title: 'Privacy Policy',
    subtitle: 'Terms & conditions',
    icon: 'lock-closed',
    section: 'other',
  },
  {
    id: 9,
    title: 'Notification Preferences',
    subtitle: 'Manage notifications',
    icon: 'notifications',
    section: 'other',
  },
  {
    id: 10,
    title: 'Contact Us',
    subtitle: 'Get in touch',
    icon: 'call',
    section: 'other',
  },
  {
    id: 11,
    title: 'Earn With Us',
    subtitle: 'Become a partner',
    icon: 'briefcase',
    section: 'earnwithus',
  },
];

export default function UserProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleMenuPress = (item) => {
  switch (item.title) {
    case 'Bookings':
      navigation.navigate("HomeTab", { screen: "UserBookingsScreen" });
      break;
    case 'My Profile':
      navigation.navigate("HomeTab", { screen: "ProfileEditScreen" });
      break;
      case 'Earn With Us':
      logoutAndGoToSalonRegistration(navigation, dispatch);
      break;
    default:
      Alert.alert(item.title, `${item.subtitle} - Coming soon!`);
  }
};

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logoutUser()),
      },
    ]);
  };

  const renderMenuSection = (sectionTitle, sectionKey) => {
    const items = MENU_ITEMS.filter((item) => item.section === sectionKey);

    if (items.length === 0) return null;

    return (
      <View key={sectionKey} style={styles.sectionContainer}>
        {sectionTitle && (
          <Text style={styles.sectionLabel}>{sectionTitle}</Text>
        )}
        <View style={styles.menuItemsContainer}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index !== items.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Icon name={item.icon} size={22} color="#156778" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
                <Icon name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // If not logged in, show login prompt
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.loginPromptContainer}>
          <Icon name="person-circle" size={80} color="#ddd" />
          <Text style={styles.loginPromptTitle}>Sign In Required</Text>
          <Text style={styles.loginPromptText}>
            Please login to access your profile
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation?.navigate('Auth')}
          >
            <Text style={styles.loginButtonText}>Sign In Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#156778" />
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image
            source={{ uri: user?.image || 'https://via.placeholder.com/80?text=User' }}
            style={styles.userImage}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
            <Text style={styles.userPhone}>{user?.phone || '+91 XXXXX XXXXX'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("HomeTab", { screen: "ProfileEditScreen" })} style={styles.editIcon}>
            <Icon name="pencil" size={18} color="#156778" />
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {renderMenuSection(null, 'account')}
        {renderMenuSection('Earn With Us', 'earnwithus')}
        {renderMenuSection('Rewards', 'rewards')}
        {renderMenuSection('Other Information', 'other')}

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out" size={18} color="#f44336" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#156778',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#156778',
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerPlaceholder: {
    width: 40,
  },
  userCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  userPhone: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  editIcon: {
    padding: 8,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuItemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginVertical: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f44336',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 6,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f44336',
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  loginPromptTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#7C5FED',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});