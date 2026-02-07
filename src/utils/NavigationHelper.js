import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../redux/slices/authSlice';

export const logoutAndGoToSalonRegistration = async (navigation, dispatch) => {
  try {
    // Clear stored user data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Clear Redux state
    dispatch(logout());

    // Reset navigation to Auth stack
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );

    // Navigate to SalonOwnerRegistration inside AuthNavigator
    // navigation.navigate('SalonOwnerRegistration');
  } catch (error) {
    console.log('Error logging out:', error);
  }
};
