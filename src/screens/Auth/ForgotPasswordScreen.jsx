import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearAuthState } from '../../redux/slices/authSlice';

export default function ForgotPasswordScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  // Get loading and error from redux
  const { loading, error, forgotPasswordMessage } = useSelector(state => state.auth);

  const handleForgotPassword = async () => {
    try {
      // Clear previous states
      dispatch(clearAuthState());
      // Dispatch forgot password
      await dispatch(forgotPassword({ email })).unwrap();
      // Navigate to OTP screen with email
      navigation.navigate('EmailVerification', { email });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Forgot password,</Text>
          <Text style={styles.subtitle}>
            Please type your email below and we will give you an OTP code
          </Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={22} color="#8e8e8e" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#8e8e8e"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleForgotPassword} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send Code</Text>
            )}
          </TouchableOpacity>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingContainer: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#212121', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#616161', marginBottom: 40 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
    borderRadius: 50,
    marginBottom: 15,
    paddingHorizontal: 20,
    height: 55,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#212121' },
  button: {
    backgroundColor: '#156778',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  errorText: { color: 'red', marginTop: 15, textAlign: 'center' },
});
