import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from '../../redux/slices/authSlice';
import Loader from '../../components/Loader';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexPnoneNo = /^[6-9]\d{9}$/;

export default function RegisterScreen({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');

  const dispatch = useDispatch();
  const { signUpLoading, error } = useSelector((state) => state.auth);

  const countryFlags = {
    '+91': 'https://flagcdn.com/w20/in.png',
    '+01': 'https://flagcdn.com/w20/us.png',
    '+44': 'https://flagcdn.com/w20/gb.png',
  };

  const handleRegister = async () => {
    if (!name || !email || !mobileNumber || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    else if(!regexEmail.test(email)){
      Alert.alert("Please Enter Valid Email!");
      return;
    }else if(!regexPnoneNo.test(mobileNumber)){
      Alert.alert("Please Enter Valid Mobile Number!");
      return;
    }
    try {
      await dispatch(signupUser({ name, email, phone: mobileNumber, password })).unwrap();
      Alert.alert("Success", "Account created successfully");
    } catch (error) {
      Alert.alert("Signup Failed", error);
    }
  };

  const signInWithGoogle = async () => {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
  
        const idToken = userInfo.data.idToken;
  
        // Send this token to backend
        console.log(idToken);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create an account,</Text>
        <Text style={styles.subtitle}>
          Please type full information bellow and we can {'\n'}create your account
        </Text>

        {/* Name Input */}
        <View style={styles.inputBox}>
          <View style={styles.inputWrapper}>
            <Feather name="user" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Feather name="mail" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mobile Number Input with Country Code */}
          <View style={styles.inputWrapper}>
            <View style={styles.countryCodeContainer}>
              <Image
                source={{ uri: countryFlags[selectedCountryCode] }}
                style={styles.flagIcon}
              />
              <Text style={styles.countryCodeText}>{selectedCountryCode}</Text>

              <Picker
                selectedValue={selectedCountryCode}
                onValueChange={(itemValue) => setSelectedCountryCode(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="+91" value="+91" />
                <Picker.Item label="+01" value="+01" />
                <Picker.Item label="+44" value="+44" />
              </Picker>
            </View>

            <TextInput
              style={[styles.input, styles.mobileInput]}
              placeholder="Mobile number"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Feather name="lock" size={20} color="#888" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
              <Feather
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.termsText}>
          By signing up you agree to our <Text style={styles.linkText}>Term of use and privacy {'\n'}notice</Text>
        </Text>

        {/* Join Now Button */}
        <TouchableOpacity
          style={[styles.joinNowButton, signUpLoading && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={signUpLoading}
        >
          {signUpLoading ? (
            <Loader />
          ) : (
            <Text style={styles.joinNowText}>Join Now</Text>
          )}
        </TouchableOpacity>

        {error && (
          <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        )}

        {/* Divider */}
        <Text style={styles.orText}>or</Text>

        {/* Google Sign-Up */}
        <TouchableOpacity onPress={signInWithGoogle} style={styles.googleButton}>
          <Image
            source={require('../../assets/google-logo.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Join with Google</Text>
        </TouchableOpacity>

        {/* Already have an account? Sign In */}
        <TouchableOpacity>
          <Text style={styles.footerText}>
            Already have an account? <Text onPress={() => navigation.navigate('Login')} style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        {/* Are You a Service Provider? */}
        <TouchableOpacity
          style={styles.providerContainer}
          onPress={() => navigation.navigate('RoleSelection')}
        >
          <Text style={styles.providerText}>Are You a Service Provider?</Text>
          <Text style={styles.providerLink}>Register as Partner</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: StatusBar.currentHeight + 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1A1A1A',
  },
  subtitle: {
    color: '#888',
    marginBottom: 40,
    fontSize: 16,
    lineHeight: 24,
  },
  inputBox: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3F6',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  mobileInput: {
    flex: 1,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 5,
    color: '#333',
  },
  flagIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 5,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  picker: {
    width: 40,
    height: 50,
    color: '#333',
    paddingVertical: 0,
    justifyContent: 'center',
  },
  pickerItem: {
    fontSize: 16,
  },
  pickerArrow: {
    marginLeft: -5,
    marginRight: 5,
  },
  eyeIconContainer: {
    paddingLeft: 10,
  },
  termsText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  linkText: {
    color: '#1E90FF',
    fontWeight: '600',
  },
  providerContainer: {
    marginTop: 20,
    backgroundColor: '#E8F6F9',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  providerText: {
    fontSize: 15,
    color: '#156778',
    fontWeight: '600',
  },
  providerLink: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: 'bold',
    marginTop: 3,
  },
  joinNowButton: {
    backgroundColor: '#156778',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  joinNowText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  googleText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 15,
  },
  signInLink: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});