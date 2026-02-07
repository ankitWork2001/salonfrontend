import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Animation duration constant - must match HomeScreen's BANNER_DISPLAY_DURATION
export const PROMO_BANNER_2_DURATION = 6000; 

// --- Color Palette ---
const Colors = {
  primary: '#156778',
  secondary: '#117387',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  cardBackground: '#156778',
};

// --- Beautician Card Component ---
const BeauticianCard = ({ name, location, rating, count, price, image }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={image} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{name}</Text>
        <Text style={styles.cardLocation}>{location}</Text>

        <View style={styles.ratingRow}>
          <Text style={{ fontSize: 10 }}>{rating}</Text>
          <Text style={{ fontSize: 10 }}>⭐</Text>
          <Text style={{ fontSize: 10 }}>{count}</Text>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.iconBox}>
            <Text style={{ fontSize: 16 }}>📅</Text>
          </View>
          <Text style={styles.priceText}>₹{price}</Text>
        </View>
      </View>
    </View>
  );
};

// --- Phone Mockup Component ---
function PhoneMockup() {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        delay: 200,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        delay: 200,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.phoneWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }, { scale: pulseAnim }],
        },
      ]}
    >
      <View style={styles.topNotch}>
        <Ionicons
          name="search-outline"
          style={{ paddingTop: 4, paddingLeft: 4 }}
          size={12}
          color={Colors.primary}
        />
      </View>

      <Text style={styles.title}>Book a Beautician</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <BeauticianCard
          name="Aisha"
          location="Koregaon Park"
          rating="4.8"
          count="180"
          price="500"
          image={require('../../../assets/aisha.jpg')}
        />

        <BeauticianCard
          name="Gita"
          location="Baner"
          rating="4.8"
          count="210"
          price="600"
          image={require('../../../assets/gita.jpg')}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
}

// --- Continuously Animated Icon Box ---
const StepIcon = ({ iconChar, delay = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance (kept with nativeDriver: false to avoid issues)
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, [delay, scaleAnim, glowAnim]);

  return (
    <Animated.View
      style={[
        styles.stepIcon,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
        <Text style={styles.stepIconText}>{iconChar}</Text>
      </Animated.View>
    </Animated.View>
  );
};

// --- PromoBanner2 ---
export default function PromoBanner2() {
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const headerFloat = useRef(new Animated.Value(0)).current;
  const footerFade = useRef(new Animated.Value(0)).current;
  const footerPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Header entrance
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();

    // Single header float (no loop to sync with banner lifecycle)
    Animated.timing(headerFloat, {
      toValue: -3,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Footer entrance
    Animated.timing(footerFade, {
      toValue: 1,
      duration: 1000,
      delay: 1500,
      useNativeDriver: false,
    }).start();

    // Single footer pulse (no loop to sync with banner lifecycle)
    Animated.timing(footerPulse, {
      toValue: 1.15,
      duration: 1000,
      delay: 2000,
      useNativeDriver: false,
    }).start();
  }, [headerFade, headerSlide, headerFloat, footerFade, footerPulse]);

  // combine header translate values safely on JS driver
  const headerTranslateY = Animated.add(headerSlide, headerFloat);

  return (
    <ScrollView contentContainerStyle={styles.mainWrapper}>
      <Animated.Text
        style={[
          styles.mainHeader,
          {
            opacity: headerFade,
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        Book a Beautician/Barber at Home
      </Animated.Text>

      <View style={styles.container}>
        {/* Left Steps */}
        <View style={styles.leftBlock}>
          <StepItem2
            step={1}
            title="Choose Your Beautician"
            description="Browse available beauticians and pick your favorite one."
            iconChar="👩"
            delay={0}
          />

          <StepItem2
            step={2}
            title="Select Your Services"
            description="Choose the services you want — haircut, shave, or more."
            iconChar="✂️"
            delay={2000}
          />

          <StepItem2
            step={3}
            title="Pick Date & Time + Confirm"
            description="Select your convenient slot and confirm instantly."
            iconChar="📅"
            isLast
            delay={4000}
          />
        </View>

        {/* Right Image Mockup */}
        <View style={styles.rightBlock}>
          <View style={styles.mockupBox}>
            <PhoneMockup />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// --- Step Item 2 ---
const StepItem2 = ({ step, title, description, iconChar, isLast, delay }) => {
  // Each step uses a 2 second spacing (0, 2000, 4000) as requested.
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lineHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        // delay,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: false,
      }),
    ]).start();

    if (!isLast) {
      // grow vertical connecting line after the item appears
      Animated.sequence([
        Animated.delay(delay + 600),
        Animated.timing(lineHeightAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [delay, slideAnim, fadeAnim, lineHeightAnim, isLast]);

  const lineHeight = lineHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <Animated.View
      style={[
        styles.stepItem,
        { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      <View style={{ alignItems: 'center', marginRight: 20 }}>
        <StepIcon iconChar={iconChar} delay={delay} />
        {!isLast && (
          <Animated.View
            style={[styles.verticalLine, { height: lineHeight }]}
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.stepTitle}>
          <Text style={styles.stepNumber}>Step {step} </Text>
          {title}
        </Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  mainWrapper: {
    paddingVertical: 10,
    height: 360,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  leftBlock: { width: '45%', paddingRight: 10 },
  rightBlock: { width: '50%', alignItems: 'center' },
  stepItem: { flexDirection: 'row', marginBottom: 15 },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepIconText: { fontSize: 18 },
  verticalLine: { width: 2, marginTop: 0, backgroundColor: Colors.secondary },
  stepTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  stepNumber: { color: Colors.primary, fontWeight: '700' },
  stepDescription: { color: Colors.textSecondary, fontSize: 10 },
  footer: { marginTop: 10, alignItems: 'center' },
  footerPoints: { marginTop: 20, color: Colors.textSecondary, fontSize: 14 },
  phoneWrapper: {
    width: 150,
    height: 290,
    backgroundColor: '#F2E7FF',
    borderRadius: 20,
    borderWidth: 6,
    borderColor: 'black',
    paddingHorizontal: 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignSelf: 'center',
  },
  topNotch: {
    height: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
    color: '#3A2A74',
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 18,
    alignItems: 'center',
    zIndex: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginTop: -70,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E2E2E',
  },
  cardLocation: {
    fontSize: 10,
    color: '#6F6F6F',
  },
  ratingRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
});
