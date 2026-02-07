import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSaloons } from '../../redux/slices/superAdminSlice';

export default function ManageSalonsScreen() {
  const dispatch = useDispatch();
  const { saloons, loading } = useSelector((state) => state.superAdmin);

  const [searchText, setSearchText] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSalon, setSelectedSalon] = useState(null);

  useEffect(() => {
    dispatch(fetchAllSaloons({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Filter salons based on search
  const getFilteredSalons = () => {
    if (!saloons || !Array.isArray(saloons)) return [];

    if (!searchText) return saloons;

    return saloons.filter(
      (s) =>
        s.shopName?.toLowerCase().includes(searchText.toLowerCase()) ||
        s.address?.toLowerCase().includes(searchText.toLowerCase()) ||
        s.owner?.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleCardClick = (salon) => {
    setSelectedSalon(salon);
    setDetailModalVisible(true);
  };

  const filteredSalons = getFilteredSalons();
  const statsData = {
    total: saloons?.length || 0,
    active: saloons?.filter((s) => s.verifiedByAdmin)?.length || 0,
    inactive: saloons?.filter((s) => !s.verifiedByAdmin)?.length || 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manage Salons</Text>
          <Text style={styles.headerSubtitle}>All registered salons</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <Text style={styles.statCardLabel}>Total Salons</Text>
              <Text style={styles.statCardValue}>{statsData.total}</Text>
            </View>
            <View style={[styles.statCardIcon, { backgroundColor: '#7C5FED20' }]}>
              <Icon name="storefront" size={24} color="#7C5FED" />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <Text style={styles.statCardLabel}>Verified</Text>
              <Text style={styles.statCardValue}>{statsData.active}</Text>
            </View>
            <View style={[styles.statCardIcon, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <Text style={styles.statCardLabel}>Pending</Text>
              <Text style={styles.statCardValue}>{statsData.inactive}</Text>
            </View>
            <View style={[styles.statCardIcon, { backgroundColor: '#FF980020' }]}>
              <Icon name="alert-circle" size={24} color="#FF9800" />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search salons by name or city"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="close" size={20} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Salons List */}
        <View style={styles.salonsSection}>
          {loading ? (
            <View style={styles.emptyState}>
              <Icon name="hourglass" size={48} color="#DDD" />
              <Text style={styles.emptyStateText}>Loading salons...</Text>
            </View>
          ) : filteredSalons.length > 0 ? (
            filteredSalons.map((salon) => (
              <TouchableOpacity
                key={salon._id}
                style={styles.salonCard}
                onPress={() => handleCardClick(salon)}
              >
                <View style={styles.salonCardHeader}>
                  <View style={styles.salonIconContainer}>
                    <Icon name="storefront" size={24} color="#fff" />
                  </View>
                  <View style={styles.salonInfo}>
                    <Text style={styles.salonName}>{salon.shopName}</Text>
                    <Text style={styles.salonOwner}>
                      Owner: {salon.owner?.name || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.salonCardDetails}>
                  <View style={styles.detailRow}>
                    <Icon name="location" size={14} color="#999" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {salon.location?.address || 'No address'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{salon.shopType}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: salon.verifiedByAdmin ? '#C8E6C9' : '#FFE0B2',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color: salon.verifiedByAdmin ? '#2E7D32' : '#E65100',
                          },
                        ]}
                      >
                        {salon.verifiedByAdmin ? 'Verified' : 'Pending'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.joinDate}>
                    Joined {new Date(salon.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search" size={48} color="#DDD" />
              <Text style={styles.emptyStateText}>No salons found</Text>
              <Text style={styles.emptyStateSubtext}>Try adjusting your search</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Salon Details</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedSalon && (
              <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Basic Information</Text>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Salon Name</Text>
                    <Text style={styles.detailValue}>{selectedSalon.shopName}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Shop Type</Text>
                    <Text style={styles.detailValue}>{selectedSalon.shopType}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>About</Text>
                    <Text style={styles.detailValue}>{selectedSalon.about}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Owner Information</Text>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Owner Name</Text>
                    <Text style={styles.detailValue}>{selectedSalon.owner?.name || 'N/A'}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{selectedSalon.owner?.email || 'N/A'}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Phone</Text>
                    <Text style={styles.detailValue}>{selectedSalon.owner?.phone || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Contact Details</Text>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Full Address</Text>
                    <Text style={styles.detailValue}>{selectedSalon.location?.address}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>City</Text>
                    <Text style={styles.detailValue}>{selectedSalon.location?.city}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>State</Text>
                    <Text style={styles.detailValue}>{selectedSalon.location?.state}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Pincode</Text>
                    <Text style={styles.detailValue}>{selectedSalon.location?.pincode}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Contact Number</Text>
                    <Text style={styles.detailValue}>{selectedSalon.contactNumber}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>WhatsApp Number</Text>
                    <Text style={styles.detailValue}>{selectedSalon.whatsappNumber}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Business Information</Text>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Registration Number</Text>
                    <Text style={styles.detailValue}>{selectedSalon.registrationNumber}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Number of Staff</Text>
                    <Text style={styles.detailValue}>{selectedSalon.numberOfStaff}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Opening Date</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedSalon.openingDate).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Registered Date</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedSalon.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Verification Status</Text>

                  <View
                    style={[
                      styles.statusContainer,
                      {
                        backgroundColor: selectedSalon.verifiedByAdmin ? '#C8E6C9' : '#FFE0B2',
                      },
                    ]}
                  >
                    <Icon
                      name={selectedSalon.verifiedByAdmin ? 'checkmark-circle' : 'alert-circle'}
                      size={20}
                      color={selectedSalon.verifiedByAdmin ? '#2E7D32' : '#E65100'}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: selectedSalon.verifiedByAdmin ? '#2E7D32' : '#E65100',
                        },
                      ]}
                    >
                      {selectedSalon.verifiedByAdmin ? 'Verified by Admin' : 'Pending Verification'}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setDetailModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statCardContent: {
    alignItems: 'center',
  },
  statCardLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
  },
  statCardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  searchSection: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  salonsSection: {
    gap: 12,
  },
  salonCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  salonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  salonIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  salonInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  salonOwner: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  salonCardDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E8D4F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C5FED',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  joinDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modalForm: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailItem: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  closeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#7C5FED',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});