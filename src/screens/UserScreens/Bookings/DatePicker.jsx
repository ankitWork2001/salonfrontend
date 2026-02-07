import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DatePicker({ selectedDate, onDateSelect, month, onMonthChange }) {
  // Mock dates for the calendar
  const dates = [
    { day: 'Wed', date: 9 },
    { day: 'Thu', date: 10 },
    { day: 'Fri', date: 11 },
    { day: 'Sat', date: 12 },
    { day: 'Sun', date: 13 },
    { day: 'Mon', date: 14 },
  ];

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={() => onMonthChange('prev')}>
          <Icon name="chevron-back" size={24} color="#156778" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{month}</Text>
        <TouchableOpacity onPress={() => onMonthChange('next')}>
          <Icon name="chevron-forward" size={24} color="#156778" />
        </TouchableOpacity>
      </View>

      {/* Dates */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
        {dates.map((item) => (
          <TouchableOpacity
            key={item.date}
            style={[
              styles.dateItem,
              selectedDate === item.date && styles.selectedDate,
            ]}
            onPress={() => onDateSelect(item.date)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.dayText,
              selectedDate === item.date && styles.selectedDayText,
            ]}>
              {item.day}
            </Text>
            <Text style={[
              styles.dateText,
              selectedDate === item.date && styles.selectedDateText,
            ]}>
              {item.date}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  datesContainer: {
    flexDirection: 'row',
  },
  dateItem: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedDate: {
    backgroundColor: '#156778',
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
});