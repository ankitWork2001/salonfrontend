import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function IndependentProProfile({navigation}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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

  const handleEdit = () => {
    Alert.alert('Edit Profile', 'Edit functionality coming soon!');
  };

  const handleUpgrade = () => {
    Alert.alert('Upgrade Plan', 'Subscription upgrade coming soon!');
  };

  // Safe access to nested properties
  const roleDetails = user?.roleDetails || {};
  const location = roleDetails?.location || {};
  const galleryImages = roleDetails?.galleryImages || [];
  const governmentId = roleDetails?.governmentId || {};
  const subscription = roleDetails?.subscription || {};

  // Helper function to format payment status
  const getPaymentStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'active':
        return '#4CAF50';
      case 'pending':
        return '#ff9800';
      case 'failed':
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getPaymentStatusIcon = status => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'active':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{ flex: 1, backgroundColor: '#156778' }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Image
              source={{
                uri:
                  galleryImages[0] ||
                  'https://via.placeholder.com/150?text=Salon',
              }}
              style={styles.salonImage}
            />
            <Text style={styles.salonName}>
              {roleDetails?.shopName || user?.name || 'N/A'}
            </Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>4.8</Text>
              <Text style={styles.reviews}>(245 reviews)</Text>
            </View>
            {governmentId?.idNumber && (
              <Text style={styles.rating}>
                {governmentId.idType}: {governmentId.idNumber}
              </Text>
            )}
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Icon name="business" size={24} color="#156778" />
              <Text style={styles.statNumber}>
                {roleDetails?.shopType || 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Shop Type</Text>
            </View>
            <View style={styles.statBox}>
              <Icon name="cut" size={24} color="#156778" />
              <Text style={styles.statNumber}>
                {roleDetails?.salonCategory || 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Category</Text>
            </View>
          </View>

          {/* Subscription Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Subscription Details</Text>
              {subscription?.paymentStatus === 'pending' && (
                <TouchableOpacity onPress={handleUpgrade}>
                  <Text style={styles.upgradeLink}>Upgrade</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.subscriptionCard}>
              {/* Payment Status */}
              <View style={styles.subscriptionRow}>
                <View style={styles.subscriptionLabel}>
                  <Icon name="card" size={20} color="#156778" />
                  <Text style={styles.subscriptionLabelText}>
                    Payment Status
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Icon
                    name={getPaymentStatusIcon(subscription?.paymentStatus)}
                    size={16}
                    color={getPaymentStatusColor(subscription?.paymentStatus)}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: getPaymentStatusColor(
                          subscription?.paymentStatus,
                        ),
                      },
                    ]}
                  >
                    {subscription?.paymentStatus?.toUpperCase() || 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Plan ID */}
              <View style={styles.subscriptionRow}>
                <View style={styles.subscriptionLabel}>
                  <Icon name="pricetag" size={20} color="#156778" />
                  <Text style={styles.subscriptionLabelText}>Current Plan</Text>
                </View>
                <Text style={styles.subscriptionValue}>
                  {subscription?.planId || 'No Active Plan'}
                </Text>
              </View>

              {/* Plan Features/Info */}
              {!subscription?.planId && (
                <View style={styles.noPlanCard}>
                  <Icon name="information-circle" size={24} color="#ff9800" />
                  <Text style={styles.noPlanText}>
                    You don't have an active subscription plan. Upgrade to
                    unlock premium features!
                  </Text>
                </View>
              )}

              {subscription?.paymentStatus === 'pending' &&
                subscription?.planId && (
                  <View style={styles.warningCard}>
                    <Icon name="warning" size={20} color="#ff9800" />
                    <Text style={styles.warningText}>
                      Payment is pending. Please complete your payment to
                      activate your subscription.
                    </Text>
                  </View>
                )}
            </View>
          </View>

          {/* Contact & Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.infoItem}>
              <Icon name="location" style={{marginTop: 10}} size={20} color="#156778" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoText}>
                  {location?.address || 'N/A'}, {location?.city || ''},{' '}
                  {location?.state || ''}
                </Text>
                {location?.pincode && (
                  <Text style={styles.infoText}>PIN: {location.pincode}</Text>
                )}
              </View>
            </View>

            {(roleDetails?.contactNumber || roleDetails?.whatsappNumber) && (
              <View style={styles.infoItem}>
                <Icon name="call" style={{marginTop: 10}} size={20} color="#156778" />
                <View style={styles.infoContent}>
                  {roleDetails?.contactNumber && (
                    <>
                      <Text style={styles.infoLabel}>Phone</Text>
                      <Text style={styles.infoText}>
                        {roleDetails.contactNumber}
                      </Text>
                    </>
                  )}
                  {roleDetails?.whatsappNumber && (
                    <>
                      <Text style={styles.infoLabel}>WhatsApp</Text>
                      <Text style={styles.infoText}>
                        {roleDetails.whatsappNumber}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            )}

            <View style={styles.infoItem}>
              <Icon name="mail" style={{marginTop: 10}} size={20} color="#156778" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoText}>{user?.email || 'N/A'}</Text>
              </View>
            </View>

            {user?.phone && (
              <View style={styles.infoItem}>
                <Icon name="phone-portrait" style={{marginTop: 10}} size={20} color="#156778" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Personal Phone</Text>
                  <Text style={styles.infoText}>{user.phone}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Verification Status */}
          {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Status</Text>
          
          <View style={styles.verificationBox}>
            <View style={styles.verificationRow}>
              <Icon 
                name={user?.isPhoneVerified ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={user?.isPhoneVerified ? "#4CAF50" : "#ff9800"} 
              />
              <Text style={styles.verificationText}>
                Phone: {user?.isPhoneVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>
            <View style={styles.verificationRow}>
              <Icon 
                name={user?.isEmailVerified ? "checkmark-circle" : "close-circle"} 
                size={20} 
                color={user?.isEmailVerified ? "#4CAF50" : "#ff9800"} 
              />
              <Text style={styles.verificationText}>
                Email: {user?.isEmailVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>
          </View>
        </View> */}

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>

            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionText}>
                Salon Category:{' '}
                {roleDetails?.salonCategory?.toUpperCase() || 'N/A'}
              </Text>
              <Text style={styles.descriptionText}>
                Home Service:{' '}
                {roleDetails?.offersHomeService ? 'Available' : 'Not Available'}
              </Text>
              <Text style={styles.descriptionText}>
                Status: {user?.status?.toUpperCase() || 'N/A'}
              </Text>
              <Text style={styles.descriptionText}>
                Account Created:{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton} onPress={()=>(navigation.navigate("IndependentProProfileEdit"))}>
              <Icon name="pencil" size={18} color="#fff" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="log-out" size={18} color="#fff" />
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerSection: {
    backgroundColor: '#156778',
    paddingVertical: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  salonImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
    marginBottom: 12,
  },
  salonName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: '#ddd',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#156778',
    marginVertical: 6,
    textTransform: 'capitalize',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  upgradeLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#156778',
    textDecorationLine: 'underline',
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subscriptionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionLabelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  subscriptionValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  noPlanText: {
    flex: 1,
    fontSize: 13,
    color: '#e65100',
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff3e0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#e65100',
    lineHeight: 18,
  },
  infoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginTop: 2,
  },
  verificationBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontWeight: '600',
  },
  descriptionBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginVertical: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#156778',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
