import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '../screens/SplashScreen';
import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SalonNavigator from './SalonNavigator';
import SuperAdminNavigator from './SuperAdminNavigator';
import IndependentNavigator from './IndependentNavigator';
import SalesmanNavigator from './SalesmanNavigator';
import SalesExecutiveNavigator from './SalesExecutiveNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { loadUserFromStorage } from '../redux/slices/authSlice';
import CartPopup from '../components/CartPopup';
import { CartStackNavigator } from './AppNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [checkingLaunch, setCheckingLaunch] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const dispatch = useDispatch();

  const { user, loading } = useSelector(state => state.auth);

  // ✅ Check first launch (for onboarding)
  useEffect(() => {
    const checkLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (!hasLaunched) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        }
      } catch (err) {
        console.error('Launch check failed', err);
      } finally {
        setCheckingLaunch(false);
      }
    };
    checkLaunch();
  }, []);

  // ✅ Load stored user/token on app startup
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // ✅ Show splash while checking launch or loading auth state
  if (checkingLaunch || loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        ) : !user ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : user.role === 'super_admin' ? (
          <Stack.Screen name="SuperAdmin" component={SuperAdminNavigator} />
        ) : user.role === 'salon_owner' ? (
          <Stack.Screen name="Salon" component={SalonNavigator} />
        ) : user.role === 'independent_pro' ? (
          <Stack.Screen name="Independent" component={IndependentNavigator} />
        ) : user.role === 'salesman' ? (
          <Stack.Screen name="Salesman" component={SalesmanNavigator} />
        ) : user.role === 'sales_executive' ? (
          <Stack.Screen name="SalesExecutive" component={SalesExecutiveNavigator} />
        ) : user.role == 'App' ? (
          <Stack.Screen name="App" component={AppNavigator} /> 

        ):
        
        (
          <>
            {/* Default user app */}
            <Stack.Screen name="App" component={AppNavigator} />
            {/* Cart stack outside of tabs */}
            <Stack.Screen name="CartStack" component={CartStackNavigator} />
          </>
        )}
      </Stack.Navigator>
      <CartPopup />
    </NavigationContainer>
  );
}
