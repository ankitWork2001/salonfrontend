// src/screens/UserScreens/Messages/MessageListScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mockMessages = [
  {
    id: '1',
    salonName: 'Plush Beauty Lounge',
    messageSnippet: 'Good morning, anything we can...',
    time: '11:32 PM',
    unreadCount: 2,
    image: 'https://via.placeholder.com/50/FF5733/FFFFFF?text=PBL', // Placeholder image
  },
  {
    id: '2',
    salonName: 'Lovely Lather',
    messageSnippet: 'Good morning, anything we can...',
    time: '11:32 PM',
    unreadCount: 2,
    image: 'https://via.placeholder.com/50/33FF57/FFFFFF?text=LL', // Placeholder image
  },
  {
    id: '3',
    salonName: 'Cute Stuff Salon',
    messageSnippet: 'I would like to book an appoin...',
    time: 'Yesterday',
    unreadCount: 0,
    image: 'https://via.placeholder.com/50/3357FF/FFFFFF?text=CSS', // Placeholder image
  },
  {
    id: '4',
    salonName: 'Love Live Salon',
    messageSnippet: 'I would like to book an appoin...',
    time: 'Yesterday',
    unreadCount: 0,
    image: 'https://via.placeholder.com/50/FFFF33/FFFFFF?text=LLS', // Placeholder image
  },
  {
    id: '5',
    salonName: 'Glitter Pop Salon',
    messageSnippet: 'I would like to book an appoin...',
    time: 'Yesterday',
    unreadCount: 0,
    image: 'https://via.placeholder.com/50/FF33FF/FFFFFF?text=GPS', // Placeholder image
  },
];

const MessageListItem = ({ item }) => (
  <TouchableOpacity style={styles.messageItem}>
    <Image source={{ uri: item.image }} style={styles.salonImage} />
    <View style={styles.messageContent}>
      <Text style={styles.salonName}>{item.salonName}</Text>
      <Text style={styles.messageSnippet}>{item.messageSnippet}</Text>
    </View>
    <View style={styles.messageInfo}>
      <Text style={styles.messageTime}>{item.time}</Text>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default function MessageScreen() {
  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages or salon"
          placeholderTextColor="gray"
        />
      </View>

      {/* Message List */}
      <FlatList
        data={mockMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageListItem item={item} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  salonImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ccc', // Fallback background
  },
  messageContent: {
    flex: 1,
  },
  salonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  messageSnippet: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  messageInfo: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  unreadBadge: {
    backgroundColor: 'orange',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});