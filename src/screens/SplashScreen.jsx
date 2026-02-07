// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Animated,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation sequence
    Animated.sequence([
      // Logo fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Text fade in after logo
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={require('../assets/GlownifyLogoPng.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Animated Title */}
      <Animated.Text 
        style={[
          styles.title,
          { opacity: textFadeAnim }
        ]}
      >
        Glownify ldshngjdsmngkjds,mn,m
      </Animated.Text>

      {/* Animated Subtitle */}
      <Animated.Text 
        style={[
          styles.subtitle,
          { opacity: textFadeAnim }
        ]}
      >
        Your Style, Our Passion
      </Animated.Text>

      {/* Loading Indicator */}
      <Animated.View style={[styles.loaderContainer, { opacity: textFadeAnim }]}>
        <View style={styles.loader}>
          <View style={styles.loaderDot} />
          <View style={[styles.loaderDot, styles.loaderDot2]} />
          <View style={[styles.loaderDot, styles.loaderDot3]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#156778',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 1,
     zIndex: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
    fontWeight: '500',
     zIndex: 10,
  },
  loaderContainer: {
    marginTop: 20,
  },
  loader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loaderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD700',
    marginHorizontal: 5,
  },
  loaderDot2: {
    opacity: 0.6,
  },
  loaderDot3: {
    opacity: 0.3,
  },
});
