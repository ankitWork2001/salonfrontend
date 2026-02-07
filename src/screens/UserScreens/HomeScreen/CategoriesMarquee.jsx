import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

const colors = {
  primary: '#156778',
  primaryLight: '#E1F5FA',
  white: '#FFFFFF',
  background: '#FFFFFF',
  textSecondary: '#6B7280',
};

const ITEM_WIDTH = 94; // width + marginRight

export default function CategoriesMarquee({ categories, navigation, location, selectedCategory }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const isUserScrolling = useRef(false);

  const startAnimation = (fromPosition = 0) => {
    const totalWidth = categories.length * ITEM_WIDTH;
    
    // Stop any existing animation
    animationRef.current?.stop();
    
    // Reset scrollX to current position
    scrollX.setValue(fromPosition);

    animationRef.current = Animated.loop(
      Animated.timing(scrollX, {
        toValue: fromPosition + totalWidth,
        duration: (totalWidth - (fromPosition % totalWidth)) / ITEM_WIDTH * 2000,
        easing: Easing.linear,
        useNativeDriver: true, // Changed to false for ScrollView compatibility
      }),
    );

    animationRef.current.start();
  };

  const stopAnimation = () => {
    animationRef.current?.stop();
    isUserScrolling.current = true;
  };

  const CategoryIcon = ({ uri }) => {
    const isSvg = uri?.endsWith('.svg');
    if (isSvg) return <SvgUri width={32} height={32} uri={uri} />;
    return (
      <Image
        source={{ uri }}
        style={{ width: 32, height: 32, resizeMode: 'contain' }}
      />
    );
  };

  // Duplicate list for infinite loop
  const data = [...categories, ...categories];

  useEffect(() => {
    startAnimation(0);

    const listenerId = scrollX.addListener(({ value }) => {
      if (!isUserScrolling.current) {
        const totalWidth = categories.length * ITEM_WIDTH;
        
        // Reset position for infinite loop
        if (value >= totalWidth) {
          scrollX.setValue(value % totalWidth);
        }
        
        scrollRef.current?.scrollTo({ x: value, animated: false });
      }
    });

    return () => {
      scrollX.removeListener(listenerId);
      stopAnimation();
    };
  }, [categories]);

  const handleScrollBeginDrag = () => {
    stopAnimation();
  };

  const handleScrollEndDrag = (event) => {
    const position = event.nativeEvent.contentOffset.x;
    setCurrentScrollPosition(position);
    isUserScrolling.current = false;
    
    // Small delay to ensure scroll has settled
    setTimeout(() => {
      startAnimation(position);
    }, 100);
  };

  const handleMomentumScrollEnd = (event) => {
    const position = event.nativeEvent.contentOffset.x;
    setCurrentScrollPosition(position);
    isUserScrolling.current = false;
    
    // Resume animation from current position
    startAnimation(position);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      scrollEnabled
      showsHorizontalScrollIndicator={false}
      style={{ marginTop: 8 }}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      scrollEventThrottle={16}
    >
      <View style={styles.categories}>
        {data.map((cat, index) => (
          <TouchableOpacity
            key={`${cat._id}-${index}`}
            style={styles.categoryItem}
            activeOpacity={0.7}
            onPress={() => {
              const lat = location?.latitude;
              const lng = location?.longitude;
              navigation.navigate('AllSalonListScreen', {
                category: selectedCategory,
                subCat: cat.name,
                lat,
                lng,
              });
            }}
          >
            <View style={styles.categoryIcon}>
              <CategoryIcon uri={cat.icon} />
            </View>
            <Text style={styles.categoryLabel} numberOfLines={1}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
  },

  categoryItem: {
    alignItems: 'center',
    width: 80,
    marginRight: 14,
  },

  categoryIcon: {
    backgroundColor: colors.primaryLight,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  categoryLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
});