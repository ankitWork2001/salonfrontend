import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SectionHeader({ title, showViewAll = true, onPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#06B6D4',
  },
});

