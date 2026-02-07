import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RoleSelectionScreen({ navigation }) {
  const handleRoleSelect = (role) => {
    if (role === 'salon_owner') {
      navigation?.navigate('SalonOwnerRegistration');
    } else if (role === 'independent') {
      navigation?.navigate('IndependentRegistration');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register As</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>
          Select how you'd like to join our platform
        </Text>

        {/* Salon Owner Option */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('salon_owner')}
        >
          <View style={styles.roleCardContent}>
            <View style={[styles.iconContainer, styles.iconSalon]}>
              <Icon name="storefront" size={40} color="#156778" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Salon Owner</Text>
              <Text style={styles.roleDescription}>
                Register your salon and manage bookings, staff, and services
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={24} color="#156778" />
        </TouchableOpacity>

        {/* Independent Professional Option */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('independent')}
        >
          <View style={styles.roleCardContent}>
            <View style={[styles.iconContainer, styles.iconIndependent]}>
              <Icon name="person" size={40} color="#E91E63" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleName}>Independent Professional</Text>
              <Text style={styles.roleDescription}>
                Freelance beautician/barber. Work independently and manage your schedule
              </Text>
            </View>
          </View>
          <Icon name="chevron-forward" size={24} color="#E91E63" />
        </TouchableOpacity>

        {/* Features Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Register With Us?</Text>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Easy Setup</Text>
              <Text style={styles.featureDesc}>
                Complete registration in just 3 steps
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Instant Bookings</Text>
              <Text style={styles.featureDesc}>
                Start receiving customer bookings immediately
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure & Verified</Text>
              <Text style={styles.featureDesc}>
                All professionals are verified for quality assurance
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon name="checkmark-circle" size={20} color="#4CAF50" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Dedicated Support</Text>
              <Text style={styles.featureDesc}>
                24/7 customer support for all your needs
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Back to Login */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already registered? </Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Login')}>
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
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
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  headerPlaceholder: {
    width: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 16,
    marginBottom: 24,
    marginTop: 4,
  },
  roleCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  roleCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSalon: {
    backgroundColor: '#E8F4F8',
  },
  iconIndependent: {
    backgroundColor: '#FCE4EC',
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  infoSection: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  featureDesc: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E90FF',
  },
});