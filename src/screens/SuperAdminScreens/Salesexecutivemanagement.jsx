import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// Mock data with cities
const SALES_EXECUTIVES_DATA = {
  'All Cities': [
    {
      id: 1,
      referralId: 'SE-2025-001',
      name: 'Rajesh Kumar',
      city: 'Delhi',
      commission: '5%',
      salons: 15,
      earnings: '₹45,000',
    },
    {
      id: 2,
      referralId: 'SE-2025-002',
      name: 'Priya Sharma',
      city: 'Mumbai',
      commission: '6%',
      salons: 12,
      earnings: '₹38,000',
    },
    {
      id: 3,
      referralId: 'SE-2025-003',
      name: 'Amit Patel',
      city: 'Bangalore',
      commission: '5%',
      salons: 10,
      earnings: '₹32,000',
    },
    {
      id: 4,
      referralId: 'SE-2025-004',
      name: 'Sneha Reddy',
      city: 'Delhi',
      commission: '4%',
      salons: 9,
      earnings: '₹28,000',
    },
  ],
  'Delhi': [
    {
      id: 1,
      referralId: 'SE-2025-001',
      name: 'Rajesh Kumar',
      city: 'Delhi',
      commission: '5%',
      salons: 15,
      earnings: '₹45,000',
    },
    {
      id: 4,
      referralId: 'SE-2025-004',
      name: 'Sneha Reddy',
      city: 'Delhi',
      commission: '4%',
      salons: 9,
      earnings: '₹28,000',
    },
  ],
  'Mumbai': [
    {
      id: 2,
      referralId: 'SE-2025-002',
      name: 'Priya Sharma',
      city: 'Mumbai',
      commission: '6%',
      salons: 12,
      earnings: '₹38,000',
    },
  ],
  'Bangalore': [
    {
      id: 3,
      referralId: 'SE-2025-003',
      name: 'Amit Patel',
      city: 'Bangalore',
      commission: '5%',
      salons: 10,
      earnings: '₹32,000',
    },
  ],
};

const SUBSCRIPTION_DATA = [
  { month: 'Jan', value: 40 },
  { month: 'Feb', value: 55 },
  { month: 'Mar', value: 50 },
  { month: 'Apr', value: 60 },
  { month: 'May', value: 75 },
  { month: 'Jun', value: 90 },
];

const PENDING_COMMISSIONS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    referralId: 'SE-2025-001',
    amount: '₹45,000',
  },
  {
    id: 2,
    name: 'Priya Verma',
    referralId: 'SE-2025-002',
    amount: '₹82,500',
  },
  {
    id: 3,
    name: 'Amit Patel',
    referralId: 'SE-2025-003',
    amount: '₹38,500',
  },
];

const LOW_PERFORMERS = [
  { id: 1, name: 'Amit Patel', salons: 9 },
  { id: 2, name: 'Vikram Singh', salons: 6 },
];

export default function SalesExecutiveManagement() {
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [cityDropdownVisible, setCityDropdownVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cityDropdownVisibleInModal, setCityDropdownVisibleInModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    commission: '',
  });

  const salesExecutives = SALES_EXECUTIVES_DATA[selectedCity] || [];
  const maxValue = Math.max(...SUBSCRIPTION_DATA.map((d) => d.value));
  const chartHeight = 120;

  const handleAddExecutive = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.city || !formData.commission) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    // Validate mobile
    if (formData.mobile.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    // Validate commission percentage
    const commissionNum = parseFloat(formData.commission);
    if (isNaN(commissionNum) || commissionNum < 0 || commissionNum > 100) {
      Alert.alert('Error', 'Please enter a valid commission percentage (0-100)');
      return;
    }

    // Success
    Alert.alert('Success', `${formData.name} has been registered successfully in ${formData.city} with ${formData.commission}% commission!`);

    // Reset form
    setFormData({
      name: '',
      email: '',
      mobile: '',
      city: '',
      commission: '',
    });
    setCityDropdownVisibleInModal(false);
    setModalVisible(false);
  };

  const renderSalesExecutives = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Register New Sales Executive</Text>
      </TouchableOpacity>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Referral ID</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Executive Name</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Commission</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Salons</Text>
      </View>

      {/* Table Rows */}
      {salesExecutives.length > 0 ? (
        salesExecutives.map((exec) => (
          <View key={exec.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.2, fontSize: 11 }]}>{exec.referralId}</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>{exec.name}</Text>
            <View style={[styles.commissionBadge, { flex: 0.8 }]}>
              <Text style={styles.commissionBadgeText}>{exec.commission}</Text>
            </View>
            <View style={[styles.salonBadge, { flex: 0.8 }]}>
              <Text style={styles.salonBadgeText}>{exec.salons}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No sales executives found for {selectedCity}</Text>
        </View>
      )}
    </View>
  );

  const renderSubscriptions = () => (
    <View style={styles.tabContent}>
      <Text style={styles.chartTitle}>Subscriptions Sold per Month</Text>

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chartYAxis}>
          <Text style={styles.chartLabel}>100</Text>
          <Text style={styles.chartLabel}>75</Text>
          <Text style={styles.chartLabel}>50</Text>
          <Text style={styles.chartLabel}>25</Text>
          <Text style={styles.chartLabel}>0</Text>
        </View>

        <View style={styles.chartBars}>
          {SUBSCRIPTION_DATA.map((data, index) => {
            const barHeight = (data.value / maxValue) * chartHeight;
            return (
              <View key={index} style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    { height: barHeight, backgroundColor: '#7C5FED' },
                  ]}
                />
                <Text style={styles.barLabel}>{data.month}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Subscriptions</Text>
          <Text style={styles.statValue}>370</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Avg per Month</Text>
          <Text style={styles.statValue}>61.7</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Growth</Text>
          <Text style={[styles.statValue, { color: '#4CAF50' }]}>+125%</Text>
        </View>
      </View>
    </View>
  );

  const renderRevenue = () => (
    <View style={styles.tabContent}>
      <Text style={styles.chartTitle}>Revenue Distribution by Executive</Text>

      {/* Pie Chart (Mock) */}
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          <View style={[styles.piePiece, { backgroundColor: '#7C5FED', width: '25%' }]} />
          <View style={[styles.piePiece, { backgroundColor: '#E91E63', width: '23%' }]} />
          <View style={[styles.piePiece, { backgroundColor: '#2196F3', width: '17%' }]} />
          <View style={[styles.piePiece, { backgroundColor: '#FF9800', width: '19%' }]} />
          <View style={[styles.piePiece, { backgroundColor: '#4CAF50', width: '16%' }]} />
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#7C5FED' }]} />
          <Text style={styles.legendText}>Rajesh Kumar: 25%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E91E63' }]} />
          <Text style={styles.legendText}>Priya Sharma: 23%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Amit Patel: 17%</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Sneha Reddy: 19%</Text>
        </View>
      </View>

      {/* Top Performer */}
      <View style={styles.performerCard}>
        <View style={styles.performerHeader}>
          <Icon name="trending-up" size={20} color="#4CAF50" />
          <Text style={styles.performerTitle}>Top Performer</Text>
        </View>
        <View style={styles.performerContent}>
          <View style={styles.performerAvatar} />
          <View style={styles.performerInfo}>
            <Text style={styles.performerName}>Priya Sharma</Text>
            <Text style={styles.performerSubtext}>SE-2025-002</Text>
          </View>
        </View>
        <View style={styles.performerStats}>
          <View style={styles.performerStat}>
            <Text style={styles.performerStatLabel}>Salons Registered</Text>
            <Text style={styles.performerStatValue}>18</Text>
          </View>
          <View style={styles.performerStat}>
            <Text style={styles.performerStatLabel}>Subscriptions Sold</Text>
            <Text style={styles.performerStatValue}>15</Text>
          </View>
          <View style={styles.performerStat}>
            <Text style={styles.performerStatLabel}>Commission Earned</Text>
            <Text style={styles.performerStatValue}>₹82,500</Text>
          </View>
        </View>
      </View>

      {/* Low Performers Alert */}
      <View style={styles.alertCard}>
        <View style={styles.alertHeader}>
          <Icon name="alert-circle" size={20} color="#FF9800" />
          <Text style={styles.alertTitle}>Low Performance Alert</Text>
        </View>
        {LOW_PERFORMERS.map((person) => (
          <View key={person.id} style={styles.alertItem}>
            <View style={styles.alertItemContent}>
              <Text style={styles.alertItemName}>{person.name}</Text>
              <Text style={styles.alertItemSubtext}>{person.salons} salons</Text>
            </View>
            <TouchableOpacity style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Alert</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCommissions = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionSubtitle}>Awaiting approval</Text>

      {PENDING_COMMISSIONS.map((commission) => (
        <View key={commission.id} style={styles.commissionCard}>
          <View style={styles.commissionInfo}>
            <Text style={styles.commissionName}>{commission.name}</Text>
            <Text style={styles.commissionId}>{commission.referralId}</Text>
          </View>
          <Text style={styles.commissionAmount}>{commission.amount}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sales Executive Management</Text>
        </View>

        {/* City Dropdown */}
        <View style={styles.dropdownSection}>
          <Text style={styles.dropdownLabel}>Select City:</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setCityDropdownVisible(!cityDropdownVisible)}
          >
            <Text style={styles.dropdownButtonText}>{selectedCity}</Text>
            <Icon
              name={cityDropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#7C5FED"
            />
          </TouchableOpacity>

          {cityDropdownVisible && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  selectedCity === 'All Cities' && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedCity('All Cities');
                  setCityDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedCity === 'All Cities' && styles.dropdownItemTextActive,
                  ]}
                >
                  All Cities
                </Text>
                {selectedCity === 'All Cities' && (
                  <Icon name="checkmark" size={18} color="#7C5FED" />
                )}
              </TouchableOpacity>

              {CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[
                    styles.dropdownItem,
                    selectedCity === city && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setSelectedCity(city);
                    setCityDropdownVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedCity === city && styles.dropdownItemTextActive,
                    ]}
                  >
                    {city}
                  </Text>
                  {selectedCity === city && (
                    <Icon name="checkmark" size={18} color="#7C5FED" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'sales' && styles.activeTab]}
            onPress={() => setActiveTab('sales')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'sales' && styles.activeTabText,
              ]}
            >
              Executives
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'subscriptions' && styles.activeTab]}
            onPress={() => setActiveTab('subscriptions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'subscriptions' && styles.activeTabText,
              ]}
            >
              Subscriptions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'revenue' && styles.activeTab]}
            onPress={() => setActiveTab('revenue')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'revenue' && styles.activeTabText,
              ]}
            >
              Revenue
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'commissions' && styles.activeTab]}
            onPress={() => setActiveTab('commissions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'commissions' && styles.activeTabText,
              ]}
            >
              Commissions
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'sales' && renderSalesExecutives()}
          {activeTab === 'subscriptions' && renderSubscriptions()}
          {activeTab === 'revenue' && renderRevenue()}
          {activeTab === 'commissions' && renderCommissions()}
        </ScrollView>
      </View>

      {/* Register New Sales Executive Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Sales Executive</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Executive Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType="email-address"
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Mobile Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChangeText={(text) =>
                  setFormData({ ...formData, mobile: text })
                }
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Commission (%) *</Text>
              <View style={styles.commissionInputWrapper}>
                <TextInput
                  style={styles.commissionInput}
                  placeholder="e.g., 5"
                  value={formData.commission}
                  onChangeText={(text) =>
                    setFormData({ ...formData, commission: text })
                  }
                  keyboardType="decimal-pad"
                  placeholderTextColor="#999"
                />
                <Text style={styles.percentageSymbol}>%</Text>
              </View>

              <Text style={styles.inputLabel}>City *</Text>
              <TouchableOpacity
                style={styles.cityDropdownButton}
                onPress={() => setCityDropdownVisibleInModal(!cityDropdownVisibleInModal)}
              >
                <Text style={styles.cityDropdownText}>{formData.city}</Text>
                <Icon
                  name={cityDropdownVisibleInModal ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color="#7C5FED"
                />
              </TouchableOpacity>

              {cityDropdownVisibleInModal && (
                <View style={styles.cityDropdownMenu}>
                  {CITIES.map((city) => (
                    <TouchableOpacity
                      key={city}
                      style={[
                        styles.cityDropdownItem,
                        formData.city === city && styles.cityDropdownItemActive,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, city });
                        setCityDropdownVisibleInModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.cityDropdownItemText,
                          formData.city === city && styles.cityDropdownItemTextActive,
                        ]}
                      >
                        {city}
                      </Text>
                      {formData.city === city && (
                        <Icon name="checkmark" size={16} color="#7C5FED" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddExecutive}
              >
                <Icon name="checkmark" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Add Executive</Text>
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
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  dropdownSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownItemActive: {
    backgroundColor: '#F5F5F5',
  },
  dropdownItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  dropdownItemTextActive: {
    color: '#7C5FED',
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#7C5FED',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  activeTabText: {
    color: '#7C5FED',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  tabContent: {
    gap: 16,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  tableCell: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  salonBadge: {
    backgroundColor: '#E8D4F8',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  salonBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C5FED',
  },
  commissionBadge: {
    backgroundColor: '#C8E6C9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  commissionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  noDataContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
  },
  chartYAxis: {
    justifyContent: 'space-between',
    marginRight: 12,
  },
  chartLabel: {
    fontSize: 10,
    color: '#999',
    width: 30,
    textAlign: 'right',
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  pieChartContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 24,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  piePiece: {
    height: '100%',
  },
  legend: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  performerCard: {
    backgroundColor: '#7C5FED',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  performerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  performerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  performerSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  performerStats: {
    flexDirection: 'row',
    gap: 8,
  },
  performerStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  performerStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  performerStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  alertCard: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  alertItemContent: {
    flex: 1,
  },
  alertItemName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  alertItemSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  alertButton: {
    borderWidth: 1,
    borderColor: '#FF9800',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  alertButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF9800',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  commissionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  commissionInfo: {
    flex: 1,
  },
  commissionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  commissionId: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  commissionAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
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
    maxHeight: '85%',
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
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  commissionInputWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  commissionInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingRight: 35,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  percentageSymbol: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#7C5FED',
  },
  cityDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 12,
  },
  cityDropdownText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  cityDropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    overflow: 'hidden',
    marginBottom: 12,
  },
  cityDropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cityDropdownItemActive: {
    backgroundColor: '#F5F5F5',
  },
  cityDropdownItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  cityDropdownItemTextActive: {
    color: '#7C5FED',
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
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7C5FED',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  submitButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
});