import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const STATUS_COLORS = {
  ACTIVE: '#22C55E',
  INACTIVE: '#EF4444',
  PENDING: '#FACC15',
};

const SALONS = [
  {
    id: 1,
    name: 'Velvet Cut Salon & Spa',
    owner: 'Sarah Jenkins',
    address: '123 Fashion Street, Downtown',
    joined: 'Oct 12, 2024',
    commission: '₹14,500',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250',
    status: 'ACTIVE',
  },
  {
    id: 2,
    name: 'Glow & Grace Beauty Studio',
    owner: 'Emily Watson',
    address: '45 Rose Avenue, Midtown',
    joined: 'Jan 5, 2025',
    commission: '₹8,200',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
    status: 'PENDING',
  },
  {
    id: 3,
    name: 'Urban Edge Salon',
    owner: 'Michael Brown',
    address: '88 Market Road, City Center',
    joined: 'Aug 20, 2024',
    commission: '₹5,750',
    image: 'https://images.unsplash.com/photo-1500840216050-6ffa99d75160',
    status: 'INACTIVE',
  },
];

export default function MySalonsScreen({ navigation }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      
      <View style={styles.container}>
        {/* --- Header --- */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Salons</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterSalon')}>
            <Icon name="add-circle" size={30} color="#156778" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {SALONS.map(salon => (
            <View style={styles.card} key={salon.id}>
              {/* Image Section */}
              <View>
                <Image source={{ uri: salon.image }} style={styles.image} />
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLORS[salon.status] || '#999' }
                  ]}
                >
                  <Text style={styles.statusText}>{salon.status}</Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>{salon.name}</Text>

                <View style={styles.infoRow}>
                  <Icon name="person-outline" size={14} color="#6B7280" />
                  <Text style={styles.infoText}>Owner: {salon.owner}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.infoText} numberOfLines={1}>{salon.address}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Icon name="calendar-outline" size={14} color="#6B7280" />
                  <Text style={styles.infoText}>Joined: {salon.joined}</Text>
                </View>

                {/* Commission Box */}
                <View style={styles.commissionBox}>
                  <Text style={styles.commissionLabel}>TOTAL COMMISSION EARNED</Text>
                  <Text style={styles.commissionValue}>{salon.commission}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.detailsButton}>
                    <Text style={styles.detailsText}>View Details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconButton}>
                    <Icon name="call" size={18} color="#156778" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.iconButton}>
                    <Icon name="logo-whatsapp" size={18} color="#25D366" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  commissionBox: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#156778',
  },
  commissionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  commissionValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#156778',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 10,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#156778',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  detailsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  iconButton: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});