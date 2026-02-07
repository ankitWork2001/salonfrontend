import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock data
const MOCK_STATS = {
  totalBookings: 24,
  pendingBookings: 5,
  acceptedBookings: 12,
  completedBookings: 7,
};

const MOCK_RECENT_BOOKINGS = [
  {
    id: 1,
    customer: 'Priya Sharma',
    service: 'Hair Cut',
    date: '2025-10-30',
    status: 'pending',
  },
  {
    id: 2,
    customer: 'Amit Patel',
    service: 'Hair Spa',
    date: '2025-10-30',
    status: 'pending',
  },
  {
    id: 3,
    customer: 'Anjali Verma',
    service: 'Coloring',
    date: '2025-10-29',
    status: 'accepted',
  },
];

const MOCK_TOP_SPECIALISTS = [
  { id: 1, name: 'Raj Kumar', bookings: 18 },
  { id: 2, name: 'Neha Singh', bookings: 12 },
  { id: 3, name: 'Arjun Reddy', bookings: 10 },
];

export default function SalonAdminDashboard({navigation}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'accepted':
        return '#4CAF50';
      case 'completed':
        return '#2196F3';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
       {/* Header */}
<View style={styles.header}>
  <View style={styles.headerTop}>
    <Text style={styles.greeting}>Welcome Back!</Text>
    <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('SalonNotifications')}>
      <Icon name="notifications-outline" size={24} color="#fff" />
      {/* Optional: add badge */}
      <View style={styles.notificationBadge}>
        <Text style={styles.badgeText}>3</Text>
      </View>
    </TouchableOpacity>
  </View>
  <Text style={styles.date}>Today's Overview</Text>
</View>


        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCard1]}>
            <Icon name="calendar" size={24} color="#fff" />
            <Text style={styles.statNumber}>{MOCK_STATS.totalBookings}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>

          <View style={[styles.statCard, styles.statCard2]}>
            <Icon name="time" size={24} color="#fff" />
            <Text style={styles.statNumber}>{MOCK_STATS.pendingBookings}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={[styles.statCard, styles.statCard3]}>
            <Icon name="checkmark-circle" size={24} color="#fff" />
            <Text style={styles.statNumber}>{MOCK_STATS.acceptedBookings}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>

          <View style={[styles.statCard, styles.statCard4]}>
            <Icon name="trophy" size={24} color="#fff" />
            <Text style={styles.statNumber}>{MOCK_STATS.completedBookings}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Recent Bookings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          {MOCK_RECENT_BOOKINGS.map((booking) => (
            <View key={booking.id} style={styles.bookingItem}>
              <View style={styles.bookingInfo}>
                <Text style={styles.customerName}>{booking.customer}</Text>
                <Text style={styles.service}>{booking.service}</Text>
                <Text style={styles.bookingDate}>{booking.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(booking.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Specialists Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Specialists</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All →</Text>
            </TouchableOpacity>
          </View>

          {MOCK_TOP_SPECIALISTS.map((specialist, index) => (
            <View key={specialist.id} style={styles.specialistItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.specialistInfo}>
                <Text style={styles.specialistName}>{specialist.name}</Text>
                <Text style={styles.bookingCount}>
                  {specialist.bookings} bookings
                </Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#156778" />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#156778',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  headerTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
notificationButton: {
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
},
notificationBadge: {
  position: 'absolute',
  top: 2,
  right: 2,
  backgroundColor: '#FF0000',
  width: 16,
  height: 16,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
},
badgeText: {
  color: '#fff',
  fontSize: 10,
  fontWeight: '700',
},
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 13,
    color: '#ddd',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  statCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginVertical: 6,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statCard1: {
    backgroundColor: '#156778',
  },
  statCard2: {
    backgroundColor: '#FF9800',
  },
  statCard3: {
    backgroundColor: '#4CAF50',
  },
  statCard4: {
    backgroundColor: '#2196F3',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  viewAll: {
    fontSize: 12,
    color: '#156778',
    fontWeight: '600',
  },
  bookingItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  service: {
    fontSize: 12,
    color: '#156778',
    marginTop: 2,
  },
  bookingDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  specialistItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#156778',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  specialistInfo: {
    flex: 1,
  },
  specialistName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  bookingCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});