import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SpecialistCard({ specialist }) {
  const imageUri =
    specialist.image && specialist.image.trim().length > 0
      ? specialist.image
      : null;

  return (
    <View style={styles.container}>
      <Image
        source={
          imageUri
            ? { uri: imageUri }
            : require('../../../assets/gita.jpg')
        }
        style={styles.image}
      />
      <Text style={styles.name} numberOfLines={1}>
        {specialist.name || 'Specialist'}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
});