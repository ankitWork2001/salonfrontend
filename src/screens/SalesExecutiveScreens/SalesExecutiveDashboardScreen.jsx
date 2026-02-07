import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/salesExecutive';
const SALES_PERSON = {
  id: 'SP-2025-001',
  name: 'Rajesh Kumar',
  referralId: 'SP-2025-001',
  profilePhoto: '👨',
};

const METRICS = [
  {
    id: 1,
    label: 'Total Salons Registered',
    value: '15',
    icon: 'storefront',
    color: '#7C5FED',
  },
  {
    id: 2,
    label: 'App Downloads',
    value: '42',
    icon: 'download',
    color: '#E91E63',
  },
  {
    id: 3,
    label: 'Total Commission',
    value: '₹12,450',
    icon: 'cash',
    color: '#4CAF50',
  },
];

const SALONS_BREAKDOWN = [
  {
    id: 1,
    salonName: 'Prime Salon & Spa',
    registrationDate: '2025-01-15',
    subscriptionPlan: 'Pro',
    commission: '₹3,000',
    paymentStatus: 'Paid',
  },
  {
    id: 2,
    salonName: 'Shine Beauty Studio',
    registrationDate: '2025-01-20',
    subscriptionPlan: 'Basic',
    commission: '₹2,000',
    paymentStatus: 'Pending',
  },
  {
    id: 3,
    salonName: 'Glam House',
    registrationDate: '2025-01-25',
    subscriptionPlan: 'Pro',
    commission: '₹3,000',
    paymentStatus: 'Paid',
  },
  {
    id: 4,
    salonName: 'Hair Craft',
    registrationDate: '2025-02-01',
    subscriptionPlan: 'Basic',
    commission: '₹2,000',
    paymentStatus: 'Pending',
  },
  {
    id: 5,
    salonName: 'Luxe Salon',
    registrationDate: '2025-02-05',
    subscriptionPlan: 'Enterprise',
    commission: '₹2,450',
    paymentStatus: 'Paid',
  },
];

const MONTHLY_SALES = [
  { month: 'Jan', value: 3 },
  { month: 'Feb', value: 5 },
  { month: 'Mar', value: 4 },
  { month: 'Apr', value: 2 },
  { month: 'May', value: 1 },
];

export default function SalesExecutiveDashboardScreen() {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);
  const { summary, salesman } = useSelector((state) => state.salesExecutive);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const maxValue = Math.max(...MONTHLY_SALES.map((d) => d.value));
  const chartHeight = 100;
  const targetSalons = 20;
  const achievedSalons = 15;
  const progressPercentage = (achievedSalons / targetSalons) * 100;


  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.profilePhoto}>
              <Text style={styles.profilePhotoText}>{user.profilePhoto}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.referralLabel}>Sales Executive</Text>
            </View>
          </View>
          <View style={styles.referralIdBadge}>
            <Text style={styles.referralIdText}>{user?.roleDetails?.referralId}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Metrics Overview */}
          <View style={styles.metricsGrid}>
            {METRICS.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <View style={[styles.metricIcon, { backgroundColor: `${metric.color}20` }]}>
                  <Icon name={metric.icon} size={20} color={metric.color} />
                </View>
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={[styles.metricValue, { color: metric.color }]}>
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Detailed Breakdown Table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Registration Breakdown</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1.5 }]}>Salesman</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>ReferralID</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Comm.</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Status</Text>
              </View>

             {salesman?.length > 0 ? (
  salesman.map((item) => (
    <View style={styles.tableRow}>
  <Text style={[styles.tableCell, { flex: 1.5 }]} numberOfLines={1}>
    {item.name}
  </Text>

  <Text
    style={[styles.tableCell, { flex: 1 }]}
    numberOfLines={1}
    ellipsizeMode="middle"
  >
    {item.referralId}
  </Text>

  <Text
    style={[
      styles.tableCell,
      {
        width: 70,
        textAlign: 'center',
        fontWeight: '700',
        color: '#4CAF50',
      },
    ]}
  >
    {item.commissionRate}%
  </Text>

  <View
    style={[
      styles.statusBadge,
      {
        flex: 1,
        backgroundColor:
          item.status === 'active' ? '#C8E6C9' : '#FFE0B2',
      },
    ]}
  >
    <Text
      style={[
        styles.statusBadgeText,
        {
          color:
            item.status === 'active' ? '#2E7D32' : '#E65100',
        },
      ]}
    >
      {item.status.toUpperCase()}
    </Text>
  </View>
</View>
  ))
) : (
  <View style={{ padding: 20, alignItems: 'center' }}>
    <Text style={{ fontSize: 12, color: '#999' }}>
      No salesmen found
    </Text>
  </View>
)}

            </View>
          </View>

          {/* Monthly Growth Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Performance</Text>
            <View style={styles.chartContainer}>
              <View style={styles.chartYAxis}>
                {[5, 4, 3, 2, 1, 0].map(v => (
                  <Text key={v} style={styles.chartLabel}>{v}</Text>
                ))}
              </View>
              <View style={styles.chartBars}>
                {MONTHLY_SALES.map((data, index) => {
                  const barHeight = (data.value / maxValue) * chartHeight;
                  return (
                    <View key={index} style={styles.barWrapper}>
                      <View style={[styles.bar, { height: barHeight, backgroundColor: '#7C5FED' }]} />
                      <Text style={styles.barLabel}>{data.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Target Tracking
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Monthly Target Goal</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Salons Registered</Text>
                <Text style={styles.progressValue}>{achievedSalons} / {targetSalons}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
              </View>
              <Text style={styles.progressPercentage}>{progressPercentage.toFixed(0)}% of Target Achieved</Text>
            </View>
          </View> */}

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="add-circle" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Register New Salon</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonSecondary]}
                onPress={() => setShareModalVisible(true)}
              >
                <Icon name="share-social" size={20} color="#7C5FED" />
                <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
                  Share Referral Link
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Share Referral Modal */}
      <Modal
        visible={shareModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Referral System</Text>
              <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.referralLinkLabel}>Your Unique Link</Text>
              <View style={styles.referralLinkBox}>
                <Text style={styles.referralLink} numberOfLines={1}>
                  https://salonstartup.com/ref/{user?.roleDetails?.referralId}
                </Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Icon name="copy" size={18} color="#7C5FED" />
                </TouchableOpacity>
              </View>

              <Text style={styles.shareMethodsLabel}>Quick Share</Text>
              <View style={styles.shareMethodsGrid}>
                <ShareIcon name="logo-whatsapp" color="#25D366" label="WhatsApp" />
                <ShareIcon name="mail" color="#EA4335" label="Email" />
                <ShareIcon name="chatbubbles" color="#007AFF" label="SMS" />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShareModalVisible(false)}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const ShareIcon = ({ name, color, label }) => (
  <TouchableOpacity style={styles.shareMethod}>
    <Icon name={name} size={32} color={color} />
    <Text style={styles.shareMethodText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profilePhoto: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#7C5FED20', justifyContent: 'center', alignItems: 'center' },
  profilePhotoText: { fontSize: 24 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#333' },
  referralLabel: { fontSize: 11, color: '#999' },
  referralIdBadge: { backgroundColor: '#7C5FED', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  referralIdText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  scrollContent: { padding: 16, paddingBottom: 30 },
  metricsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  metricCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 10, alignItems: 'center', elevation: 1 },
  metricIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  metricLabel: { fontSize: 9, color: '#999', textAlign: 'center', marginBottom: 4 },
  metricValue: { fontSize: 14, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12 },
  tableContainer: { backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden', elevation: 1 },
  tableHeader: { flexDirection: 'row', padding: 10, backgroundColor: '#f9f9f9' },
  tableHeaderCell: { fontSize: 10, fontWeight: '700', color: '#666' },
  tableRow: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', alignItems: 'center' },
  tableCell: { fontSize: 11, color: '#333' },
  statusBadge: { paddingVertical: 4, borderRadius: 4, alignItems: 'center' },
  statusBadgeText: { fontSize: 9, fontWeight: '700' },
  chartContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 16, height: 160, elevation: 1 },
  chartYAxis: { justifyContent: 'space-between', marginRight: 10 },
  chartLabel: { fontSize: 10, color: '#999', width: 15, textAlign: 'right' },
  chartBars: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end' },
  barWrapper: { alignItems: 'center', width: 30 },
  bar: { width: 15, borderRadius: 4 },
  barLabel: { fontSize: 10, color: '#999', marginTop: 8 },
  progressCard: { backgroundColor: '#fff', borderRadius: 10, padding: 16, elevation: 1 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 12, fontWeight: '600' },
  progressValue: { fontSize: 12, fontWeight: '700', color: '#7C5FED' },
  progressBarBg: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: '#7C5FED', borderRadius: 4 },
  progressPercentage: { fontSize: 10, color: '#999' },
  actionsContainer: { gap: 10 },
  actionButton: { flexDirection: 'row', backgroundColor: '#7C5FED', padding: 12, borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8 },
  actionButtonSecondary: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#7C5FED' },
  actionButtonText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  actionButtonTextSecondary: { color: '#7C5FED' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700' },
  referralLinkLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8 },
  referralLinkBox: { flexDirection: 'row', backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  referralLink: { flex: 1, fontSize: 12, color: '#7C5FED' },
  shareMethodsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 },
  shareMethod: { alignItems: 'center', gap: 4 },
  shareMethodText: { fontSize: 10, color: '#666' },
  closeButton: { backgroundColor: '#7C5FED', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  closeButtonText: { color: '#fff', fontWeight: '700' },
});