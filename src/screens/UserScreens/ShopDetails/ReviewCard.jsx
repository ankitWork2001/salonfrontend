import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ReviewCard({ review }) {
  return (
    <View style={styles.container}>
      <Image source={review.userImage} style={styles.userImage} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.userName}>{review.userName}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>

        <View style={styles.rating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              name="star"
              size={14}
              color={star <= review.rating ? '#FACC15' : '#E5E7EB'}
            />
          ))}
        </View>

        <Text style={styles.comment} numberOfLines={3}>
          {review.comment}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  comment: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});