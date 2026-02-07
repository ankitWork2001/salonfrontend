import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile } from '../../redux/slices/authSlice';

export default function ProfileEditScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState(user?.name || 'John Doe');
  const [email, setEmail] = useState(user?.email || 'john@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [profilePhoto, setProfilePhoto] = useState(
    user?.image || 'https://via.placeholder.com/100?text=User'
  );
  const [status, setStatus] = useState('active'); // active, blocked, inactive

  const handleUploadPhoto = () => {
    Alert.alert('Upload Photo', 'Camera/Gallery - Mock', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Select',
        onPress: () =>
          setProfilePhoto('https://via.placeholder.com/150?text=NewPhoto'),
      },
    ]);
  };

  const handleSaveChanges = async () => {
  if (!name.trim() || !email.trim() || !phone.trim()) {
    Alert.alert("Error", "All fields are required");
    return;
  }

  try {
    const res = await dispatch(
      updateUserProfile({
        name,
        email,
        phone,
      })
    ).unwrap();

    Alert.alert("Success", "Profile updated successfully");
    setIsEditing(false);
  } catch (err) {
    Alert.alert("Error", err);
  }
};


  const getStatusColor = (stat) => {
    switch (stat) {
      case 'active':
        return '#4CAF50';
      case 'blocked':
        return '#f44336';
      case 'inactive':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (stat) => {
    switch (stat) {
      case 'active':
        return 'checkmark-circle';
      case 'blocked':
        return 'close-circle';
      case 'inactive':
        return 'pause-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Icon name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Photo */}
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: profilePhoto }}
              style={styles.profilePhoto}
            />
            {isEditing && (
              <TouchableOpacity
                style={styles.editPhotoBadge}
                onPress={handleUploadPhoto}
              >
                <Icon name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Status Badge */}
          <View style={styles.statusBadgeContainer}>
            <Icon
              name={getStatusIcon(status)}
              size={16}
              color={getStatusColor(status)}
            />
            <Text
              style={[
                styles.statusBadgeText,
                { color: getStatusColor(status) },
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputEditable}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
              />
            ) : (
              <View style={styles.displayField}>
                <Text style={styles.displayValue}>{name}</Text>
              </View>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputEditable}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                keyboardType="email-address"
              />
            ) : (
              <View style={styles.displayField}>
                <Text style={styles.displayValue}>{email}</Text>
              </View>
            )}
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone</Text>
            {isEditing ? (
              <TextInput
                style={styles.inputEditable}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            ) : (
              <View style={styles.displayField}>
                <Text style={styles.displayValue}>{phone}</Text>
              </View>
            )}
          </View>

          {/* Status Field (Display Only) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.displayField}>
              <View style={styles.statusDisplay}>
                <Icon
                  name={getStatusIcon(status)}
                  size={16}
                  color={getStatusColor(status)}
                />
                <Text
                  style={[
                    styles.displayValue,
                    { color: getStatusColor(status) },
                  ]}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Icon name="pencil" size={18} color="#fff" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsEditing(false)}
              >
                <Icon name="close" size={18} color="#7C5FED" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveChanges}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Icon name="checkmark" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Account Information</Text>
          <View style={styles.infoItem}>
            <Icon name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.infoText}>Your account is verified</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="lock-closed" size={16} color="#FF9800" />
            <Text style={styles.infoText}>Password secured</Text>
          </View>
        </View>
      </ScrollView>
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
  headerPlaceholder: {
    width: 24,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#7C5FED',
  },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C5FED',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  formSection: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  displayField: {
    backgroundColor: '#f5f0ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8d4f8',
  },
  displayValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  inputEditable: {
    backgroundColor: '#f5f0ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#7C5FED',
    fontSize: 14,
    color: '#333',
  },
  statusDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#7C5FED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7C5FED',
    gap: 6,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#7C5FED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
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
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C5FED',
  },
  infoSection: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
  },
});