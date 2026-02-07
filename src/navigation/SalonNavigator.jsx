import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Import Screens - Bottom Tab Screens
import SalonAdminDashboard from '../screens/SalonAdminScreens/SalonAdminDashboard';
import MyView from '../screens/SalonAdminScreens/MyView';
import SalonBookingsScreen from '../screens/SalonAdminScreens/bookings/SalonBookingsScreen';
import ManageSpecialistScreen from '../screens/SalonAdminScreens/Specialists/ManageSpecialistScreen';
import ManageServicesScreen from '../screens/SalonAdminScreens/ManageServicesScreen';
import SalonProfileScreen from '../screens/SalonAdminScreens/SaloonProfileScreen';

// Import Screens - Stack Screens (Not in tabs)
import SalonNotificationsScreen from '../screens/SalonAdminScreens/SalonNotificationsScreen';

// Import NEW Screens for Task 2
import ManageCategoriesScreen from '../screens/SalonAdminScreens/ManageCategoriesScreen';
import ServiceAddOnsScreen from '../screens/SalonAdminScreens/ServiceAddOnsScreen';
import ComboPackagesScreen from '../screens/SalonAdminScreens/ComboPackagesScreen';

// Import Other
import SubscriptionPlanScreen from '../screens/SubscriptionPlanScreen';
import { checkSubscription } from '../utils/checkSubscription';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const colors = {
  primary: '#156778',
  white: '#FFFFFF',
  inactive: '#E0E0E0',
  badge: '#FFA500',
};

// Bottom Tabs
function SalonTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
      fontSize: 11,
      marginTop: 2,
    },
    tabBarActiveTintColor: colors.white,
    tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          height: 60,
          backgroundColor: colors.primary,
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 5,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={SalonAdminDashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBar} />}
              <Icon
                name={focused ? 'grid' : 'grid-outline'}
                size={26}
                color={focused ? colors.white : colors.inactive}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="MyView"
        component={MyView}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBar} />}
              <Icon
                name={focused ? 'eye' : 'eye-outline'}
                size={26}
                color={focused ? colors.white : colors.inactive}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={SalonBookingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBar} />}
              <Icon
                name={focused ? 'calendar' : 'calendar-outline'}
                size={26}
                color={focused ? colors.white : colors.inactive}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Specialist"
        component={ManageSpecialistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBar} />}
              <Icon
                name={focused ? 'person-add' : 'person-add-outline'}
                size={26}
                color={focused ? colors.white : colors.inactive}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ManageServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBar} />}
              <Icon
                name={focused ? 'cut' : 'cut-outline'}
                size={26}
                color={focused ? colors.white : colors.inactive}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={SalonProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeBar} />}
              <Icon
                name={focused ? 'person' : 'person-outline'}
                size={26}
                color={focused ? colors.white : colors.inactive}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Stack Navigator with Tabs + Extra Screens
export default function SalonStackNavigator({ navigation }) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    const verifySubscription = async () => {
      const isActive = await checkSubscription();
      if (!isActive) setShowSubscriptionModal(true);
    };
    verifySubscription();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main Tabs */}
        <Stack.Screen
          name="SalonTabs"
          component={SalonTabs}
          options={{ animationEnabled: false }}
        />

        {/* Screens not in tabs */}
        <Stack.Screen
          name="SalonNotifications"
          component={SalonNotificationsScreen}
          options={{
            animationEnabled: true,
            animationTypeForReplace: 'pop',
          }}
        />

        {/* Task 2 - Service Management Screens */}
        <Stack.Screen
          name="ManageCategories"
          component={ManageCategoriesScreen}
          options={{
            animationEnabled: true,
            animationTypeForReplace: 'pop',
          }}
        />

        <Stack.Screen
          name="ServiceAddOns"
          component={ServiceAddOnsScreen}
          options={{
            animationEnabled: true,
            animationTypeForReplace: 'pop',
          }}
        />

        <Stack.Screen
          name="ComboPackages"
          component={ComboPackagesScreen}
          options={{
            animationEnabled: true,
            animationTypeForReplace: 'pop',
          }}
        />
      </Stack.Navigator>

      {/* Subscription Modal */}
      <Modal
        visible={showSubscriptionModal}
        transparent={true}
        animationType="slide"
      >
        <SubscriptionPlanScreen
          navigation={navigation}
          closeModal={() => setShowSubscriptionModal(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeBar: {
    position: 'absolute',
    top: -10,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
});