import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function SkeletonLoadingScreen() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmer.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.4, 1, 0.4],
    }),
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <Animated.View style={[styles.headerSkeleton, shimmerStyle]} />

        {/* Promo Banner Skeleton */}
        <Animated.View style={[styles.bannerSkeleton, shimmerStyle]} />

        {/* Toggle Buttons */}
        <View style={styles.toggleRow}>
          <Animated.View style={[styles.toggleSkeleton, shimmerStyle]} />
          {/* <Animated.View style={[styles.toggleSkeleton, shimmerStyle]} /> */}
        </View>

        {/* Category Title */}
        <Animated.View style={[styles.sectionHeaderSkeleton, shimmerStyle]} />

        {/* Category Skeleton Grid */}
        <View style={styles.categoryGrid}>
          {[1, 2, 3, 4,].map((_, i) => (
            <View key={i} style={styles.categoryItem}>
              <Animated.View style={[styles.categoryCircle, shimmerStyle]} />
              <Animated.View style={[styles.categoryText, shimmerStyle]} />
            </View>
          ))}
        </View>

        {/* Salon Section Title */}
        <Animated.View style={[styles.sectionHeaderSkeleton, shimmerStyle]} />

        {/* Horizontal Salon Cards */}
        <View style={styles.salonRow}>
          {[1, 2, 3].map((_, i) => (
            <Animated.View key={i} style={[styles.salonCardSkeleton, shimmerStyle]} />
          ))}
        </View>

        {/* Service At Home Title */}
        <Animated.View style={[styles.sectionHeaderSkeleton, shimmerStyle]} />

        {/* Service At Home Card */}
        <Animated.View style={[styles.homeServiceSkeleton, shimmerStyle]} />

        {/* Nearby Offers Title */}
        <Animated.View style={[styles.sectionHeaderSkeleton, shimmerStyle]} />

        {/* Offer Card */}
        <Animated.View style={[styles.offerCardSkeleton, shimmerStyle]} />

      </View>
    </SafeAreaView>
  );
}

const colors = {
  primary: "#156778",
  light: "#E7E7E7",
  white: "#FFF",
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },

  // Header
  headerSkeleton: {
    width: "100%",
    height: 50,
    backgroundColor: colors.light,
    borderRadius: 8,
    marginTop: 16,
  },

  // Banner
  bannerSkeleton: {
    width: "100%",
    height: 240,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginTop: 16,
  },

  // Toggle Row
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  toggleSkeleton: {
    width: "98%",
    height: 60,
    backgroundColor: colors.light,
    borderRadius: 25,
  },

  // Section Header
  sectionHeaderSkeleton: {
    width: 160,
    height: 20,
    backgroundColor: colors.light,
    borderRadius: 6,
    marginTop: 24,
  },

  // Categories Grid
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "23%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.light,
  },
  categoryText: {
    width: 40,
    height: 10,
    backgroundColor: colors.light,
    borderRadius: 4,
    marginTop: 8,
  },

  // Salon Cards
  salonRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  salonCardSkeleton: {
    width: 160,
    height: 160,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginRight: 16,
  },

  // Service At Home
  homeServiceSkeleton: {
    width: "100%",
    height: 120,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginTop: 16,
  },

  // Offer Card
  offerCardSkeleton: {
    width: "100%",
    height: 130,
    backgroundColor: colors.light,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
  },
});
