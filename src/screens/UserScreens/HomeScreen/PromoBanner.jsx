import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";

// Animation duration constant - must match HomeScreen's BANNER_DISPLAY_DURATION
export const PROMO_BANNER_DURATION = 6000; 

// --- Color Palette ---
const Colors = {
  primary: "#156778",
  secondary: "#156778",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  white: "#FFFFFF",
  cardBackground: "#FAFAFA",
};

// --- Continuously Animated Icon Box ---
const StepIcon = ({ iconChar, delay = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    
    // Continuous glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  

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

// --- Continuously Animated Salon Card ---
const SalonCard = ({ title, location, rating, count, price, index }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous float effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -3,
          duration: 2000 + index * 500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000 + index * 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Continuous shine effect
    Animated.loop(
      Animated.sequence([
        Animated.delay(index * 500),
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
      ])
    ).start();
  }, []);

  const shine = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <Animated.View
      style={[
        styles.salonCard,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: Animated.add(slideAnim, floatAnim) },
            { scale: shine },
          ],
        },
      ]}
    >
      <View style={styles.cardImage}>
        <Text style={{ fontSize: 20 }}>🖼️</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardLocation}>{location}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.countText}>{count}</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{price}</Text>
          <Text style={styles.orText}>or</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// --- Continuously Animated Phone Mockup ---
const PhoneMockup = () => {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        // delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        // duration: 800,
        // delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
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
      <View style={styles.notchRow} />

      <View style={styles.headerRow}>
        <View style={styles.circleIcon}>
          <Text>🔍</Text>
        </View>
        <Text style={styles.menuIcon}>≡</Text>
      </View>

      <Text style={styles.screenTitle}>Book a Salon Visit</Text>

      <ScrollView style={styles.listScroll}>
        <SalonCard
          title="Glow Up Studio"
          location="Khar"
          rating="4.8"
          count="625"
          price="1500"
          index={0}
        />
        <SalonCard
          title="Stylista"
          location="Bandra"
          rating="4.8"
          count="202"
          price="2000"
          index={1}
        />
        <SalonCard
          title="Salon 360"
          location="Andheri"
          rating="4.7"
          count="88"
          price="1300"
          index={2}
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </Animated.View>
  );
};

// --- Continuously Animated Steps Section ---
const StepItem = ({ step, title, description, iconChar, isLast, delay }) => {
  const slideAnim = useRef(new Animated.Value(-30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const lineHeightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();

    // Line growth animation - starts after step item appears
    if (!isLast) {
      Animated.sequence([
        Animated.delay(delay + 500), // Wait for step item to appear
        Animated.timing(lineHeightAnim, {
          toValue: 1,
          duration: 2000, // 2 second growth
          useNativeDriver: false, // height animation needs false
        }),
      ]).start();
    }
    
  }, []);

  const lineHeight = lineHeightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <Animated.View
      style={[
        styles.stepItem,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={{ alignItems: "center", marginRight: 20 }}>
        <StepIcon iconChar={iconChar} delay={delay} />
        {!isLast && (
          <Animated.View style={[styles.verticalLine, { height: lineHeight }]} />
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

export default function PromoBanner() {
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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Single header float (no loop to sync with banner lifecycle)
    Animated.timing(headerFloat, {
      toValue: -3,
      duration: 2500,
      useNativeDriver: true,
    }).start();

    // Footer entrance
    Animated.timing(footerFade, {
      toValue: 1,
      duration: 1000,
      delay: 1500,
      useNativeDriver: true,
    }).start();

    // Single footer pulse (no loop to sync with banner lifecycle)
    Animated.timing(footerPulse, {
      toValue: 1.15,
      duration: 1000,
      delay: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.mainWrapper}>
      <Animated.Text
        style={[
          styles.mainHeader,
          {
            opacity: headerFade,
            transform: [
              { translateY: Animated.add(headerSlide, headerFloat) },
            ],
          },
        ]}
      >
        Book Your Salon Appointment in 3 Easy Steps
      </Animated.Text>

      <View style={styles.container}>
        {/* Steps Section */}
        <View style={styles.leftBlock}>
          <StepItem
            step={1}
            title="Choose Your Salon"
            description="Browse nearby salons and pick your favorite one."
            iconChar="🏬"
            delay={0}
          />
          <StepItem
            step={2}
            title="Select Your Services"
            description="Haircut, grooming, facial & more."
            iconChar="✂️"
            delay={2000}
          />
          <StepItem
            step={3}
            title="Pick Date & Time + Confirm"
            description="Choose your slot & confirm instantly."
            iconChar="📅"
            isLast
            delay={4000}
          />
        </View>

        {/* Phone Mockup */}
        <View style={styles.rightBlock}>
          <PhoneMockup />
        </View>
      </View>

      {/* Footer */}
      {/* <Animated.View
        style={[
          styles.footer,
          {
            opacity: footerFade,
            transform: [{ scale: footerPulse }],
          },
        ]}
      >
        <Text style={styles.footerPoints}>
          • Fast Booking  • No Waiting  • Verified Salons
        </Text>
      </Animated.View> */}
    </ScrollView>
  );
}

// StyleSheet
const styles = StyleSheet.create({
  mainWrapper: {
    paddingVertical: 10,
    height: 360,
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  mainHeader: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 20,
  },
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  leftBlock: {
    width: "45%",
    paddingRight: 10,
  },
  rightBlock: {
    width: "50%",
    alignItems: "center",
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 5,
  },
  stepIconText: {
    fontSize: 18,
  },
  verticalLine: {
    width: 2,
    backgroundColor: Colors.secondary,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  stepNumber: {
    color: Colors.primary,
    fontWeight: "700",
  },
  stepDescription: {
    color: Colors.textSecondary,
    fontSize: 10,
  },
  phoneWrapper: {
    width: 150,
    height: 300,
    backgroundColor: Colors.white,
    borderWidth: 6,
    borderColor: "#333",
    borderRadius: 20,
    overflow: "hidden",
    padding: 8,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    shadowOpacity: 0.3,
  },
  notchRow: {
    alignItems: "center",
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circleIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#eee",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 22,
    color: "#666",
  },
  screenTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  listScroll: {
    height: 430,
  },
  salonCard: {
    flexDirection: "row",
    padding: 6,
    marginBottom: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardImage: {
    width: 20,
    height: 20,
    backgroundColor: "#D8B4FE",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 10,
    color: Colors.textPrimary,
  },
  cardLocation: {
    fontSize: 8,
    color: Colors.textSecondary,
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 3,
    alignItems: "center",
  },
  star: { color: "gold", marginRight: 5, fontSize: 8 },
  ratingText: { fontWeight: "700", color: Colors.textPrimary, fontSize: 8 },
  separator: { marginHorizontal: 5, color: Colors.textSecondary, fontSize: 8 },
  countText: { color: Colors.textSecondary, fontSize: 8 },
  priceRow: {
    flexDirection: "row",
    marginTop: 5,
    alignItems: "center",
  },
  price: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
    marginRight: 10,
  },
  orText: { color: Colors.textSecondary, fontSize: 10 },
  footer: {
    marginTop: 10,
    alignItems: "center",
  },
  footerPoints: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
