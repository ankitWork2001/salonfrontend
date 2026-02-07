// src/screens/Onboarding/Onboarding2.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import image from '../../assets/Onboarding/onboarding2.png';

// A different placeholder image for the second screen.
const backgroundImage = image;

export default function Onboarding2({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* Semi-transparent overlay for better text readability */}
        <View style={styles.overlay} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Onboarding4')}
          style={styles.skipbtn}
        >
          <Text>{'SKIP>>'}</Text>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Meet Our Specialists</Text>
          <Text style={styles.subtitle}>
            There are many best stylists from all the best salons ever
          </Text>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Onboarding1')}
              style={styles.dot}
            />
            <TouchableOpacity style={[styles.dot, styles.activeDot]} />
            <TouchableOpacity
              onPress={() => navigation.navigate('Onboarding3')}
              style={styles.dot}
            />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => navigation.navigate('Onboarding3')}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.signInLink}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns content to the bottom
    paddingBottom: 60,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire parent
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay
  },
  skipbtn:{marginBottom: 520, marginLeft: 360 },
  contentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40, // Space from the bottom edge
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0', // Lighter than pure white
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Inactive dot color
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#FFA500', // Active dot color (Orange)
    width: 20, // Make the active dot wider
  },
  nextButton: {
    backgroundColor: '#156778', // Teal color from the design
    paddingVertical: 18,
    borderRadius: 30, // For the pill shape
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 15,
  },
  signInLink: {
    color: '#FFA500', // Orange color to match the active dot
    fontWeight: 'bold',
  },
});
