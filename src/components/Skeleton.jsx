import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const Skeleton = ({ style }) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  shimmer: {
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
