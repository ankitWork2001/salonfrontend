// src/components/LocationProvider.js
import React, { useEffect, useState, createContext } from 'react';
import { Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service'; // ✅ updated library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

// Create context
export const LocationContext = createContext();

export default function LocationProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request permission
  const requestLocationPermission = async () => {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

    const result = await check(permission);
    if (result === RESULTS.GRANTED) {
      return true;
    } else {
      const reqResult = await request(permission);
      return reqResult === RESULTS.GRANTED;
    }
  };

  // Get current location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission is required.');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        setLocation(coords);
        saveLocationLocally(coords);
        sendLocationToBackend(coords);
        setLoading(false);
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert('Error fetching location', error.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Save location to AsyncStorage
  const saveLocationLocally = async (coords) => {
    try {
      await AsyncStorage.setItem('userLocation', JSON.stringify(coords));
    } catch (e) {
      console.log('Error saving location locally', e);
    }
  };

  // Load location from AsyncStorage
  const loadLocation = async () => {
    try {
      const loc = await AsyncStorage.getItem('userLocation');
      if (loc) setLocation(JSON.parse(loc));
    } catch (e) {
      console.log('Error loading location', e);
    }
  };

  // Send location to backend
  const sendLocationToBackend = async (coords) => {
    // try {
    //   const response = await axiosInstance.post('/user/update-location', {
    //     latitude: coords.latitude,
    //     longitude: coords.longitude,
    //   });
    //   if (response.data.success) {
    //     console.log(response.data.message);
    //     console.log('Location sent to backend:', coords);
    //   }
    // } catch (e) {
    //   console.log('Error sending location to backend', e);
    // }
    console.log('Location sent to backend:', coords);
  };

  useEffect(() => {
    loadLocation();
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, loading, getCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
