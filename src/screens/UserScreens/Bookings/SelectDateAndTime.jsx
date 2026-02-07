import React, { use, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { updateCartDateTime } from '../../../utils/cartStorage';
import { setCart } from '../../../redux/slices/cartSlice';
import { useSelector, useDispatch } from 'react-redux';

const TIME_SLOTS = [
  { time: '9:00 AM', },
  { time: '10:00 AM', },
  { time: '11:00 AM', },
  { time: '12:00 PM', },
  { time: '1:00 PM', },
  { time: '2:00 PM', },
  { time: '3:00 PM', },
  { time: '4:00 PM', },
  { time: '5:00 PM', },
  { time: '6:00 PM', },
  { time: '7:00 PM', },
  { time: '8:00 PM', },
];

export default function SelectDateAndTime({ route }) {
  const { providerId, mode } = route.params; // mode is 'salon' or 'home'
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const userId = user?._id || 'guest';
  const [selectedDate, setSelectedDate] = useState('2026-01-01');
  const [selectedTime, setSelectedTime] = useState(null);

  const handleConfirm = async () => {
  const updates = mode === 'salon' 
    ? { selectedDateSalon: selectedDate, selectedTimeSalon: selectedTime }
    : { selectedDateHome: selectedDate, selectedTimeHome: selectedTime };

  // 1. SAVE TO DISK (Permanent)
  // This updates the local storage so data isn't lost on refresh
  const updatedCart = await updateCartDateTime(userId, providerId, mode, selectedDate, selectedTime);

  // 2. UPDATE UI (Instant)
  // This updates the Redux store. Because your CartScreen uses 'useSelector',
  // it will see this change and update the UI the millisecond you go back.
  dispatch(setCart(updatedCart));

  navigation.goBack();
};

  const getSlotStyle = (status, isSelected) => {
    if (status === 'unavailable') return styles.slotUnavailable;
    if (isSelected) return styles.slotSelected;
    if (status === 'few') return styles.slotFew;
    return styles.slotAvailable;
  };

  const getTextStyle = (status, isSelected) => {
    if (status === 'unavailable') return styles.textUnavailable;
    if (isSelected) return styles.textSelected;
    if (status === 'few') return styles.textFew;
    return styles.textAvailable;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F8F8" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Calendar Card */}
        <View style={styles.card}>
          <Calendar
            current={selectedDate}
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#156778' },
            }}
            theme={{
              todayTextColor: '#156778',
              arrowColor: '#333',
              monthTextColor: '#333',
              textMonthFontWeight: 'bold',
              selectedDayBackgroundColor: '#156778',
            }}
          />
        </View>

        {/* Time Selection Card */}
        <View style={styles.card}>
          <View style={styles.timeHeader}>
            <MaterialCommunityIcons name="clock-outline" size={22} color="#8A56AC" />
            <Text style={styles.timeTitle}>Select Time</Text>
          </View>

          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map((slot, index) => {
              const isSelected = selectedTime === slot.time;
              
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTime(slot.time)}
                  style={[styles.slotBase, getSlotStyle(slot.status, isSelected)]}
                >
                  <Text style={[styles.slotText, getTextStyle(slot.status, isSelected)]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#FBBF24' }]} />
              <Text style={styles.legendText}>Few Left</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: '#9CA3AF' }]} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmText}>confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollContent: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  timeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  timeTitle: { fontSize: 16, fontWeight: '600', marginLeft: 10, color: '#333' },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotBase: {
    width: '31%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  slotAvailable: { backgroundColor: '#F0FFF4', borderColor: '#DCFCE7' },
  slotFew: { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' },
  slotUnavailable: { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' },
  slotSelected: { backgroundColor: '#8A56AC', borderColor: '#8A56AC' },
  slotText: { fontSize: 13, fontWeight: '500' },
  textAvailable: { color: '#166534' },
  textFew: { color: '#92400E' },
  textUnavailable: { color: '#9CA3AF' },
  textSelected: { color: '#fff' },
  legendRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'flex-start' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  legendText: { fontSize: 12, color: '#666' },
  footer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  cancelText: { color: '#333', fontWeight: '500' },
  confirmButton: {
    backgroundColor: '#8A56AC',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  confirmText: { color: '#fff', fontWeight: '500' },
});

