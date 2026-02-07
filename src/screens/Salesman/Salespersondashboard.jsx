import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  ActivityIndicator,
  StatusBar,
  Clipboard, // Added for Copy functionality
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/salesmanSlice';

export default function SalesPersonDashboard({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { summary, recentSalons, monthlySalesGrowth, loading } = useSelector((state) => state.salesman);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  // Dynamic Referral Link
  const referralId = user?.roleDetails?.referralId || 'SP-XXXX';
  const referralLink = `https://salonstartup.com/ref/${referralId}`;

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const shareOnWhatsApp = () => {
    const message = `Hey! Use my referral link to join Salon Startup: ${referralLink}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'WhatsApp is not installed'));
  };

  const copyToClipboard = () => {
    Clipboard.setString(referralLink);
    Alert.alert('Copied', 'Referral link copied to clipboard!');
  };

  const maxValue = monthlySalesGrowth?.length > 0 
    ? Math.max(...monthlySalesGrowth.map((d) => d.value)) 
    : 10;
  const chartHeight = 100;

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: '#156778' }]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={[styles.loadingText, { color: '#fff' }]}>Fetching Dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profilePhoto}>
              <Text style={styles.profilePhotoText}>👨</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{user?.name || 'Sales Executive'}</Text>
              <Text style={styles.referralLabel}>Sales Executive</Text>
            </View>
          </View>
          <View style={styles.referralIdBadge}>
            <Text style={styles.referralIdText}>{referralId}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <MetricCard 
              label="Total Salons"
              value={summary?.totalSalons || 0}
              icon="storefront"
              color="#7C5FED"
              onPress={() => navigation.navigate("MySalonsScreen")}
            />
            <MetricCard 
              label="Total Earnings"
              value={`₹${summary?.totalEarnings || 0}`}
              icon="cash"
              color="#4CAF50"
            />
          </View>

          <View style={styles.metricsGrid}>
            <MetricCard 
              label="Professionals"
              value={summary?.totalIndependentProfessionals || 0}
              icon="person"
              color="#914CAF"
            />
            <MetricCard 
              label="Comm. Rate"
              value={`${summary?.commissionRate || 0}%`}
              icon="trending-up"
              color="#E91E63"
            />
          </View>

          {/* Table Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Registrations</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Salon Name</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Date</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
              </View>

              {recentSalons?.length > 0 ? (
                recentSalons.slice(0, 5).map((salon, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>{salon.salonName}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>
                      {new Date(salon.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </Text>
                    <View style={[styles.statusBadge, { flex: 1, backgroundColor: salon.status === 'paid' ? '#C8E6C9' : '#FFE0B2' }]}>
                      <Text style={[styles.statusBadgeText, { color: salon.status === 'paid' ? '#2E7D32' : '#E65100' }]}>
                        {salon.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#999' }}>No registrations found</Text>
                </View>
              )}
            </View>
          </View>

          {/* Analytics Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Growth</Text>
            <View style={styles.chartContainer}>
              <View style={styles.chartBars}>
                {monthlySalesGrowth.map((data, index) => {
                  const barHeight = (data.value / maxValue) * chartHeight;
                  return (
                    <View key={index} style={styles.barWrapper}>
                      <View style={[styles.bar, { height: barHeight || 2, backgroundColor: '#7C5FED' }]} />
                      <Text style={styles.barLabel}>{data.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('RegisterSalon')}>
                <Icon name="add-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Register New Salon</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.actionButtonSecondary]} 
                onPress={() => setShareModalVisible(true)}
              >
                <Icon name="share-social" size={20} color="#7C5FED" />
                <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Share Referral Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Share Modal */}
      <Modal visible={shareModalVisible} transparent animationType="slide" onRequestClose={() => setShareModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Referral Link</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.referralLinkLabel}>Your Referral Link</Text>
              <View style={styles.referralLinkBox}>
                <Text style={styles.referralLink} numberOfLines={1}>{referralLink}</Text>
                <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                  <Icon name="copy" size={18} color="#7C5FED" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.shareMethodsLabel, { marginTop: 20 }]}>Share Via</Text>
              <View style={styles.shareMethodsGrid}>
                <ShareIcon name="logo-whatsapp" label="WhatsApp" color="#25D366" onPress={shareOnWhatsApp} />
                <ShareIcon name="mail" label="Email" color="#EA4335" />
                <ShareIcon name="share-social" label="More" color="#1F2937" />
              </View>
            </View>
            
            <TouchableOpacity style={styles.closeButtonAction} onPress={() => setShareModalVisible(false)}>
              <Text style={styles.closeButtonActionText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Helper Sub-Components ---
const MetricCard = ({ label, value, icon, color, onPress }) => (
  <TouchableOpacity style={styles.metricCard} onPress={onPress} disabled={!onPress}>
    <View style={[styles.metricIcon, { backgroundColor: `${color}15` }]}>
      <Icon name={icon} size={22} color={color} />
    </View>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, { color: color }]}>{value}</Text>
  </TouchableOpacity>
);

const ShareIcon = ({ name, label, color, onPress }) => (
  <TouchableOpacity style={styles.shareMethod} onPress={onPress}>
    <View style={[styles.settingIconCircle, { backgroundColor: `${color}10` }]}>
      <Icon name={name} size={28} color={color} />
    </View>
    <Text style={styles.shareMethodText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  profilePhoto: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#7C5FED15', justifyContent: 'center', alignItems: 'center' },
  profilePhotoText: { fontSize: 24 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 15, fontWeight: '700', color: '#333' },
  referralLabel: { fontSize: 10, color: '#999' },
  referralIdBadge: { backgroundColor: '#7C5FED', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  referralIdText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  scrollContent: { padding: 16 },
  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  metricCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center', elevation: 2 },
  metricIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  metricLabel: { fontSize: 10, color: '#999', marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12 },
  tableContainer: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 1 },
  tableHeader: { flexDirection: 'row', padding: 12, backgroundColor: '#f9f9f9' },
  tableHeaderCell: { fontSize: 11, fontWeight: '700', color: '#666' },
  tableRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0', alignItems: 'center' },
  tableCell: { fontSize: 12, color: '#333' },
  statusBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4, alignItems: 'center' },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  chartContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 20, elevation: 1 },
  chartBars: { height: 120, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barWrapper: { alignItems: 'center', width: 30 },
  bar: { width: 12, borderRadius: 4 },
  barLabel: { fontSize: 9, color: '#999', marginTop: 8 },
  actionsContainer: { gap: 10 },
  actionButton: { flexDirection: 'row', backgroundColor: '#7C5FED', padding: 14, borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionButtonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#7C5FED' },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  actionButtonTextSecondary: { color: '#7C5FED' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  referralLinkBox: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, alignItems: 'center' },
  referralLink: { flex: 1, color: '#7C5FED', fontWeight: '600', fontSize: 13 },
  shareMethodsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  shareMethod: { alignItems: 'center' },
  settingIconCircle: { width: 55, height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  shareMethodText: { fontSize: 12, color: '#666' },
  closeButtonAction: { backgroundColor: '#7C5FED', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  closeButtonActionText: { color: '#fff', fontWeight: '700' }
});