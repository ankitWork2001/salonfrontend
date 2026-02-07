import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function SuperAdminProfileScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);

  const [editFormData, setEditFormData] = useState(user);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  console.log(user);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    monthlyReports: true,
  });

  const handleEditProfile = () => {
    if (!editFormData.name || !editFormData.email || !editFormData.phone) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setProfileData(editFormData);
    setEditMode(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    Alert.alert('Success', 'Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setChangePasswordModal(false);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        {!editMode && (
          <TouchableOpacity
            style={styles.editHeaderButton}
            onPress={() => {
              setEditFormData(profileData);
              setEditMode(true);
            }}
          >
            <Icon name="pencil" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👨‍💼</Text>
          </View>

          {editMode ? (
            <View style={styles.editForm}>
              <TextInput
                style={styles.editInput}
                placeholder="Full Name"
                value={editFormData.name}
                onChangeText={(text) => setEditFormData({ ...editFormData, name: text })}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.editInput}
                placeholder="Email"
                value={editFormData.email}
                onChangeText={(text) => setEditFormData({ ...editFormData, email: text })}
                keyboardType="email-address"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.editInput}
                placeholder="Phone"
                value={editFormData.phone}
                onChangeText={(text) => setEditFormData({ ...editFormData, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
              />
              <View style={styles.editButtonGroup}>
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={styles.cancelEditButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveEditButton}
                  onPress={handleEditProfile}
                >
                  <Icon name="checkmark" size={16} color="#fff" />
                  <Text style={styles.saveEditButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              {/* <Text style={styles.profileDesignation}>{profileData.designation}</Text> */}
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profilePhone}>{user.phone}</Text>
              <Text style={styles.joinDateText}>Joined {new Date(user.createdAt).toLocaleDateString()}</Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Icon name="people" size={24} color="#7C5FED" />
              <Text style={styles.statBoxLabel}>Total Users</Text>
              <Text style={styles.statBoxValue}>156</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="storefront" size={24} color="#E91E63" />
              <Text style={styles.statBoxLabel}>Total Salons</Text>
              <Text style={styles.statBoxValue}>45</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="cash" size={24} color="#4CAF50" />
              <Text style={styles.statBoxLabel}>Total Revenue</Text>
              <Text style={styles.statBoxValue}>₹8.4L</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="pricetag" size={24} color="#2196F3" />
              <Text style={styles.statBoxLabel}>Categories</Text>
              <Text style={styles.statBoxValue}>12</Text>
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setChangePasswordModal(true)}
          >
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="lock-closed" size={20} color="#FF9800" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>Change Password</Text>
                <Text style={styles.optionCardSubtitle}>Update your password</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => setSettingsModal(true)}
          >
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="shield" size={20} color="#4CAF50" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>Security Settings</Text>
                <Text style={styles.optionCardSubtitle}>Manage authentication & access</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.optionCard}>
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="mail" size={20} color="#2196F3" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>Email Notifications</Text>
                <Text style={styles.optionCardSubtitle}>Receive email alerts</Text>
              </View>
            </View>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(val) =>
                setSettings({ ...settings, emailNotifications: val })
              }
              trackColor={{ false: '#DDD', true: '#7C5FED40' }}
              thumbColor={settings.emailNotifications ? '#7C5FED' : '#999'}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="phone-portrait" size={20} color="#E91E63" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>SMS Notifications</Text>
                <Text style={styles.optionCardSubtitle}>Receive SMS alerts</Text>
              </View>
            </View>
            <Switch
              value={settings.smsNotifications}
              onValueChange={(val) =>
                setSettings({ ...settings, smsNotifications: val })
              }
              trackColor={{ false: '#DDD', true: '#E91E6340' }}
              thumbColor={settings.smsNotifications ? '#E91E63' : '#999'}
            />
          </View>

          <View style={styles.optionCard}>
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="document" size={20} color="#4CAF50" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>Monthly Reports</Text>
                <Text style={styles.optionCardSubtitle}>Receive monthly summary</Text>
              </View>
            </View>
            <Switch
              value={settings.monthlyReports}
              onValueChange={(val) =>
                setSettings({ ...settings, monthlyReports: val })
              }
              trackColor={{ false: '#DDD', true: '#4CAF5040' }}
              thumbColor={settings.monthlyReports ? '#4CAF50' : '#999'}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="help-circle" size={20} color="#2196F3" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>Help & Support</Text>
                <Text style={styles.optionCardSubtitle}>Get help or contact support</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="document-text" size={20} color="#FF9800" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>Privacy Policy</Text>
                <Text style={styles.optionCardSubtitle}>View our privacy policy</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionCardLeft}>
              <View style={styles.optionIconContainer}>
                <Icon name="information-circle" size={20} color="#4CAF50" />
              </View>
              <View style={styles.optionCardContent}>
                <Text style={styles.optionCardTitle}>About App</Text>
                <Text style={styles.optionCardSubtitle}>Version 1.0.0</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setChangePasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setChangePasswordModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Current Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, currentPassword: text })
                }
                secureTextEntry
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>New Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password (min 8 characters)"
                value={passwordData.newPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, newPassword: text })
                }
                secureTextEntry
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChangeText={(text) =>
                  setPasswordData({ ...passwordData, confirmPassword: text })
                }
                secureTextEntry
                placeholderTextColor="#999"
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setChangePasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
                <Icon name="checkmark" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={settingsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security Settings</Text>
              <TouchableOpacity onPress={() => setSettingsModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <View style={styles.settingItem}>
                <View>
                  <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.settingSubtitle}>
                    Add extra security to your account
                  </Text>
                </View>
                <Switch
                  value={settings.twoFactorAuth}
                  onValueChange={(val) =>
                    setSettings({ ...settings, twoFactorAuth: val })
                  }
                  trackColor={{ false: '#DDD', true: '#4CAF5040' }}
                  thumbColor={settings.twoFactorAuth ? '#4CAF50' : '#999'}
                />
              </View>

              <View style={styles.infoBox}>
                <Icon name="information-circle" size={20} color="#2196F3" />
                <View style={styles.infoBoxText}>
                  <Text style={styles.infoBoxTitle}>Active Sessions</Text>
                  <Text style={styles.infoBoxSubtitle}>
                    You have 1 active session. Suspicious activity? Sign out all devices.
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.signOutButton}>
                <Icon name="log-out" size={16} color="#F44336" />
                <Text style={styles.signOutButtonText}>Sign Out All Devices</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => setSettingsModal(false)}
              >
                <Icon name="checkmark" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>Done</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  editHeaderButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#7C5FED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C5FED20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileDesignation: {
    fontSize: 13,
    color: '#7C5FED',
    fontWeight: '600',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  profilePhone: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  joinDateText: {
    fontSize: 11,
    color: '#999',
  },
  editForm: {
    width: '100%',
  },
  editInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  editButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelEditButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  cancelEditButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  saveEditButton: {
    flex: 1,
    backgroundColor: '#7C5FED',
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  saveEditButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 8,
    marginBottom: 4,
  },
  statBoxValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  optionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCardContent: {
    flex: 1,
  },
  optionCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  optionCardSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginVertical: 16,
  },
  infoBoxText: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1565C0',
  },
  infoBoxSubtitle: {
    fontSize: 11,
    color: '#0D47A1',
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    marginTop: 12,
  },
  signOutButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F44336',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
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