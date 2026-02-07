import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SpecialistSelector({ specialist, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={specialist.image} style={styles.image} />
        {isSelected && (
          <View style={styles.checkmark}>
            <Icon name="checkmark" size={16} color="#FFFFFF" />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {specialist.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  checkmark: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#156778',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});