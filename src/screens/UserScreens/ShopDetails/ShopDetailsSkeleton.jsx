import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from '../../../components/Skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ShopDetailsSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Skeleton style={styles.icon} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Skeleton style={styles.icon} />
            <Skeleton style={styles.icon} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Image Gallery */}
          <Skeleton style={styles.heroImage} />

          {/* Indicators */}
          <View style={styles.indicators}>
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} style={styles.dot} />
            ))}
          </View>

          {/* Info Section */}
          <View style={styles.section}>
            <Skeleton style={styles.title} />
            <Skeleton style={styles.subTitle} />

            <View style={styles.row}>
              <Skeleton style={styles.badge} />
              <Skeleton style={styles.badge} />
            </View>

            <View style={styles.row}>
              <Skeleton style={styles.smallText} />
              <Skeleton style={styles.smallText} />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Skeleton style={styles.sectionTitle} />
            <Skeleton style={styles.line} />
            <Skeleton style={styles.line} />
            <Skeleton style={[styles.line, { width: '70%' }]} />
          </View>

          {/* Opening Hours */}
          <View style={styles.section}>
            <Skeleton style={styles.sectionTitle} />
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.rowBetween}>
                <Skeleton style={styles.day} />
                <Skeleton style={styles.time} />
              </View>
            ))}
          </View>

          {/* Service Categories */}
          <View style={styles.section}>
            <Skeleton style={styles.sectionTitle} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} style={styles.chip} />
              ))}
            </ScrollView>
          </View>

          {/* Services */}
          {[1, 2].map(i => (
            <View key={i} style={styles.card}>
              <Skeleton style={styles.cardTitle} />
              <Skeleton style={styles.cardPrice} />
            </View>
          ))}

          

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#156678' },
  container: { flex: 1, backgroundColor: '#F8F9FA' },

  header: {
    position: 'absolute',
    zIndex: 10,
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },

  icon: { width: 40, height: 40, borderRadius: 20 },

  heroImage: { width, height: 200 },

  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },

  section: { backgroundColor: '#fff', padding: 16, marginBottom: 8 },

  title: { width: '60%', height: 22, marginBottom: 8 },
  subTitle: { width: '80%', height: 14, marginBottom: 12 },

  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },

  badge: { width: '45%', height: 28, borderRadius: 14 },
  smallText: { width: 80, height: 14 },

  sectionTitle: { width: 120, height: 18, marginBottom: 12 },
  line: { width: '100%', height: 14, marginBottom: 6 },

  day: { width: 80, height: 14 },
  time: { width: 100, height: 14 },

  chip: { width: 90, height: 32, borderRadius: 16, marginRight: 12 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  cardTitle: { width: '60%', height: 16, marginBottom: 8 },
  cardPrice: { width: '40%', height: 14 },

  thumb: { width: 100, height: 100, borderRadius: 12, marginRight: 12 },
  specialist: { width: 120, height: 160, borderRadius: 12, marginRight: 12 },

  reviewName: { width: '40%', height: 14, marginBottom: 6 },
  reviewLine: { width: '100%', height: 14 },
});
