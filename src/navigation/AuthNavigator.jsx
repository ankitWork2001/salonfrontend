import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import EmailVerificationScreen from '../screens/Auth/EmailVerificationScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import RoleSelectionScreen from '../screens/Auth/RoleSelectionScreen';
import SalonOwnerRegistrationScreen from '../screens/Auth/SalonOwnerRegistrationScreen';
import IndependentRegistrationScreen from '../screens/Auth/IndependentRegistrationScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="SalonOwnerRegistration" component={SalonOwnerRegistrationScreen} />
      <Stack.Screen name="IndependentRegistration" component={IndependentRegistrationScreen} />
    </Stack.Navigator>
  );
}