import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';

// Redux Actions
import { fetchCities } from '../../redux/slices/stateCitySlice';
import { registerSalesman, fetchAllSalesman, clearSalesmanState } from '../../redux/slices/salesmanSlice';
import { showSnackbar } from '../../redux/slices/snackbarSlice';

export default function SalesTeamManagement() {
  const dispatch = useDispatch();
  
  // Selectors
  const { cities } = useSelector((state) => state.stateCity);
  const { salesman, success, error, loading } = useSelector((state) => state.salesman);

  // Local State
  const [activeTab, setActiveTab] = useState('sales');
  const [modalVisible, setModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    commissionRate: '',
    city: '',
    cityName: '', // Added to track display name
  });

  // 1. Initial Data Fetch
  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchAllSalesman());
  }, [dispatch]);

  // 2. Handle Registration Response
  useEffect(() => {
    if (success) {
      dispatch(showSnackbar({ message: 'Salesman registered successfully!', type: 'success' }));
      setModalVisible(false);
      resetForm();
      dispatch(fetchAllSalesman()); // Refresh list
      dispatch(clearSalesmanState()); // Reset success flag
    }
    if (error) {
      dispatch(showSnackbar({ message: error, type: 'error' }));
      dispatch(clearSalesmanState()); // Reset error flag
    }
  }, [success, error]);

  const resetForm = () => {
    setFormData({ name: '', email: '', mobile: '', commissionRate: '', city: '', cityName: '' });
  };

  const handleAddSalesman = () => {
    const { name, email, mobile, city, commissionRate } = formData;

    if (!name || !email || !mobile || !city || !commissionRate) {
      dispatch(showSnackbar({ message: 'Please fill all required fields', type: 'warning' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(showSnackbar({ message: 'Invalid email format', type: 'error' }));
      return;
    }

    // Payload for API
    dispatch(registerSalesman({
      name,
      email,
      mobile,
      city, // Sending the ID
      commissionRate: Number(commissionRate),
    }));
  };

  const renderSalesTeam = () => (
    <View style={styles.tabContent}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={18} color="#fff" />
        <Text style={styles.addButtonText}>Register New Sales Person</Text>
      </TouchableOpacity>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Referral ID</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Sales Person</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Commission</Text>
      </View>

      {salesman.map((person) => (
        <View key={person._id || person.id} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1.5 }]}>{person.referralId || 'N/A'}</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>{person.user?.name || 'Unknown'}</Text>
          <Text style={[styles.tableCell, { flex: 1.5, color: '#4CAF50' }]}>
            {person.commissionRate}%
          </Text>
        </View>
      ))}
    </View>
  );


  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sales Team Management</Text>
        </View>

        {/* Tabs
        <View style={styles.tabsContainer}>
          {['sales', 'subscriptions', 'revenue', 'commissions'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {activeTab === 'sales' && renderSalesTeam()}
          {/* Add other renders here */}
        </ScrollView>
      </View>

      {/* Registration Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Sales Person</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(t) => setFormData({ ...formData, name: t })}
                placeholder="Full Name"
              />

              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(t) => setFormData({ ...formData, email: t })}
                keyboardType="email-address"
                placeholder="email@example.com"
              />

              <Text style={styles.inputLabel}>Mobile *</Text>
              <TextInput
                style={styles.input}
                value={formData.mobile}
                onChangeText={(t) => setFormData({ ...formData, mobile: t })}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="10-digit number"
              />

              <Text style={styles.inputLabel}>City *</Text>
              <TouchableOpacity style={styles.input} onPress={() => setCityModalVisible(true)}>
                <View style={styles.selectorRow}>
                  <Text style={{ color: formData.cityName ? '#333' : '#999' }}>
                    {formData.cityName || "Select a city"}
                  </Text>
                  <Icon name="chevron-down" size={18} color="#999" />
                </View>
              </TouchableOpacity>

              <Text style={styles.inputLabel}>Commission Rate (%) *</Text>
              <TextInput
                style={styles.input}
                value={formData.commissionRate}
                onChangeText={(t) => setFormData({ ...formData, commissionRate: t })}
                keyboardType="numeric"
                placeholder="e.g. 10"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                onPress={handleAddSalesman}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* City Modal */}
      <Modal visible={cityModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: '50%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.cityOption}
                  onPress={() => {
                    setFormData({ ...formData, city: item._id, cityName: item.name });
                    setCityModalVisible(false);
                  }}
                >
                  <View>
                    <Text style={styles.cityName}>{item.name}</Text>
                    <Text style={styles.stateName}>{item.state?.name}</Text>
                  </View>
                  {formData.city === item._id && (
                    <Icon name="checkmark-circle" size={20} color="#7C5FED" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (keeping your original styles with minor fixes)
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#7C5FED' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#999' },
  activeTabText: { color: '#7C5FED' },
  scrollContent: { padding: 16 },
  tabContent: { gap: 16 },
  addButton: { flexDirection: 'row', backgroundColor: '#7C5FED', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  tableHeader: { flexDirection: 'row', padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  tableHeaderText: { fontSize: 11, fontWeight: '700', color: '#666' },
  tableRow: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, alignItems: 'center' },
  tableCell: { fontSize: 12, color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 16, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  modalForm: { padding: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 14, borderWidth: 1, borderColor: '#EEE' },
  selectorRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalFooter: { flexDirection: 'row', gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  cancelButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  submitButton: { flex: 1, backgroundColor: '#7C5FED', padding: 12, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: '600' },
  cityOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  cityName: { fontSize: 16, color: '#333' },
  stateName: { fontSize: 12, color: '#999' },
});