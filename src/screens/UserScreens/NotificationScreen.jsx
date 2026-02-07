// src/screens/UserScreens/Messages/NotificationScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const mockNotifications = [
  {
    id: 'new-1',
    category: 'New',
    type: 'reminder',
    message: 'Reminder! . Get ready for your appointment at 9am',
    time: 'Just now',
    icon: 'calendar-outline',
    iconBgColor: '#e0f7fa',
    dotColor: 'orange',
  },
  {
    id: 'earlier-1',
    category: 'Earlier',
    type: 'payment',
    message: 'Payment at Lovely Lather was success!',
    time: '11:32 PM',
    icon: 'card-outline',
    iconBgColor: '#e0f7fa',
    dotColor: 'orange',
  },
  {
    id: 'earlier-2',
    category: 'Earlier',
    type: 'appointment',
    message: 'You make an appointment with Lovely Lather',
    time: 'Yesterday',
    icon: 'calendar-outline',
    iconBgColor: '#e0f7fa',
    dotColor: null,
  },
  {
    id: 'earlier-3',
    category: 'Earlier',
    type: 'offer',
    message: 'Get 20% offers for hair service at Lovely Lather',
    time: '2 days ago',
    icon: 'pricetag-outline',
    iconBgColor: '#e0f7fa',
    dotColor: null,
  },
  {
    id: 'earlier-4',
    category: 'Earlier',
    type: 'offer',
    message: 'Get 10% offers for hair service at Love Live Salon',
    time: '2 days ago',
    icon: 'pricetag-outline',
    iconBgColor: '#e0f7fa',
    dotColor: null,
  },
  {
    id: 'earlier-5',
    category: 'Earlier',
    type: 'reminder',
    message: 'Reminder! . Get ready for your appointment at 9am',
    time: '3 Mar',
    icon: 'calendar-outline',
    iconBgColor: '#e0f7fa',
    dotColor: null,
  },
];

const NotificationItem = ({ item }) => (
  <TouchableOpacity style={styles.notificationItem}>
    <View style={[styles.iconCircle, { backgroundColor: item.iconBgColor }]}>
      <Icon name={item.icon} size={20} color="#156778" />
    </View>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
    <View style={styles.notificationInfo}>
      <Text style={styles.notificationTime}>{item.time}</Text>
      {item.dotColor && <View style={[styles.statusDot, { backgroundColor: item.dotColor }]} />}
    </View>
  </TouchableOpacity>
);

export default function NotificationScreen({ navigation }) {
  // Group notifications by category
  const groupedNotifications = mockNotifications.reduce((acc, notification) => {
    (acc[notification.category] = acc[notification.category] || []).push(notification);
    return acc;
  }, {});
  

  const renderSection = ({ item }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeader}>{item.category}</Text>
      <FlatList
        data={item.data}
        keyExtractor={(notification) => notification.id}
        renderItem={({ item: notification }) => <NotificationItem item={notification} />}
        scrollEnabled={false} // Prevent inner FlatList from scrolling
      />
    </View>
  );

  const sections = Object.keys(groupedNotifications).map((category) => ({
    category,
    data: groupedNotifications[category],
  }));

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#156778" />
     <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Notifications List */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.category}
        renderItem={renderSection}
        contentContainerStyle={styles.listContent}
      />
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
    backgroundColor: '#fff',
  },
   /* --- Header --- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#156778',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  notificationMessage: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  notificationInfo: {
    alignItems: 'flex-end',
  },
  notificationTime: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // backgroundColor set by item.dotColor
  },
});