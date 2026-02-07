import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { hideCartPopup } from '../redux/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';

export default function CartPopup() {
  const { items, visible, isCartScreenFocused } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(100)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;

  const totalServices = items.reduce(
    (sum, p) => sum + p.services.length, 0
  );

  // Show cart permanently when items exist
  const shouldShow = totalServices > 0 && !isCartScreenFocused;

  // Slide in/out animation
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: shouldShow ? 0 : 100,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [shouldShow]);

  // Pulse animation when new item added (triggered by visible state)
  useEffect(() => {
    if (visible && totalServices > 0) {
      // Pulse effect
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Badge pop animation
      badgeScale.setValue(0);
      Animated.spring(badgeScale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }).start();

      // Auto-hide the "new item" indicator after 3 seconds
      const timer = setTimeout(() => {
        dispatch(hideCartPopup());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, totalServices]);

  if (totalServices === 0 || isCartScreenFocused) return null;

  return (
    <Animated.View
      key={totalServices}
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => {
          dispatch(hideCartPopup());
          navigation.navigate('CartStack');
        }}
        activeOpacity={0.85}
      >
        {/* Badge with count */}
        <Animated.View 
          style={[
            styles.badge,
            { 
              transform: [
                { scale: visible ? badgeScale : 1 }
              ] 
            }
          ]}
        >
          <Text style={styles.badgeText}>{totalServices}</Text>
        </Animated.View>

        {/* Cart content */}
        <Animated.View 
          style={[
            styles.content,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🛒</Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {visible ? '✓ Added to Cart' : 'View Cart'}
            </Text>
            <Text style={styles.subtitle}>
              {totalServices} {totalServices === 1 ? 'service' : 'services'}
            </Text>
          </View>

          <Text style={styles.arrow}>→</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 90,
    right: 90,
    zIndex: 1000,
  },
  cartButton: {
    backgroundColor: '#156778',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4757',
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '500',
  },
  arrow: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 8,
  },
});
