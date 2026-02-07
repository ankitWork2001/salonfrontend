import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

export default function ServiceCard({ service, onAdd }) {
  // ✅ FIXED: Use 'items' from your cart slice
  const cartItems = useSelector(state => state.cart.items);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Debug log
  useEffect(() => {
    console.log('Cart items updated:', cartItems);
    console.log('Service ID:', service._id);
  }, [cartItems, service._id]);

  // Check if this service is in cart
  const getCartStatus = () => {
    if (!cartItems || cartItems.length === 0) {
      return { inCart: false, modes: [] };
    }

    const modesInCart = [];
    cartItems.forEach(provider => {
      if (provider.services && provider.services.length > 0) {
        provider.services.forEach(s => {
          if (s._id === service._id) {
            modesInCart.push(s.selectedMode);
          }
        });
      }
    });

    return { 
      inCart: modesInCart.length > 0, 
      modes: modesInCart 
    };
  };

  const { inCart, modes } = getCartStatus();

  // Animate when item is added
  useEffect(() => {
    if (inCart) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [inCart]);

  // Get display text
  const getAddedText = () => {
    if (modes.length === 2) return 'Both Added';
    if (modes.length > 0) {
      return modes[0] === 'salon' ? 'At Salon' : 'At Home';
    }
    return 'Added';
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: service.imageURL }} 
        style={styles.image}
        // defaultSource={require('../../../assets/placeholder.png')} // Fallback
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {service.name}
          </Text>
          {service.discount && (
            <View style={styles.discountBadge}>
              <Icon name="pricetag" size={12} color="#F59E0B" />
              <Text style={styles.discountText}>{service.discount}%</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>₹{service.price}</Text>
        <Text style={styles.duration}>{service.duration}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
      </View>

      {/* ✅ CONDITIONAL RENDERING */}
      {inCart ? (
        <Animated.View 
          style={[
            styles.addedContainer, 
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Icon name="checkmark-circle" size={28} color="#16A34A" />
          <Text style={styles.addedText}>{getAddedText()}</Text>
        </Animated.View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            console.log('Add pressed for:', service.name);
            onAdd(service);
          }}
        >
          <Icon name="add-circle" size={32} color="#156778" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: '#156778',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: '#fff',
  },
  addText: {
    color: '#156778',
    fontWeight: '700',
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#156778',
    borderRadius: 10,
    height: 40,
    marginTop: 20
    // paddingHorizontal: 7,
    // paddingVertical: 4,
  },
  counterBtn: {
    paddingHorizontal: 8,
    marginVertical: -20,
  },
  counterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    marginLeft: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: '#156778',
    marginTop: 4,
  },
  duration: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 6,
    lineHeight: 16,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    padding: 4,
  },
  addedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    padding: 4,
    minWidth: 50,
  },
  addedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A',
    marginTop: 4,
    textAlign: 'center',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
  },
});
