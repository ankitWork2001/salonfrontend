import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { verifyOTP, forgotPassword } from '../../redux/slices/authSlice';

const OTP_LENGTH = 4;

export default function EmailVerificationScreen({ navigation, route }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev === 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= OTP_LENGTH) setOtp(numericText);
  };

  const handleVerify = async () => {
    try {
      await dispatch(verifyOTP({ email, otp })).unwrap();
      navigation.navigate('ResetPassword', { email });
    } catch (err) {
      alert(err);
    }
  };

  const handleResend = () => {
    setOtp('');
    setTimer(159);
    inputRef.current?.focus();
    dispatch(forgotPassword({ email }));
  };

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior="height"
        style={styles.keyboardAvoidingContainer}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Email verification,</Text>
          <Text style={styles.subtitle}>
            Please type OTP code that we sent to your email
          </Text>

          {/* OTP Boxes */}
          <View style={styles.otpContainer}>
            {Array.from({ length: OTP_LENGTH }).map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.otpBox, i === otp.length && styles.focusedOtpBox]}
                activeOpacity={0.8}
                onPress={() => {
                  // Android fix: blur then focus to reopen keyboard
                  inputRef.current?.blur();
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 50);
                }}
              >
                <Text style={styles.otpText}>{otp[i] || ''}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hidden Input for Android */}
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            keyboardType="number-pad"
            value={otp}
            onChangeText={handleOtpChange}
            maxLength={OTP_LENGTH}
            autoFocus={true}
          />

          {/* Resend */}
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <Text style={[styles.resendText, timer > 0 && styles.disabledResend]}>
              Resend in {formatTime(timer)}
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Verify Email</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoidingContainer: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#212121', marginBottom: 10, alignSelf: 'flex-start' },
  subtitle: { fontSize: 16, color: '#616161', marginBottom: 40, alignSelf: 'flex-start' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  otpBox: { width: 70, height: 70, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F7F8' },
  focusedOtpBox: { borderColor: '#156778', borderWidth: 2 },
  otpText: { fontSize: 28, fontWeight: '600', color: '#212121' },
  hiddenInput: { width: 1, height: 1, opacity: 1, position: 'absolute', left: 0, top: 0 }, // Android-friendly
  resendText: { color: '#156778', fontSize: 15, fontWeight: '600', marginBottom: 40 },
  disabledResend: { color: '#9e9e9e' },
  button: { backgroundColor: '#156778', paddingVertical: 18, borderRadius: 50, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
