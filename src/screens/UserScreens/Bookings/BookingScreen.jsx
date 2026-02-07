import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import SpecialistSelector from './SpecialistSelector';
import DatePicker from './DatePicker';
import TimeSlot from './TimeSlot';

// Mock Data
const specialists = [
  { id: '1', name: 'Ronald', image: require('../../../assets/featuredSalon.png') },
  { id: '2', name: 'Merry', image: require('../../../assets/featuredSalon.png') },
  { id: '3', name: 'Bella', image: require('../../../assets/featuredSalon.png') },
  { id: '4', name: 'Joseph', image: require('../../../assets/featuredSalon.png') },
  { id: '5', name: 'Sarah', image: require('../../../assets/featuredSalon.png') },
];

const timeSlots = [
  '08:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '03:00 PM',
  '05:00 PM',
];

export default function BookingScreen({ navigation }) {
  const [selectedSpecialist, setSelectedSpecialist] = useState('1');
  const [selectedDate, setSelectedDate] = useState(10);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [month, setMonth] = useState('March, 2021');
  const [notes, setNotes] = useState('');

  const handleMonthChange = (direction) => {
    // Handle month change logic here
    console.log('Month change:', direction);
  };

  const handleCheckout = () => {
    // Navigate to checkout or handle booking
    console.log('Checkout pressed');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#156778" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Service</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Specialist */}
          <Text style={styles.sectionTitle}>Specialist</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.specialistContainer}
          >
            {specialists.map((specialist) => (
              <SpecialistSelector
                key={specialist.id}
                specialist={specialist}
                isSelected={selectedSpecialist === specialist.id}
                onPress={() => setSelectedSpecialist(specialist.id)}
              />
            ))}
          </ScrollView>

          {/* Date */}
          <Text style={styles.sectionTitle}>Date</Text>
          <DatePicker
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            month={month}
            onMonthChange={handleMonthChange}
          />

          {/* Time */}
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.timeContainer}>
            {timeSlots.map((time) => (
              <TimeSlot
                key={time}
                time={time}
                isSelected={selectedTime === time}
                onPress={() => setSelectedTime(time)}
              />
            ))}
          </View>

          {/* Notes */}
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Type your notes here"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <View style={styles.priceContainer}>
            <View style={styles.cartIcon}>
              <Icon name="cart-outline" size={24} color="#156778" />
            </View>
            <View style={styles.priceInfo}>
              <Text style={styles.totalLabel}>Total (1 Service)</Text>
              <Text style={styles.totalPrice}>₹ 2500</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    marginTop: 8,
  },
  specialistContainer: {
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  notesInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#111827',
    minHeight: 100,
    marginBottom: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E1F5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  checkoutButton: {
    backgroundColor: '#156778',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    justifyContent: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});