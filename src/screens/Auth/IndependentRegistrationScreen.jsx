import React, { useEffect, useState } from 'react';
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

// 🚨 Import Redux hooks and the signup thunk
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { signupIndependentProfessional } from '../../redux/slices/authSlice';
import { fetchAllCategories } from '../../redux/slices/categoriesSlice';
import {showSnackbar} from '../../redux/slices/snackbarSlice';

// 🚨 Import your custom upload function
import { uploadImageToCloudinary } from '../../api/claudinary';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// --- CONSTANTS ---
const STEPS = {
  PERSONAL: 1,
  AVAILABILITY: 2,
  VERIFICATION: 3,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = [
  { id: 'morning', label: 'Full Morning (9am-12pm)', start: '09:00', end: '12:00' },
  { id: 'afternoon', label: 'Full Afternoon (12pm-5pm)', start: '12:00', end: '17:00' },
  { id: 'evening', label: 'Full Evening (5pm-8pm)', start: '17:00', end: '20:00' },
];

const ID_TYPES = ['Aadhar', 'PAN', 'Driving License', 'Passport']; // Passport can be mapped to 'DL' or added to schema

export default function IndependentRegistrationScreen({ navigation }) {
  
  const dispatch = useDispatch();
  const { signUpLoading } = useSelector(state => state.auth);
  const { categories, loading, error } = useSelector(state => state.categories);

  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);

  // Step 1: Personal Info
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [contact, setContact] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);

  // Step 2: Availability
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlotsState, setTimeSlotsState] = useState(
    TIME_SLOTS.map(slot => ({ ...slot, selected: false }))
  );

  // Step 3: Verification
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idProof, setIdProof] = useState(null);


  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  console.log(categories);

  // --- HANDLERS ---

  // Mock function to simulate selecting an image
 // --- Image Picker Logic ---
   const pickImage = async (type, index, isIDProof = false) => {
     const options = {
       mediaType: 'photo',
       maxWidth: 800,
       maxHeight: 800,
       quality: 0.8,
     };
 
     let result;
     if (type === 'camera') {
       result = await launchCamera(options);
     } else {
       result = await launchImageLibrary(options);
     }
 
     if (result.assets && result.assets.length > 0) {
       const uri = result.assets[0].uri;
       if (isIDProof) {
         setIdProof(uri);
       } else {
          setProfilePhoto(uri);
       }
     }
   };
 
   const handleUploadPhoto = (index) => {
     Alert.alert('Upload Image', 'Choose an option', [
       { text: 'Cancel', style: 'cancel' },
       {
         text: 'Camera',
         onPress: () => pickImage('camera', index, false),
       },
       {
         text: 'Gallery',
         onPress: () => pickImage('gallery', index, false),
       },
     ]);
   };
 
   const handleUploadIDProof = () => {
     Alert.alert('Upload ID Proof', 'Choose an option', [
       { text: 'Cancel', style: 'cancel' },
       {
         text: 'Camera',
         onPress: () => pickImage('camera', null, true),
       },
       {
         text: 'Gallery',
         onPress: () => pickImage('gallery', null, true),
       },
     ]);
   };


   const handleSpecializationSelect = (value) => {
  if (!value) return;

  setSelectedSpecializations((prev) => {
    if (prev.includes(value)) {
      // remove if already selected
      return prev.filter((id) => id !== value);
    } else {
      // add to array
      return [...prev, value];
    }
  });
};

  // Toggle day
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Select All Days
  const selectAllDays = () => {
    setSelectedDays(DAYS);
  };

  // Weekdays Only
  const weekdaysOnly = () => {
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  };

  // Toggle time slot
  const toggleTimeSlot = (slotId) => {
    setTimeSlotsState(
      timeSlotsState.map((slot) =>
        slot.id === slotId ? { ...slot, selected: !slot.selected } : slot
      )
    );
  };


  const handleNext = () => {
    // --- Step 1 Validation ---
    if (currentStep === STEPS.PERSONAL) {
      if (!fullName || !gender || !contact || !experience || !profilePhoto) {
        dispatch(showSnackbar({message: "Please fill all required personal fields, including a profile photo.", type: "error"}));
        return;
      }
      setCurrentStep(STEPS.AVAILABILITY);
      return;
    } 
    
    // --- Step 2 Validation ---
    if (currentStep === STEPS.AVAILABILITY) {
      const hasSelectedDay = selectedDays.length > 0;
      const hasSelectedSlot = timeSlotsState.some(slot => slot.selected);
      if (!hasSelectedDay || !hasSelectedSlot) {
        dispatch(showSnackbar({message: "Please select at least one available day and time slot.", type: "error"}));
        return;
      }
      setCurrentStep(STEPS.VERIFICATION);
      return;
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.PERSONAL) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation?.goBack();
    }
  };

  // --- DATA MAPPING FUNCTIONS ---

  // Maps the UI state to the required backend structure for IndependentProfessional.js
  const mapAvailabilityToSchema = () => {
    const selectedTimeSlots = timeSlotsState.filter(slot => slot.selected);
    const availabilityData = [];

    // For each selected day, add all selected time slots
    selectedDays.forEach(day => {
      selectedTimeSlots.forEach(slot => {
        availabilityData.push({
          day: day,
          start: slot.start,
          end: slot.end,
        });
      });
    });

    return availabilityData;
  };
  
  // Extracts the number from the experience string (e.g., "5 years" -> 5)
  const getExperienceYears = (expString) => {
    const match = expString.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  // --- FINAL SUBMISSION LOGIC ---

  const handleSubmit = async () => {
    // Final validation for Step 3
    if (!idType || !idNumber || !idProof) {
      dispatch(showSnackbar({message: "Please fill all required verification fields.", type: "error"}));
      return;
    }

    let profilePhotoUrl = '';
    let idProofUrl = '';

    try {
      // 1. Upload Profile Photo
      if (profilePhoto) {
        Alert.alert('Uploading', 'Uploading profile photo, please wait...', [{text:'OK'}]);
        profilePhotoUrl = await uploadImageToCloudinary(profilePhoto);
        console.log("Profile Photo URL:", profilePhotoUrl);
      }

      // 2. Upload ID Proof
      if (idProof) {
        Alert.alert('Uploading', 'Uploading ID proof, please wait...', [{text:'OK'}]);
        idProofUrl = await uploadImageToCloudinary(idProof);
        console.log("ID Proof URL:", idProofUrl);
      }
      
      // 3. Prepare the final independentData payload
      const independentData = {
        gender: gender.toLowerCase(),
        experienceYears: getExperienceYears(experience),
        profilePhoto: profilePhotoUrl,
        availability: mapAvailabilityToSchema(),
        specializations: selectedSpecializations,
        governmentId: {
          idType: idType,
          idNumber: idNumber,
          idImageUrl: idProofUrl,
        },
        // Location will need to be added in a real app (e.g., by asking for current location or service area)
        // For now, location is omitted as the UI doesn't collect it.
      };

      const resultAction = await dispatch(signupIndependentProfessional({
        name: fullName,
        email: email,
        phone: contact,
        password: password,
        independentData: independentData,
      }));

      if (signupIndependentProfessional.fulfilled.match(resultAction)) {
        Alert.alert('Success 🎉', 'Registration submitted! You are now logged in. Awaiting admin verification.', [
          {
            text: 'OK',
            onPress: () => navigation?.navigate('MainApp'),
          },
        ]);
      } else {
        const errorMessage = resultAction.payload || 'An unknown error occurred during signup.';
        Alert.alert('Registration Failed', errorMessage);
      }

    } catch (error) {
      console.error("Submission Error:", error);
      Alert.alert('Submission Error', error.message || 'Failed to complete registration due to an upload error.');
    }
  };

  const isSubmitting = signUpLoading;
  const getStepStatus = (step) => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'active';
    return 'inactive';
  };

  const renderStepIndicator = (step, label) => {
    const status = getStepStatus(step);
    let bgColor = '#f0f0f0';
    let iconColor = '#999';

    if (status === 'completed') {
      bgColor = '#4CAF50';
      iconColor = '#fff';
    } else if (status === 'active') {
      bgColor = '#E91E63';
      iconColor = '#fff';
    }

    return (
      <View key={step} style={styles.stepIndicatorContainer}>
        <View style={[styles.stepCircle, { backgroundColor: bgColor }]}>
          {status === 'completed' ? (
            <Icon name="checkmark" size={18} color={iconColor} />
          ) : (
            <Text style={[styles.stepNumber, { color: iconColor }]}>{step}</Text>
          )}
        </View>
        <Text style={styles.stepLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Earn with Us</Text>
        <Text style={styles.headerSubtitle}>
          (Independent Beautician / Barber Registration)
        </Text>
      </View>

      {/* Step Indicators  */}
      <View style={styles.stepIndicators}>
        {renderStepIndicator(1, 'Personal Info')}
        {renderStepIndicator(2, 'Availability')}
        {renderStepIndicator(3, 'Verification')}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === STEPS.PERSONAL && (
          <View>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Text style={styles.sectionSubtitle}>Tell us about yourself</Text>

            {/* Profile Photo */}
            <View style={styles.photoContainer}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Icon name="person" size={40} color="#E91E63" />
                </View>
              )}
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={() => handleUploadPhoto(setProfilePhoto)}
              >
                <Icon name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoLabel}>Upload your profile photo *</Text>

            {/* Full Name */}
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor="#999"
            />

              <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />

            {/* Gender */}
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.genderContainer}>
              {['Male', 'Female', 'Other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderButton,
                    gender === option && styles.genderButtonSelected,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      gender === option && styles.genderButtonTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Contact Number */}
            <Text style={styles.label}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WhatsApp number"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            {/* Professional Experience */}
            <Text style={styles.label}>Professional Experience *</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., 5 years"
              value={experience}
              onChangeText={setExperience}
              keyboardType="default"
              placeholderTextColor="#999"
            />

            {/* dropdown to fetchAllCategories and select specialization */}
            <Text style={styles.label}>Specialization Category *</Text>
<View style={styles.dropdownContainer}>
  <Picker
    selectedValue={null}    // always reset to allow multi-select
    onValueChange={handleSpecializationSelect}
    style={styles.picker}
  >
    <Picker.Item label="Select Specialization" value={null} />

    {categories?.map((category) => (
      <Picker.Item
        key={category._id}
        label={`${category.name} ${category.gender}`}
        value={category._id}
      />
    ))}
  </Picker>
</View>

<View style={{ marginTop: 10 }}>
  <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
    Selected Categories:
  </Text>

  {selectedSpecializations.length === 0 && (
    <Text>No categories selected</Text>
  )}

  {selectedSpecializations.map((id) => {
    const c = categories.find((cat) => cat._id === id);
    return (
      <Text key={id} style={{ paddingVertical: 3 }}>
        • {c?.name} {c?.gender}
      </Text>
    );
  })}
</View>

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Icon name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: AVAILABILITY */}
        {currentStep === STEPS.AVAILABILITY && (
          <View>
            <Text style={styles.sectionTitle}>Available Days *</Text>
            <Text style={styles.sectionSubtitle}>
              Select the days you're available for bookings
            </Text>

            {/* Select All / Weekdays Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={selectAllDays}
              >
                <Text style={styles.optionButtonText}>Select All Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={weekdaysOnly}
              >
                <Text style={styles.optionButtonText}>Weekdays Only</Text>
              </TouchableOpacity>
            </View>

            {/* Day Toggles */}
            <View style={styles.daysContainer}>
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    selectedDays.includes(day) && styles.dayButtonSelected,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonText,
                      selectedDays.includes(day) && styles.dayButtonTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Days Selected Info */}
            <View style={styles.infoBox}>
              <Icon name="calendar" size={24} color="#E91E63" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>
                  {selectedDays.length} days selected
                </Text>
                <Text style={styles.infoSubtitle}>
                  {selectedDays.length === 0 ? 'Select at least one day' : selectedDays.join(', ')}
                </Text>
              </View>
            </View>

            {/* Available Time Slots */}
            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Available Time Slots *
            </Text>
            <Text style={styles.sectionSubtitle}>
              Choose your working hours - tap slots to toggle
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() =>
                  setTimeSlotsState(timeSlotsState.map((slot) => ({ ...slot, selected: true })))
                }
              >
                <Text style={styles.optionButtonText}>Select All Slots</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.slotsContainer}>
              {timeSlotsState.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotButton,
                    slot.selected && styles.slotButtonSelected,
                  ]}
                  onPress={() => toggleTimeSlot(slot.id)}
                >
                  <Text
                    style={[
                      styles.slotButtonText,
                      slot.selected && styles.slotButtonTextSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Navigation Buttons */}
            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Icon name="chevron-back" size={18} color="#E91E63" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextButtonText}>Next</Text>
                <Icon name="arrow-forward" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* STEP 3: VERIFICATION */}
        {currentStep === STEPS.VERIFICATION && (
          <View>
            <Text style={styles.sectionTitle}>Verification Documents</Text>
            <Text style={styles.sectionSubtitle}>
              Upload ID proof for verification
            </Text>

            {/* ID Proof Type Dropdown */}
            <Text style={styles.label}>ID Proof Type *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() =>
                Alert.alert('Select ID Type', '', [
                  ...ID_TYPES.map((type) => ({
                    text: type,
                    onPress: () => {
                        // Map Passport/Driving License to 'DL' for schema simplicity if needed
                        let schemaType = type;
                        if (type === 'Driving License' || type === 'Passport') {
                            schemaType = 'DL';
                        } else if (type === 'Aadhar') {
                            schemaType = 'Aadhaar'; // Ensure capitalization matches Mongoose enum
                        } else if (type === 'PAN') {
                            schemaType = 'PAN';
                        }
                        setIdType(schemaType);
                    },
                  })),
                  { text: 'Cancel', style: 'cancel' },
                ])
              }
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !idType && styles.dropdownPlaceholder,
                ]}
              >
                {idType || 'Select ID proof type'}
              </Text>
              <Icon name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>

            {/* ID Number */}
            <Text style={styles.label}>ID Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ID number"
              value={idNumber}
              onChangeText={setIdNumber}
              placeholderTextColor="#999"
            />

            {/* Upload ID Proof */}
            <Text style={styles.label}>Upload ID Proof *</Text>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleUploadIDProof}
            >
              <Icon name="cloud-upload" size={40} color="#E91E63" />
              {idProof ? (
                <>
                  <Text style={styles.uploadedText}>✓ ID Proof Selected</Text>
                  <Text style={styles.uploadSubtext}>Ready for upload</Text>
                </>
              ) : (
                <>
                  <Text style={styles.uploadText}>Click to upload ID proof</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG up to 5MB</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={isSubmitting}>
                <Icon name="chevron-back" size={18} color="#E91E63" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Submit Registration</Text>
                    <Icon name="checkmark-circle" size={18} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  stepIndicatorContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    width: 80,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  photoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0', // Lighter color for placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 120, // Adjusted to be on the circle border
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff', // Changed to white for better contrast
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderButtonSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  genderButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    marginVertical: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E91E63',
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  dayButton: {
    width: '23%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dayButtonSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  infoSubtitle: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  slotButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  slotButtonSelected: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  slotButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  slotButtonTextSelected: {
    color: '#fff',
  },
  navButtons: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E91E63',
    gap: 4,
  },
  backButtonText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '700',
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E91E63',
    borderStyle: 'dashed',
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  uploadedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#E91E63',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { uploadImageToCloudinary } from '../../api/claudinary';

// const STEPS = {
//   PERSONAL: 1,
//   AVAILABILITY: 2,
//   VERIFICATION: 3,
// };

// const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// const TIME_SLOTS = [
//   { id: 'morning', label: 'Full Morning', selected: false },
//   { id: 'afternoon', label: 'Full Afternoon', selected: false },
//   { id: 'evening', label: 'Full Evening', selected: false },
// ];

// const ID_TYPES = ['Aadhar', 'PAN', 'Driving License', 'Passport'];

// export default function IndependentRegistrationScreen({ navigation }) {
//   const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);
//   const [loading, setLoading] = useState(false);

//   // Step 1: Personal Info
//   const [profilePhoto, setProfilePhoto] = useState(null);
//   const [fullName, setFullName] = useState('');
//   const [gender, setGender] = useState('');
//   const [contact, setContact] = useState('');
//   const [experience, setExperience] = useState('');

//   // Step 2: Availability
//   const [selectedDays, setSelectedDays] = useState([]);
//   const [timeSlots, setTimeSlots] = useState(TIME_SLOTS);

//   // Step 3: Verification
//   const [idType, setIdType] = useState('');
//   const [idNumber, setIdNumber] = useState('');
//   const [idProof, setIdProof] = useState(null);

//   // Upload photo
//   const handleUploadPhoto = () => {
//     Alert.alert('Upload Photo', 'Camera/Gallery functionality - Mock', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Select',
//         onPress: () => setProfilePhoto('https://via.placeholder.com/100?text=Photo'),
//       },
//     ]);
//   };

//   // Toggle day
//   const toggleDay = (day) => {
//     if (selectedDays.includes(day)) {
//       setSelectedDays(selectedDays.filter((d) => d !== day));
//     } else {
//       setSelectedDays([...selectedDays, day]);
//     }
//   };

//   // Select All Days
//   const selectAllDays = () => {
//     setSelectedDays(DAYS);
//   };

//   // Weekdays Only
//   const weekdaysOnly = () => {
//     setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
//   };

//   // Toggle time slot
//   const toggleTimeSlot = (slotId) => {
//     setTimeSlots(
//       timeSlots.map((slot) =>
//         slot.id === slotId ? { ...slot, selected: !slot.selected } : slot
//       )
//     );
//   };

//   // Upload ID Proof
//   const handleUploadIDProof = () => {
//     Alert.alert('Upload ID Proof', 'File upload - Mock', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Select',
//         onPress: () => setIdProof('ID_Proof_Document'),
//       },
//     ]);
//   };

//   const handleNext = () => {
//     if (currentStep === STEPS.PERSONAL) {
//       setCurrentStep(STEPS.AVAILABILITY);
//     } else if (currentStep === STEPS.AVAILABILITY) {
//       setCurrentStep(STEPS.VERIFICATION);
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > STEPS.PERSONAL) {
//       setCurrentStep(currentStep - 1);
//     } else {
//       navigation?.goBack();
//     }
//   };

//   const handleSubmit = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       Alert.alert('Success', 'Registration submitted! Awaiting verification', [
//         {
//           text: 'OK',
//           onPress: () => navigation?.navigate('Auth'),
//         },
//       ]);
//     }, 2000);
//   };

//   const getStepStatus = (step) => {
//     if (step < currentStep) return 'completed';
//     if (step === currentStep) return 'active';
//     return 'inactive';
//   };

//   const renderStepIndicator = (step, label) => {
//     const status = getStepStatus(step);
//     let bgColor = '#f0f0f0';
//     let iconColor = '#999';

//     if (status === 'completed') {
//       bgColor = '#4CAF50';
//       iconColor = '#fff';
//     } else if (status === 'active') {
//       bgColor = '#E91E63';
//       iconColor = '#fff';
//     }

//     return (
//       <View key={step} style={styles.stepIndicatorContainer}>
//         <View style={[styles.stepCircle, { backgroundColor: bgColor }]}>
//           {status === 'completed' ? (
//             <Icon name="checkmark" size={18} color={iconColor} />
//           ) : (
//             <Text style={[styles.stepNumber, { color: iconColor }]}>{step}</Text>
//           )}
//         </View>
//         <Text style={styles.stepLabel}>{label}</Text>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleBack}>
//           <Icon name="chevron-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Earn with Us</Text>
//         <Text style={styles.headerSubtitle}>
//           (Independent Beautician / Barber Registration)
//         </Text>
//       </View>

//       {/* Step Indicators */}
//       <View style={styles.stepIndicators}>
//         {renderStepIndicator(1, 'Personal Info')}
//         {renderStepIndicator(2, 'Availability')}
//         {renderStepIndicator(3, 'Verification')}
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* STEP 1: PERSONAL INFORMATION */}
//         {currentStep === STEPS.PERSONAL && (
//           <View>
//             <Text style={styles.sectionTitle}>Personal Information</Text>
//             <Text style={styles.sectionSubtitle}>Tell us about yourself</Text>

//             {/* Profile Photo */}
//             <View style={styles.photoContainer}>
//               {profilePhoto ? (
//                 <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
//               ) : (
//                 <View style={styles.photoPlaceholder}>
//                   <Icon name="person" size={40} color="#E91E63" />
//                 </View>
//               )}
//               <TouchableOpacity
//                 style={styles.cameraBadge}
//                 onPress={handleUploadPhoto}
//               >
//                 <Icon name="camera" size={16} color="#fff" />
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.photoLabel}>Upload your profile photo *</Text>

//             {/* Full Name */}
//             <Text style={styles.label}>Full Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter your full name"
//               value={fullName}
//               onChangeText={setFullName}
//               placeholderTextColor="#999"
//             />

//             {/* Gender */}
//             <Text style={styles.label}>Gender *</Text>
//             <View style={styles.genderContainer}>
//               {['Male', 'Female', 'Other'].map((option) => (
//                 <TouchableOpacity
//                   key={option}
//                   style={[
//                     styles.genderButton,
//                     gender === option && styles.genderButtonSelected,
//                   ]}
//                   onPress={() => setGender(option)}
//                 >
//                   <Text
//                     style={[
//                       styles.genderButtonText,
//                       gender === option && styles.genderButtonTextSelected,
//                     ]}
//                   >
//                     {option}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* Contact Number */}
//             <Text style={styles.label}>Contact Number *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter WhatsApp number"
//               value={contact}
//               onChangeText={setContact}
//               keyboardType="phone-pad"
//               placeholderTextColor="#999"
//             />

//             {/* Professional Experience */}
//             <Text style={styles.label}>Professional Experience *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="E.g., 5 years"
//               value={experience}
//               onChangeText={setExperience}
//               keyboardType="default"
//               placeholderTextColor="#999"
//             />

//             {/* Next Button */}
//             <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//               <Text style={styles.nextButtonText}>Next</Text>
//               <Icon name="arrow-forward" size={18} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* STEP 2: AVAILABILITY */}
//         {currentStep === STEPS.AVAILABILITY && (
//           <View>
//             <Text style={styles.sectionTitle}>Available Days *</Text>
//             <Text style={styles.sectionSubtitle}>
//               Select the days you're available for bookings
//             </Text>

//             {/* Select All / Weekdays Buttons */}
//             <View style={styles.buttonGroup}>
//               <TouchableOpacity
//                 style={styles.optionButton}
//                 onPress={selectAllDays}
//               >
//                 <Text style={styles.optionButtonText}>Select All Days</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.optionButton}
//                 onPress={weekdaysOnly}
//               >
//                 <Text style={styles.optionButtonText}>Weekdays Only</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Day Toggles */}
//             <View style={styles.daysContainer}>
//               {DAYS.map((day) => (
//                 <TouchableOpacity
//                   key={day}
//                   style={[
//                     styles.dayButton,
//                     selectedDays.includes(day) && styles.dayButtonSelected,
//                   ]}
//                   onPress={() => toggleDay(day)}
//                 >
//                   <Text
//                     style={[
//                       styles.dayButtonText,
//                       selectedDays.includes(day) && styles.dayButtonTextSelected,
//                     ]}
//                   >
//                     {day}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* Days Selected Info */}
//             <View style={styles.infoBox}>
//               <Icon name="calendar" size={24} color="#E91E63" />
//               <View style={styles.infoTextContainer}>
//                 <Text style={styles.infoTitle}>
//                   {selectedDays.length} days selected
//                 </Text>
//                 <Text style={styles.infoSubtitle}>
//                   {selectedDays.length === 0 ? 'Select at least one day' : selectedDays.join(', ')}
//                 </Text>
//               </View>
//             </View>

//             {/* Available Time Slots */}
//             <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
//               Available Time Slots *
//             </Text>
//             <Text style={styles.sectionSubtitle}>
//               Choose your working hours - tap slots to toggle
//             </Text>

//             <View style={styles.buttonGroup}>
//               <TouchableOpacity
//                 style={styles.optionButton}
//                 onPress={() =>
//                   setTimeSlots(timeSlots.map((slot) => ({ ...slot, selected: true })))
//                 }
//               >
//                 <Text style={styles.optionButtonText}>Select All Slots</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.slotsContainer}>
//               {timeSlots.map((slot) => (
//                 <TouchableOpacity
//                   key={slot.id}
//                   style={[
//                     styles.slotButton,
//                     slot.selected && styles.slotButtonSelected,
//                   ]}
//                   onPress={() => toggleTimeSlot(slot.id)}
//                 >
//                   <Text
//                     style={[
//                       styles.slotButtonText,
//                       slot.selected && styles.slotButtonTextSelected,
//                     ]}
//                   >
//                     {slot.label}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             {/* Navigation Buttons */}
//             <View style={styles.navButtons}>
//               <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//                 <Icon name="chevron-back" size={18} color="#E91E63" />
//                 <Text style={styles.backButtonText}>Back</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
//                 <Text style={styles.nextButtonText}>Next</Text>
//                 <Icon name="arrow-forward" size={18} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* STEP 3: VERIFICATION */}
//         {currentStep === STEPS.VERIFICATION && (
//           <View>
//             <Text style={styles.sectionTitle}>Verification Documents</Text>
//             <Text style={styles.sectionSubtitle}>
//               Upload ID proof for verification
//             </Text>

//             {/* ID Proof Type Dropdown */}
//             <Text style={styles.label}>ID Proof Type *</Text>
//             <TouchableOpacity
//               style={styles.dropdownButton}
//               onPress={() =>
//                 Alert.alert('Select ID Type', '', [
//                   ...ID_TYPES.map((type) => ({
//                     text: type,
//                     onPress: () => setIdType(type),
//                   })),
//                   { text: 'Cancel', style: 'cancel' },
//                 ])
//               }
//             >
//               <Text
//                 style={[
//                   styles.dropdownButtonText,
//                   !idType && styles.dropdownPlaceholder,
//                 ]}
//               >
//                 {idType || 'Select ID proof type'}
//               </Text>
//               <Icon name="chevron-down" size={18} color="#999" />
//             </TouchableOpacity>

//             {/* ID Number */}
//             <Text style={styles.label}>ID Number *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter ID number"
//               value={idNumber}
//               onChangeText={setIdNumber}
//               placeholderTextColor="#999"
//             />

//             {/* Upload ID Proof */}
//             <Text style={styles.label}>Upload ID Proof *</Text>
//             <TouchableOpacity
//               style={styles.uploadBox}
//               onPress={handleUploadIDProof}
//             >
//               <Icon name="cloud-upload" size={40} color="#E91E63" />
//               {idProof ? (
//                 <>
//                   <Text style={styles.uploadedText}>✓ {idProof}</Text>
//                   <Text style={styles.uploadSubtext}>PNG, JPG up to 5MB</Text>
//                 </>
//               ) : (
//                 <>
//                   <Text style={styles.uploadText}>Click to upload ID proof</Text>
//                   <Text style={styles.uploadSubtext}>PNG, JPG up to 5MB</Text>
//                 </>
//               )}
//             </TouchableOpacity>

//             {/* Navigation Buttons */}
//             <View style={styles.navButtons}>
//               <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//                 <Icon name="chevron-back" size={18} color="#E91E63" />
//                 <Text style={styles.backButtonText}>Back</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={handleSubmit}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <>
//                     <Text style={styles.submitButtonText}>Submit Registration</Text>
//                     <Icon name="checkmark-circle" size={18} color="#fff" />
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#E91E63',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#fff',
//     opacity: 0.9,
//     marginTop: 2,
//   },
//   stepIndicators: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 16,
//     backgroundColor: '#fff',
//   },
//   stepIndicatorContainer: {
//     alignItems: 'center',
//   },
//   stepCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   stepNumber: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   stepLabel: {
//     fontSize: 10,
//     color: '#666',
//     textAlign: 'center',
//     width: 80,
//   },
//   scrollContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 4,
//   },
//   sectionSubtitle: {
//     fontSize: 13,
//     color: '#999',
//     marginBottom: 16,
//   },
//   photoContainer: {
//     alignItems: 'center',
//     marginBottom: 16,
//     position: 'relative',
//   },
//   photoImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   photoPlaceholder: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#E91E63',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cameraBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#E91E63',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#fff',
//   },
//   photoLabel: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 6,
//     fontWeight: '600',
//   },
//   input: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 14,
//     marginBottom: 16,
//     color: '#333',
//   },
//   genderContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   genderButton: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   genderButtonSelected: {
//     backgroundColor: '#E91E63',
//     borderColor: '#E91E63',
//   },
//   genderButtonText: {
//     fontSize: 13,
//     color: '#666',
//     fontWeight: '600',
//   },
//   genderButtonTextSelected: {
//     color: '#fff',
//   },
//   nextButton: {
//     backgroundColor: '#E91E63',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 6,
//     marginVertical: 20,
//   },
//   nextButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   buttonGroup: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 16,
//   },
//   optionButton: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#E91E63',
//     alignItems: 'center',
//   },
//   optionButtonText: {
//     fontSize: 12,
//     color: '#E91E63',
//     fontWeight: '600',
//   },
//   daysContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 16,
//   },
//   dayButton: {
//     width: '23%',
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   dayButtonSelected: {
//     backgroundColor: '#E91E63',
//     borderColor: '#E91E63',
//   },
//   dayButtonText: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '600',
//   },
//   dayButtonTextSelected: {
//     color: '#fff',
//   },
//   infoBox: {
//     flexDirection: 'row',
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     padding: 12,
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   infoTextContainer: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#333',
//   },
//   infoSubtitle: {
//     fontSize: 11,
//     color: '#999',
//     marginTop: 2,
//   },
//   slotsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//     marginBottom: 16,
//   },
//   slotButton: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     backgroundColor: '#fff',
//   },
//   slotButtonSelected: {
//     backgroundColor: '#E91E63',
//     borderColor: '#E91E63',
//   },
//   slotButtonText: {
//     fontSize: 12,
//     color: '#666',
//     fontWeight: '600',
//   },
//   slotButtonTextSelected: {
//     color: '#fff',
//   },
//   navButtons: {
//     flexDirection: 'row',
//     gap: 8,
//     marginVertical: 20,
//   },
//   backButton: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#E91E63',
//     gap: 4,
//   },
//   backButtonText: {
//     color: '#E91E63',
//     fontSize: 14,
//     fontWeight: '700',
//   },
//   dropdownButton: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   dropdownButtonText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   dropdownPlaceholder: {
//     color: '#999',
//   },
//   uploadBox: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     borderWidth: 2,
//     borderColor: '#E91E63',
//     borderStyle: 'dashed',
//     paddingVertical: 30,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   uploadText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 8,
//   },
//   uploadedText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#4CAF50',
//     marginTop: 8,
//   },
//   uploadSubtext: {
//     fontSize: 11,
//     color: '#999',
//     marginTop: 4,
//   },
//   submitButton: {
//     flex: 1,
//     backgroundColor: '#E91E63',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderRadius: 8,
//     gap: 6,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '700',
//   },
// });