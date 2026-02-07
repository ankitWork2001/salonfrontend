import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function FloatingCartButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.cartButton}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('CartScreen')}
    >
      <Icon name="bag-handle" size={28} color="#fff" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>2</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#156778',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 999,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
