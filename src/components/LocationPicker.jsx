import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LocationPicker({ navigation, route }) {
  const [marker, setMarker] = useState(null);

  const handleConfirm = () => {
    if (!marker) {
      Alert.alert('Pick Location', 'Please tap on the map to set location.');
      return;
    }
    route.params.onLocationSelect(marker); // Return selected location
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        provider={PROVIDER_DEFAULT} // Use default (OpenStreetMap)
        initialRegion={{
          latitude: 20.5937,
          longitude: 78.9629,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        onPress={(e) => setMarker(e.nativeEvent.coordinate)}
        mapType="standard" // standard map tiles
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
        <Icon name="checkmark-circle" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#7C5FED',
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});


// send mock cordinates
// coordinates: [28.6139, 77.2090], // TEMP FIXED TO DELHI

