import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Screens ---
import SuperAdminDashboard from '../screens/SuperAdminScreens/SuperAdminDashboard';
import SalesExecutiveManagement from '../screens/SuperAdminScreens/Salesexecutivemanagement';
import ManageSalonsScreen from '../screens/SuperAdminScreens/ManageSalonsScreen';
import ManageUsersScreen from '../screens/SuperAdminScreens/ManageUsersScreen';
import ManageCategoriesScreen from '../screens/SuperAdminScreens/ManageCategoriesScreen';
import SuperAdminProfileScreen from '../screens/SuperAdminScreens/SuperAdminProfileScreen';
import ManageStateCityScreen from '../screens/SuperAdminScreens/ManageStateCityScreen';

const Tab = createBottomTabNavigator();

const colors = {
  primary: '#156778',
  white: '#FFFFFF',
  inactive: '#E0E0E0',
  black: '#000000',
  badge: '#FFA500',
};

export default function SuperAdminNavigator() {
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.primary }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 50,
            backgroundColor: colors.primary,
            borderTopWidth: 0,
            elevation: 0,
            paddingBottom: 5,
            paddingTop: 5,
          },
        }}
      >
        {/* --- Dashboard --- */}
        <Tab.Screen
          name="SuperDashboard"
          component={SuperAdminDashboard}
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

        {/* --- Sales Executive --- */}
        <Tab.Screen
          name="SalesExecutive"
          component={SalesExecutiveManagement}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeBar} />}
                <Icon
                  name={focused ? 'briefcase' : 'briefcase-outline'}
                  size={26}
                  color={focused ? colors.white : colors.inactive}
                />
              </View>
            ),
          }}
        />

        {/* --- Manage Salons --- */}
        <Tab.Screen
          name="ManageSalons"
          component={ManageSalonsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeBar} />}
                <Icon
                  name={focused ? 'business' : 'business-outline'}
                  size={26}
                  color={focused ? colors.white : colors.inactive}
                />
              </View>
            ),
          }}
        />

        {/* --- Manage Users --- */}
        <Tab.Screen
          name="ManageUsers"
          component={ManageUsersScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeBar} />}
                <Icon
                  name={focused ? 'people' : 'people-outline'}
                  size={26}
                  color={focused ? colors.white : colors.inactive}
                />
                {!focused && <View style={styles.badge} />}
              </View>
            ),
          }}
        />

        {/* --- Manage Categories --- */}
        <Tab.Screen
          name="ManageCategories"
          component={ManageCategoriesScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeBar} />}
                <Icon
                  name={focused ? 'pricetag' : 'pricetag-outline'}
                  size={26}
                  color={focused ? colors.white : colors.inactive}
                />
              </View>
            ),
          }}
        />

        {/* Manage StateCity */}
        <Tab.Screen
          name="ManageStateCity"
          component={ManageStateCityScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.iconContainer}>
                {focused && <View style={styles.activeBar} />}
                <Icon
                  name={focused ? 'location' : 'location-outline'}
                  size={26}
                  color={focused ? colors.white : colors.inactive}
                />
              </View>
            ),
          }}
        />

        {/* --- Profile --- */}
        <Tab.Screen
          name="SuperProfile"
          component={SuperAdminProfileScreen}
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
  badge: {
    position: 'absolute',
    top: 2,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badge,
    borderWidth: 1,
    borderColor: colors.white,
  },
});