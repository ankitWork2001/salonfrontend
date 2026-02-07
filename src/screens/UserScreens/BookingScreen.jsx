import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBookings } from '../../redux/slices/bookingSlice';
import { useFocusEffect } from '@react-navigation/native';

export default function UserBookingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector(state => state.booking);
  const [activeTab, setActiveTab] = useState('upcoming');

 useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchUserBookings());
    }, [dispatch])
  );

  console.log("User Bookings:", bookings);

  // Helper to determine if a booking is "past" or "upcoming" based on date
  const getFilteredData = () => {
    if (!bookings || bookings.length === 0) return [];

    const now = new Date();
    return bookings.filter(item => {
      const bDate = new Date(item?.bookingDate);
      const type = bDate >= now ? 'upcoming' : 'past';
      return type === activeTab;
    });
  };

  const handleViewDetails = (booking) => {
  // Extract service names for the alert
  const serviceNames = booking.serviceItems?.map(s => s.service?.name).join(', ') || "Services";

  Alert.alert(
    'Booking Details',
    `ID: ${booking._id}\n` +
    `Status: ${booking.status.toUpperCase()}\n` +
    `Services: ${serviceNames}\n` +
    `Total: ₹${booking.totalAmount}`
  );
};

  const filteredBookings = getFilteredData();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'completed': return '#2196F3';
      case 'cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return '#E8F5E9';
      case 'pending': return '#FFF9C4';
      case 'completed': return '#E3F2FD';
      case 'cancelled': return '#FFEBEE';
      default: return '#f5f5f5';
    }
  };

  const renderBookingCard = (booking) => {
    // Dynamic Data Extraction with Fallbacks
    const salonName = booking.shopName || "Modern Cuts"; // Use provider name if available
    const services = booking.serviceItems?.map(s => s.service?.name).join(', ') || "No services listed";
    const displayPrice = booking.totalAmount || 0;
    const displayDate = booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : "Date TBD";
    const displayTime = booking.timeSlot?.start || "TBD";
    const status = booking.status || 'pending';

    return (
      <View key={booking._id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.salonHeader}>
            <Text style={styles.salonName}>{salonName}</Text>
            <Text style={styles.services} numberOfLines={1}>{services}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={16} color="#666" />
            <Text style={styles.detailText}>{displayDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="time" size={16} color="#666" />
            <Text style={styles.detailText}>{displayTime}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="location" size={16} color="#666" />
            <Text style={styles.detailText}>{booking.bookingType === 'in_salon' ? 'At Salon' : 'Home Service'}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <Text style={styles.price}>{displayPrice}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton} onPress={() => Alert.alert('Call', 'Contacting provider...')}>
              <Icon name="call" size={16} color="#156778" />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
  style={styles.viewDetailsButton}
  onPress={() => handleViewDetails(booking)} // <--- Make sure this is here
>
  <Text style={styles.viewDetailsButtonText}>View Details</Text>
</TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#156778" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
            <Icon name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Bookings</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.tabsContainer}>
          {['upcoming', 'past'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#156778" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {filteredBookings.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="calendar-outline" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No {activeTab} bookings</Text>
              </View>
            ) : (
              filteredBookings.map(renderBookingCard)
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#156778',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
    color: '#ffffffff',
  },
  backButton: {
    padding: 8,
  },
  headerPlaceholder: {
    width: 24,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  salonHeader: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  services: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
    marginVertical: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#156778',
    borderRadius: 6,
  },
  callButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#156778',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  viewDetailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#156778',
    borderRadius: 6,
  },
  viewDetailsButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});