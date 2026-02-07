import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function OfferScreen({ navigation }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar barStyle="light-content" backgroundColor="#156778" />

      {/* ---------- SAME HEADER AS BOOKINGS ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Offers</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      {/* --------------- BODY --------------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ padding: 16, backgroundColor: '#fff', flex: 1 }}
      >
        {/* -------- Top 2 Cards -------- */}
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.smallCard}>
            <Icon name="pricetag-outline" size={22} color="#3B82F6" />
            <Text style={styles.cardText}>3 Coupons</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.smallCard}>
            <Icon name="wallet-outline" size={22} color="#059669" />
            <Text style={styles.cardText}>₹299 Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* -------- Refer & Earn Banner -------- */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerTitle}>
              Refer & Earn{'\n'}Free Services
            </Text>

            <TouchableOpacity style={styles.knowMoreBtn}>
              <Text style={styles.knowMoreText}>KNOW MORE</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={require('../../assets/offer/offer.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {/* -------- 10% OFF Banner -------- */}
        <View style={styles.offerBanner}>
          <View>
            <Text style={styles.offerTitle}>Get{'\n'}10% OFF</Text>
            <Text style={styles.offerSubtitle}>on every booking!</Text>

            <TouchableOpacity style={styles.viewBtn}>
              <Text style={styles.viewBtnText}>VIEW BENEFITS</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={require('../../assets/offer/refer.png')}
            style={styles.offerImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* ---------- HEADER STYLES (Copied from Booking Screen) ---------- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#156778',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerPlaceholder: {
    width: 24,
  },

  /* ---------- EXISTING OFFER SCREEN STYLES ---------- */
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },

  smallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },

  cardText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },

  banner: {
    marginTop: 4,
    backgroundColor: '#E0E7FF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
  },

  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3A8A',
  },

  knowMoreBtn: {
    backgroundColor: '#FACC15',
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginTop: 10,
  },

  knowMoreText: {
    fontWeight: '700',
    color: '#1F2937',
  },

  bannerImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: 0,
    right: -30,
  },

  offerBanner: {
    backgroundColor: '#FEF9C3',
    padding: 18,
    borderRadius: 16,
    position: 'relative',
    minHeight: 200,
  },

  offerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
  },

  offerSubtitle: {
    fontSize: 16,
    marginTop: 4,
    color: '#374151',
  },

  viewBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 12,
  },

  viewBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  offerImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    bottom: -10,
    right: 0,
  },
});
