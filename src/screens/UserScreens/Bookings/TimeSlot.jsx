import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function TimeSlot({ time, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, isSelected && styles.selectedText]}>
        {time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#E1F5FA',
    borderColor: '#156778',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedText: {
    color: '#156778',
    fontWeight: '600',
  },
});