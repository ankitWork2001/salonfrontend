import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../redux/slices/authSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ResetPasswordScreen({ navigation, route }) {
  const { email } = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();

  const handleReset = async () => {
    if(password !== confirmPassword) return alert("Passwords do not match");
    try {
      await dispatch(resetPassword({ email, newPassword: password })).unwrap();
      alert("Password reset successfully!");
      navigation.navigate('Login'); // Go to login
    } catch(err) {
      alert(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>New password,</Text>
          <Text style={styles.subtitle}>Create a new password and confirm it below</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={22} color="#8e8e8e" style={styles.icon} />
            <TextInput style={styles.input} placeholder="New password" placeholderTextColor="#8e8e8e" secureTextEntry value={password} onChangeText={setPassword}/>
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={22} color="#8e8e8e" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Confirm new password" placeholderTextColor="#8e8e8e" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword}/>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Confirm New Password</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  keyboardAvoidingContainer: { flex:1 },
  content: { flex:1, paddingHorizontal:25, paddingTop:60 },
  title: { fontSize:32, fontWeight:'bold', color:'#212121', marginBottom:10 },
  subtitle: { fontSize:16, color:'#616161', marginBottom:40 },
  inputContainer: { flexDirection:'row', alignItems:'center', backgroundColor:'#F6F7F8', borderRadius:50, marginBottom:20, paddingHorizontal:20, height:55 },
  icon: { marginRight:10 },
  input: { flex:1, fontSize:16, color:'#212121' },
  button: { backgroundColor:'#156778', paddingVertical:18, borderRadius:50, alignItems:'center', marginTop:20 },
  buttonText: { color:'#fff', fontSize:18, fontWeight:'bold' },
});
