import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

const services = [
  { id: 1, title: 'Haircut & Styling', duration: '30 min', certification: "L'Oréal Certified", price: '₹149' },
  { id: 2, title: 'Full Body Spa', duration: '90 min', certification: "Ayurveda Certified", price: '₹149' },
  { id: 3, title: 'Facial Treatment', duration: '45 min', certification: "Derma Certified", price: '₹599' },
  { id: 4, title: 'Manicure & Pedicure', duration: '60 min', certification: "OPI Certified", price: '₹799' },
  { id: 5, title: 'Manicure & Pedicure', duration: '60 min', certification: "OPI Certified", price: '₹799' },
  { id: 6, title: 'Manicure & Pedicure', duration: '60 min', certification: "OPI Certified", price: '₹799' },
  { id: 7, title: 'Manicure & Pedicure', duration: '60 min', certification: "OPI Certified", price: '₹799' },
];

const ServicesComponrnt = ({ service }) => {
  return (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceLeft}>
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <View style={styles.serviceInfoRow}>
          <Ionicons name="time-outline" size={16} color="#6C6C6C" />
          <Text style={styles.serviceInfoText}>{service.duration}</Text>
          <Ionicons
            name="ribbon-outline"
            size={16}
            color="#CE8F32"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.serviceInfoText}>{service.certification}</Text>
        </View>
      </View>
      <Text style={styles.servicePrice}>{service.price}</Text>
    </TouchableOpacity>
  );
};

const ProfessionalDetailsScreen = ({ navigation }) => {
  return (
    // Outer View sets the color for the "Notch" / Status Bar area on iOS & Android
    <View style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" translucent={false} />
      
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Main Content Wrapper - This holds your off-white background */}
        <View style={styles.contentWrapper}>
          
          {/* ---------- PROFILE HEADER ---------- */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
              style={styles.profileImg}
            />
            <View style={styles.headerRight}>
              <Text style={styles.name}>Priya Sharma</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#F4A100" />
                <Text style={styles.ratingValue}>4.9</Text>
                <Text style={styles.reviewText}>(234 reviews)</Text>
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={20} color="#3A9BFF" />
            </View>
          </View>

          {/* ---------- TAGS ---------- */}
          <View style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: '#FFC928' }]}>
              <Ionicons name="ribbon-outline" size={16} color="#fff" />
              <Text style={styles.tagText}>Top Rated</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#D633D8' }]}>
              <Ionicons name="woman-outline" size={16} color="#fff" />
              <Text style={styles.tagText}>Female</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#009DFF' }]}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
              <Text style={styles.tagText}>Verified</Text>
            </View>
          </View>

          {/* ---------- INFO CARDS ---------- */}
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Ionicons name="home-outline" size={26} color="#ED4E85" />
              <Text style={styles.infoTitle}>Home Visit</Text>
              <Text style={styles.infoValue}>₹99</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={26} color="#2DB27B" />
              <Text style={styles.infoTitle}>Distance</Text>
              <Text style={styles.infoValue}>2.5 km</Text>
            </View>
          </View>

          {/* ---------- SERVICES OFFERED ---------- */}
          <Text style={styles.sectionTitle}>Services Offered</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {services.map((service) => (
              <ServicesComponrnt key={service.id} service={service} />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProfessionalDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#FAF6F4',
    padding: 16,
    // Removed the large paddingTop so SafeAreaView can do its job
  },

  /* ----- HEADER ----- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    marginTop: 10,
  },
  profileImg: {
    width: 85,
    height: 85,
    borderRadius: 50,
  },
  headerRight: {
    marginLeft: 14,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingValue: {
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
    color: '#333',
  },
  reviewText: {
    fontSize: 14,
    marginLeft: 4,
    color: '#666',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    left: 65,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 15,
    elevation: 3,
  },

  /* ----- TAGS ----- */
  tagsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 13,
    fontWeight: '600',
  },

  /* ----- INFO CARD ----- */
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'space-around',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoTitle: {
    marginTop: 6,
    color: '#7E7E7E',
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },

  /* ----- SERVICES ----- */
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceLeft: {
    maxWidth: '70%',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  serviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  serviceInfoText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#156778', // Changed to match theme
  },
});