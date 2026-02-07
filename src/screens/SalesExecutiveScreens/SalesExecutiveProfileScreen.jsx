import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Redux Actions
import { logout } from '../../redux/slices/authSlice';
import { showSnackbar } from '../../redux/slices/snackbarSlice';

const PROFILE_STATS = [
  { id: 1, label: 'Total Salons', value: '15', icon: 'storefront', color: '#7C5FED' },
  { id: 2, label: 'Commissions', value: '₹12,450', icon: 'cash', color: '#4CAF50' },
  { id: 3, label: 'Downloads', value: '42', icon: 'download', color: '#2196F3' },
];

export default function SalesExecutiveProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const [editMode, setEditMode] = useState(false);
  
  // Mapping Redux user to local state
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsappNumber || user?.phone || '',
    address: user?.address || 'Address not provided',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  // Keep form in sync if Redux user updates
  useEffect(() => {
    if (user) {
      setEditFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsappNumber || user.phone,
        address: user.address || 'Address not provided',
      });
    }
  }, [user]);

  const handleEditProfile = () => {
    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      dispatch(showSnackbar({ message: 'Please fill all required fields', type: 'warning' }));
      return;
    }
    
    // Logic for API call would go here
    setEditMode(false);
    dispatch(showSnackbar({ message: 'Profile updated successfully!', type: 'success' }));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          {!editMode && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditMode(true)}
            >
              <Icon name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>👨</Text>
            </View>

            {editMode ? (
              <View style={styles.editForm}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.name}
                  onChangeText={(text) => setEditFormData({ ...editFormData, name: text })}
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.email}
                  onChangeText={(text) => setEditFormData({ ...editFormData, email: text })}
                  keyboardType="email-address"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.phone}
                  onChangeText={(text) => setEditFormData({ ...editFormData, phone: text })}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>WhatsApp Number</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.whatsapp}
                  onChangeText={(text) => setEditFormData({ ...editFormData, whatsapp: text })}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  style={styles.input}
                  value={editFormData.address}
                  onChangeText={(text) => setEditFormData({ ...editFormData, address: text })}
                  placeholderTextColor="#999"
                />

                <View style={styles.editButtonGroup}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setEditMode(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveButton} onPress={handleEditProfile}>
                    <Icon name="checkmark" size={16} color="#fff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Sales Executive'}</Text>
                <View style={styles.referralBadge}>
                  <Text style={styles.referralBadgeText}>{user?.roleDetails?.referralId || 'SP-XXXX'}</Text>
                </View>

                <View style={styles.profileDetails}>
                  <DetailItem icon="mail" text={user?.email} />
                  <DetailItem icon="call" text={user?.phone} />
                  <DetailItem icon="logo-whatsapp" text={user?.whatsappNumber || user?.phone} iconColor="#25D366" />
                  <DetailItem icon="location" text={user?.address || 'No address set'} />
                  <DetailItem icon="calendar" text={`Joined ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}`} />
                </View>
              </View>
            )}
          </View>

          {/* Performance Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
            <View style={styles.statsGrid}>
              {PROFILE_STATS.map((stat) => (
                <View key={stat.id} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}20` }]}>
                    <Icon name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <SettingToggle
              icon="mail"
              color="#2196F3"
              title="Email Notifications"
              value={notificationSettings.emailNotifications}
              onToggle={(v) => setNotificationSettings({ ...notificationSettings, emailNotifications: v })}
            />
            <SettingToggle
              icon="notifications"
              color="#FF9800"
              title="Push Notifications"
              value={notificationSettings.pushNotifications}
              onToggle={(v) => setNotificationSettings({ ...notificationSettings, pushNotifications: v })}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Sub-components for cleaner code
const DetailItem = ({ icon, text, iconColor = "#7C5FED" }) => (
  <View style={styles.detailItem}>
    <Icon name={icon} size={16} color={iconColor} />
    <Text style={styles.detailText}>{text || 'N/A'}</Text>
  </View>
);

const SettingToggle = ({ icon, color, title, value, onToggle }) => (
  <View style={styles.settingCard}>
    <View style={styles.settingContent}>
      <View style={[styles.settingIcon, { backgroundColor: `${color}15` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <Text style={styles.settingTitle}>{title}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#DDD', true: `${color}40` }}
      thumbColor={value ? color : '#999'}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  editButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#7C5FED', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#7C5FED20', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40 },
  profileInfo: { alignItems: 'center', width: '100%' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
  referralBadge: { backgroundColor: '#7C5FED', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 6, marginBottom: 16 },
  referralBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  profileDetails: { width: '100%', gap: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailText: { fontSize: 13, color: '#666', flex: 1 },
  editForm: { width: '100%' },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 10, fontSize: 14, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  editButtonGroup: { flexDirection: 'row', gap: 10, marginTop: 10 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  cancelButtonText: { fontWeight: '600', color: '#666' },
  saveButton: { flex: 1, backgroundColor: '#7C5FED', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  saveButtonText: { fontWeight: '600', color: '#fff' },
  statsSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12 },
  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center', elevation: 1 },
  statIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statLabel: { fontSize: 10, color: '#999', marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: '700' },
  section: { marginBottom: 20 },
  settingCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8 },
  settingContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 32, height: 32, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  settingTitle: { fontSize: 13, fontWeight: '600' },
  logoutButton: { flexDirection: 'row', backgroundColor: '#F44336', padding: 14, borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 10 },
  logoutButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});