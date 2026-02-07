import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock Bookings Data
const MOCK_BOOKINGS = [
  {
    id: 1,
    customerName: 'Priya Sharma',
    service: 'Hair Cut',
    specialist: 'Raj Kumar',
    date: '2025-10-30',
    time: '10:00 AM',
    status: 'pending', // pending, accepted, completed
    phone: '+91 9876543210',
  },
  {
    id: 2,
    customerName: 'Amit Patel',
    service: 'Hair Spa',
    specialist: 'Neha Singh',
    date: '2025-10-30',
    time: '02:00 PM',
    status: 'pending',
    phone: '+91 9123456789',
  },
  {
    id: 3,
    customerName: 'Anjali Verma',
    service: 'Coloring',
    specialist: 'Raj Kumar',
    date: '2025-10-29',
    time: '11:00 AM',
    status: 'accepted',
    phone: '+91 9987654321',
  },
  {
    id: 4,
    customerName: 'Vikram Singh',
    service: 'Beard Trim',
    specialist: 'Arjun Reddy',
    date: '2025-10-28',
    time: '03:00 PM',
    status: 'completed',
    phone: '+91 9111111111',
  },
];

export default function SalonBookingsScreen() {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);

  const handleAccept = (id) => {
    Alert.alert('Booking Accepted', 'Specialist has been notified');
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status: 'accepted' } : booking
      )
    );
  };

  const handleReject = (id) => {
    Alert.alert('Booking Rejected', 'Customer has been notified');
    setBookings(bookings.filter((booking) => booking.id !== id));
  };

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

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.card}>
      {/* Header with Status */}
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{booking.customerName}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
        </View>
      </View>

      {/* Service Info */}
      <View style={styles.infoRow}>
        <Icon name="cut" size={16} color="#156778" />
        <Text style={styles.infoText}>{booking.service}</Text>
      </View>

      {/* Specialist Info */}
      <View style={styles.infoRow}>
        <Icon name="person" size={16} color="#156778" />
        <Text style={styles.infoText}>{booking.specialist}</Text>
      </View>

      {/* Date & Time */}
      <View style={styles.infoRow}>
        <Icon name="calendar" size={16} color="#156778" />
        <Text style={styles.infoText}>
          {booking.date} at {booking.time}
        </Text>
      </View>

      {/* Phone */}
      <View style={styles.infoRow}>
        <Icon name="call" size={16} color="#156778" />
        <Text style={styles.infoText}>{booking.phone}</Text>
      </View>

      {/* Action Buttons */}
      {booking.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAccept(booking.id)}
          >
            <Icon name="checkmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleReject(booking.id)}
          >
            <Icon name="close" size={18} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookings</Text>
        <Text style={styles.count}>{bookings.length} Total</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        ) : (
          bookings.map(renderBookingCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#156778',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  count: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#555',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});