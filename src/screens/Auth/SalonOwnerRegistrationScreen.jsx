import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// Assume uploadImageToCloudinary returns the publicly accessible URL
import { uploadImageToCloudinary } from '../../api/claudinary'; 
import { signupSalonOwner } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showSnackbar} from '../../redux/slices/snackbarSlice';
// Corrected to show both fetchStates and fetchCitiesByState are imported
import { fetchStates, fetchCitiesByState } from '../../redux/slices/stateCitySlice';


const STEPS = {
  CONTACT: 1,
  SHOP: 2,
  VERIFICATION: 3,
};

const ID_TYPES = ['Aadhar', 'PAN', 'GST Certificate', 'Business License'];
const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPnoneNo = /^[6-9]\d{9}$/;

export default function SalonOwnerRegistrationScreen({ navigation }) {
  const dispatch = useDispatch();
  // Destructure states and city-related properties from the Redux state
  const { states, citiesByState, isCitiesLoading } = useSelector((state) => state.stateCity); 

  // Redux State
  const { signUpLoading } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(STEPS.CONTACT);

  // 1. NEW LOCAL STATE FOR TOTAL SUBMISSION LOADING (includes image upload)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Contact Details
  const [ownershipType, setOwnershipType] = useState('personal');
  const [ownerName, setOwnerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [partners, setPartners] = useState([{ id: 1, name: '', contact: '', whatsapp: '' }]);
  const [salonCategory, setSalonCategory] = useState('');

  // Step 2: Shop Details
  const [galleryImages, setgalleryImages] = useState([null, null]); // Local URIs
  const [completeAddress, setCompleteAddress] = useState('');
  const [city, setCity] = useState('');
  // 'state' will hold the selected state's value (likely the code or ID)
  const [state, setState] = useState(''); 
  const [pincode, setPincode] = useState('');
  const [locationSet, setLocationSet] = useState(false);
  const [locationData, setLocationData] = useState({}); // Stores GeoJSON data
  const [currentLocation, setCurrentLocation] = useState({}); // Stores coordinates from AsyncStorage

  // Step 3: Verification
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idImageUrl, setIdImageUrl] = useState(null); // Local URI of ID proof

  // --- useEffect to load initial states ---
  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);
  
  // --- useEffect to fetch cities when state changes ---
  useEffect(() => {
    if (state) {
      // Assuming `state` holds the value required by the API to fetch cities
      dispatch(fetchCitiesByState(state)); 
    } else {
      setCity('');
    }
  }, [dispatch, state]);


  // --- useEffect to load initial location ---
  useEffect(() => {
    const loadLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem("userLocation");

        if (savedLocation) {
          const parsed = JSON.parse(savedLocation);
          console.log("🔥 User Location from AsyncStorage: ", parsed);
          // Assuming parsed is { latitude: ..., longitude: ... }
          setCurrentLocation(parsed); 
        } else {
          console.log("⚠️ No saved location found");
        }
      } catch (error) {
        console.log("❌ Error loading location:", error);
      }
    };

    loadLocation();
  }, []);

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
        setIdImageUrl(uri);
      } else {
        const newImages = [...galleryImages];
        newImages[index] = uri;
        setgalleryImages(newImages);
      }
    }
  };

  const handleUploadShopImage = (index) => {
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
  // ------------------------------------

  // --- Partner Management ---
  const addPartner = () => {
    if (partners.length < 2) {
      setPartners([
        ...partners,
        { id: partners.length + 1, name: '', contact: '', whatsapp: '' },
      ]);
    }
  };

  const updatePartner = (index, field, value) => {
    const newPartners = [...partners];
    newPartners[index][field] = value;
    setPartners(newPartners);
  };

  const removePartner = (index) => {
    if (partners.length > 1) {
      setPartners(partners.filter((_, i) => i !== index));
    }
  };
  // ------------------------------------

  // --- Location Handling ---
  const handleSetLocation = () => {
    if (!completeAddress || !city || !state || !pincode) {
      dispatch(showSnackbar({message: "Please fill complete address details before setting location.", type: "error"}));
      return;
    }
    if (!currentLocation.longitude || !currentLocation.latitude) {
      Alert.alert("Missing Location", "Could not get your location coordinates. Please ensure location services are enabled.");
      return;
    }

    // Get the full state name from the list for the final payload
    const selectedStateObject = states.find(s => s.code === state || s._id === state);
    const finalStateName = selectedStateObject ? selectedStateObject.name : state;

    // 2. Find the City Name (for GeoJSON payload, using the saved City ID)
    const selectedCityObject = citiesByState.find(c => c._id === city);
    const finalCityName = selectedCityObject ? selectedCityObject.name : 'Unknown City';

    setLocationData({
      type: "Point",
      coordinates: [currentLocation.longitude, currentLocation.latitude],
      address: completeAddress, 
      city: finalCityName,             
      state: finalStateName,           
      pincode: pincode,     
    });

    setLocationSet(true); 
    dispatch(showSnackbar({message: `Location pinned to coordinates: Lat ${currentLocation.latitude.toFixed(4)}, Lon ${currentLocation.longitude.toFixed(4)}`, type: "success"}));
  };

  const handleNext = () => {
    if (currentStep === STEPS.CONTACT) {
      // Basic validation for Step 1 before moving on
      if (!ownerName || !ownerEmail || !ownerPassword || !contactNumber || !shopName || !salonCategory) {
         dispatch(showSnackbar({message: "Please fill all required fields in Contact Details.", type: "error"}));
         return;
      }
      else if(!regexEmail.test(ownerEmail)){
        dispatch(showSnackbar({message: "Please Enter a Valid Email.", type: "error"}));
        return;
      }
      else if(!regexPnoneNo.test(contactNumber)){
        dispatch(showSnackbar({message: "Please Enter a Valid Contact Number.", type: "error"}));
         return;
      }
      if (ownershipType === 'partnership') {
        const hasIncompletePartner = partners.some(p => !p.name || !p.contact);
        if (hasIncompletePartner) {
            dispatch(showSnackbar({message: "Please fill in all partner name and contact details.", type: "error"}));
            return;
        }
      }
      setCurrentStep(STEPS.SHOP);
    } else if (currentStep === STEPS.SHOP) {
      // Basic validation for Step 2 before moving on
      if (galleryImages.filter(img => img !== null).length < 1) {
        return dispatch(showSnackbar({message: "Please upload at least 1 salon image.", type: "error"}));
      }
      if (!locationSet) {
        return dispatch(showSnackbar({message: "Please set your salon location.", type: "error"}));
      }
      if(!/^\d{6}$/.test(pincode)) {
        return dispatch(showSnackbar({message: "Please enter a valid 6-digit pincode.", type: "error"}));
      }
      // Ensure state and city are selected via Picker (not just set)
      if (!state || !city) {
         return dispatch(showSnackbar({message: "Please select a State and a City.", type: "error"}));
      }

      setCurrentStep(STEPS.VERIFICATION);
    }
  };

  const handleBack = () => {
    if (currentStep > STEPS.CONTACT) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation?.goBack();
    }
  };
  // ------------------------------------

  // --- FINAL SUBMISSION LOGIC (Revised) ---
  const handleSubmit = async () => {
    // Final Step 3 validation
    if (!idType || !idNumber || !idImageUrl) {
      return dispatch(showSnackbar({message: "Please complete ID verification.", type: "error"}));
    }

    // Validation from previous steps (just in case)
    if (!ownerName || !ownerEmail || !ownerPassword || !contactNumber || !shopName || !salonCategory || galleryImages.filter(img => img !== null).length < 1 || !locationSet) {
      return dispatch(showSnackbar({message: "Please complete all required steps and fields.", type: "error"}));
    }

    setIsSubmitting(true);

    try {
      // 1. UPLOAD IMAGES FIRST
      // Upload ID Image (Local URI -> Cloudinary URL)
      let finalIdImageUrl = null;
      if (idImageUrl) {
        dispatch(showSnackbar({message: "Uploading ID proof...", type: "info"}));
        finalIdImageUrl = await uploadImageToCloudinary(idImageUrl); 
      }

      // Upload Shop Images (Local URI -> Cloudinary URL)
      const uploadedShopImageUrls = [];
      const imagesToUpload = galleryImages.filter(img => img !== null);
      if(imagesToUpload.length > 0) {
        dispatch(showSnackbar({message: `Uploading ${imagesToUpload.length} salon images...`, type: "info"}));
      } 
      for (const image of imagesToUpload) {
        const uri = await uploadImageToCloudinary(image);
        uploadedShopImageUrls.push(uri);
      }
      
      // 2. PREPARE FINAL SALON DATA
      const salonData = {
        shopName,
        shopType: ownershipType,
        salonCategory,
        galleryImages: uploadedShopImageUrls, // <<< FINAL CLOUDINARY URLs
        location: locationData, 
        partners: ownershipType === 'partnership' ? partners.map(({ id, ...rest }) => rest) : [], // Remove local 'id' from partners
        contactNumber,
        whatsappNumber,
        governmentId: {
          idType: idType,
          idNumber: idNumber,
          idImageUrl: finalIdImageUrl, // <<< FINAL CLOUDINARY URL
        },
        city: city,
      };


      // 3. DISPATCH SIGNUP REDUX ACTION WITH COMPLETE DATA
      const resultAction = await dispatch(
        signupSalonOwner({
          name: ownerName,
          email: ownerEmail,
          phone: contactNumber,
          password: ownerPassword,
          salonData, // Includes all image URLs
        })
      );
      

      if (signupSalonOwner.fulfilled.match(resultAction)) {
        console.log('Final Salon Data Sent:', salonData);

        // Signup successful
        dispatch(showSnackbar({message: "Signup successful! Welcome aboard.", type: "success"}));
        navigation.goBack();
      } else {
        // Redux action failed
        throw new Error(resultAction.payload || 'Signup failed');
      }
    } catch (err) {
      dispatch(showSnackbar({message: err.message || "Something went wrong during submission or upload", type: "error"}));
    }
    finally {
        // Stop loading state for the entire submission process
        setIsSubmitting(false); 
    }
  };
  // ------------------------------------

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
      bgColor = '#7C5FED';
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

// Determine if the submit button should be disabled and show the spinner
  const isButtonDisabled = signUpLoading || isSubmitting;
  const showSpinner = signUpLoading || isSubmitting;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Earn with Us</Text>
          <Text style={styles.headerSubtitle}>(Partner Registration)</Text>
        </View>
      </View>

      {/* Step Indicators */}
      <View style={styles.stepIndicators}>
        {renderStepIndicator(1, 'Contact Details')}
        {renderStepIndicator(2, 'Shop Details')}
        {renderStepIndicator(3, 'Verification')}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* STEP 1: CONTACT DETAILS */}
        {currentStep === STEPS.CONTACT && (
          <View>
            <Text style={styles.sectionTitle}>Contact Details</Text>
            <Text style={styles.sectionSubtitle}>
              Tell us about your business ownership
            </Text>

            {/* Shop Ownership Type */}
            <Text style={styles.label}>Shop Ownership Type</Text>
            <View style={styles.ownershipContainer}>
              <TouchableOpacity
                style={[
                  styles.ownershipButton,
                  ownershipType === 'personal' && styles.ownershipButtonSelected,
                ]}
                onPress={() => setOwnershipType('personal')}
              >
                <Icon
                  name="person"
                  size={20}
                  color={ownershipType === 'personal' ? '#7C5FED' : '#999'}
                />
                <Text
                  style={[
                    styles.ownershipButtonText,
                    ownershipType === 'personal' && styles.ownershipButtonTextSelected,
                  ]}
                >
                  Personal
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ownershipButton,
                  ownershipType === 'partnership' && styles.ownershipButtonSelected,
                ]}
                onPress={() => setOwnershipType('partnership')}
              >
                <Icon
                  name="people"
                  size={20}
                  color={ownershipType === 'partnership' ? '#7C5FED' : '#999'}
                />
                <Text
                  style={[
                    styles.ownershipButtonText,
                    ownershipType === 'partnership' && styles.ownershipButtonTextSelected,
                  ]}
                >
                  Partnership
                </Text>
              </TouchableOpacity>
            </View>

            {/* Owner Details */}
            <Text style={[styles.label, { marginTop: 20 }]}>Owner Details</Text>

            <Text style={styles.fieldLabel}>Owner Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter owner's full name"
              value={ownerName}
              onChangeText={setOwnerName}
            />

            <Text style={styles.fieldLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={ownerEmail}
              onChangeText={setOwnerEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={ownerPassword}
              onChangeText={setOwnerPassword}
              secureTextEntry={true}
            />

            <Text style={styles.fieldLabel}>Contact Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact number"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>WhatsApp Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter WhatsApp number"
              value={whatsappNumber}
              onChangeText={setWhatsappNumber}
              keyboardType="phone-pad"
            />

            {/* Shop Information */}
            <Text style={[styles.label, { marginTop: 20 }]}>Shop Information</Text>

            <Text style={styles.fieldLabel}>Shop/Salon Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your shop name"
              value={shopName}
              onChangeText={setShopName}
            />

            {/* Salon Category */}
            <Text style={styles.fieldLabel}>Salon Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={salonCategory}
                onValueChange={(value) => setSalonCategory(value)}
                style={styles.picker}
                dropdownIconColor="#7C5FED"
                mode="dropdown"
              >
                <Picker.Item label="Select Category" value="" />
                <Picker.Item label="Men Salon" value="men" />
                <Picker.Item label="Women Salon" value="women" />
              </Picker>
            </View>

            {/* Partners Details (if Partnership) */}
            {ownershipType === 'partnership' && (
              <View style={{ marginTop: 20 }}>
                <Text style={styles.label}>Partners Details</Text>
                {partners.map((partner, index) => (
                  <View key={partner.id} style={styles.partnerCard}>
                    <Text style={styles.partnerTitle}>Partner {index + 1}</Text>

                    <Text style={styles.fieldLabel}>Partner Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter owner's full name"
                      value={partner.name}
                      onChangeText={(text) => updatePartner(index, 'name', text)}
                    />

                    <Text style={styles.fieldLabel}>Contact Number *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter contact number"
                      value={partner.contact}
                      onChangeText={(text) => updatePartner(index, 'contact', text)}
                      keyboardType="phone-pad"
                    />

                    <Text style={styles.fieldLabel}>WhatsApp Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter WhatsApp number"
                      value={partner.whatsapp}
                      onChangeText={(text) => updatePartner(index, 'whatsapp', text)}
                      keyboardType="phone-pad"
                    />

                    {partners.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removePartner(index)}
                      >
                        <Icon name="trash" size={16} color="#f44336" />
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {partners.length < 2 && (
                  <TouchableOpacity
                    style={styles.addPartnerButton}
                    onPress={addPartner}
                  >
                    <Icon name="add-circle" size={20} color="#7C5FED" />
                    <Text style={styles.addPartnerButtonText}>Add Partner</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Next Button */}
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Icon name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: SHOP DETAILS */}
        {currentStep === STEPS.SHOP && (
          <View>
            <Text style={styles.sectionTitle}>Shop Details</Text>
            <Text style={styles.sectionSubtitle}>Showcase your salon to customers</Text>

            {/* Shop Images */}
            <Text style={styles.label}>Shop Images *</Text>
            <Text style={styles.fieldLabel}>
              Upload 1-4 high-quality images of your salon
            </Text>

            <View style={styles.imagesGrid}>
              {galleryImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageBox}
                  onPress={() => handleUploadShopImage(index)}
                >
                  {image ? (
                    <Image source={{ uri: image }} style={styles.imageBoxImage} />
                  ) : (
                    <Icon name="image" size={40} color="#999" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Shop Location */}
            <Text style={[styles.label, { marginTop: 20 }]}>Shop Location *</Text>
            <Text style={styles.fieldLabel}>Help customers find you</Text>

            <Text style={styles.label}>Complete Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="House No, Area, Road"
              value={completeAddress} 
              onChangeText={setCompleteAddress}
            />

            <View style={styles.rowInputs}>
              <View style={styles.halfInput}>
                {/* State Picker */}
                <Text style={styles.label}>State *</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={state}
                    onValueChange={(itemValue) => {
                      setState(itemValue);
                      setCity(''); // Reset city when state changes
                    }}
                    style={styles.picker}
                    dropdownIconColor="#7C5FED"
                    mode="dropdown"
                  >
                    <Picker.Item label="Select State" value="" />
                    {states.map((s) => (
                      // Assuming the value to save is the State code or ID (_id) for API calls
                      <Picker.Item key={s._id} label={s.name} value={s.code || s._id} /> 
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={styles.halfInput}>
                {/* City Picker */}
                <Text style={styles.label}>City *</Text>
                <View style={styles.pickerContainer}>
                  {isCitiesLoading ? (
                    <View style={styles.loadingCities}>
                      <ActivityIndicator size="small" color="#7C5FED" />
                      <Text style={styles.loadingCitiesText}>Loading Cities...</Text>
                    </View>
                  ) : (
                    <Picker
                      selectedValue={city}
                      onValueChange={setCity}
                      style={styles.picker}
                      dropdownIconColor="#7C5FED"
                      mode="dropdown"
                      // Disable if no state is selected or no cities are available
                      enabled={!!state && citiesByState.length > 0} 
                    >
                      <Picker.Item label={!state ? "Select State First" : (citiesByState.length === 0 ? "No Cities Found" : "Select City")} value="" />
                      {citiesByState.map((c) => (
                        <Picker.Item key={c._id} label={c.name} value={c._id} /> 
                      ))}
                    </Picker>
                  )}
                </View>
              </View>
            </View>
            

            <Text style={styles.label}>Pincode *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Pincode (6 digits)"
              keyboardType="numeric"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />
            
            <Text style={styles.fieldLabel}>Pin Exact Location on Map (using current coordinates)</Text>
            <TouchableOpacity
              style={styles.mapBox}
              onPress={handleSetLocation}
            >
              {locationSet ? (
                <>
                  <Icon name="checkmark-circle" size={40} color="#4CAF50" />
                  <Text style={styles.mapBoxTextSuccess}>Location Set ✓</Text>
                  <Text style={styles.uploadSubtext}>{locationData.address}, {locationData.city}</Text>
                </>
              ) : (
                <>
                  <Icon name="location" size={40} color="#999" />
                  <Text style={styles.mapBoxText}>Click To Pin your exact location</Text>
                  <Text style={styles.uploadSubtext}>Ensure address is filled first</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Icon name="chevron-back" size={18} color="#7C5FED" />
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
            <Text style={styles.sectionSubtitle}>Upload your ID proof for verification</Text>

            {/* ID Proof Type */}
            <Text style={styles.label}>ID Proof Type *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() =>
                Alert.alert('Select ID Type', '', [
                  ...ID_TYPES.map((type) => ({
                    text: type,
                    onPress: () => setIdType(type),
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
            />

            {/* Upload ID Proof */}
            <Text style={styles.label}>Upload ID Proof *</Text>
            <TouchableOpacity
              style={[styles.uploadBox, idImageUrl && styles.uploadBoxActive]}
              onPress={handleUploadIDProof}
            >
              {idImageUrl ? (
                <View style={styles.idImageContainer}>
                  <Image source={{ uri: idImageUrl }} style={styles.idImagePreview} />
                  <Text style={styles.uploadedText}>✓ Image Selected</Text>
                  <Text style={styles.uploadSubtext}>Tap to change</Text>
                </View>
              ) : (
                <>
                  <Icon name="cloud-upload" size={40} color="#7C5FED" />
                  <Text style={styles.uploadText}>Click to upload ID proof</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG up to 5MB (Front/Back)</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Icon name="chevron-back" size={18} color="#7C5FED" />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isButtonDisabled} // Use combined loading state
              >
                {showSpinner ? ( // Use combined loading state
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

// STYLES (Updated to handle Picker styling and City loading state)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#7C5FED',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  },
  pickerContainer: {
    // Style applied to both State and Category Pickers
    backgroundColor: '#f0f0f0', // Match input background
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    // Add margin bottom only if not inside halfInput
    // Removed margin bottom from here and added to halfInput content
  },
  picker: {
    height: 50,
    color: '#333',
  },
  loadingCities: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  loadingCitiesText: {
    color: '#7C5FED',
    fontSize: 12,
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
    paddingBottom: 30,
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
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  ownershipContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  ownershipButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: '#fff',
    gap: 6,
  },
  ownershipButtonSelected: {
    borderColor: '#7C5FED',
    backgroundColor: '#f5f0ff',
  },
  ownershipButtonText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  ownershipButtonTextSelected: {
    color: '#7C5FED',
  },
  partnerCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  partnerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 12,
  },
  removeButtonText: {
    color: '#f44336',
    fontSize: 12,
    fontWeight: '600',
  },
  addPartnerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#7C5FED',
    borderRadius: 8,
    marginBottom: 16,
  },
  addPartnerButtonText: {
    color: '#7C5FED',
    fontSize: 13,
    fontWeight: '600',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  imageBox: {
    width: '47%', // Adjusted for gap
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imageBoxImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  mapBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 25,
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    borderWidth: 1, 
    borderColor: '#ddd'
  },
  mapBoxText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '600',
  },
  mapBoxTextSuccess: {
    fontSize: 13,
    color: '#4CAF50',
    fontWeight: '600',
  },
  dropdownButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    borderColor: '#7C5FED',
    borderStyle: 'dashed',
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  uploadBoxActive: {
    borderColor: '#4CAF50', // Change border color when image is set
    borderStyle: 'solid',
    paddingVertical: 15,
  },
  idImageContainer: {
    alignItems: 'center',
    width: '100%',
  },
  idImagePreview: {
    width: '90%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  uploadedText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
    paddingHorizontal: 16,
  },
  uploadSubtext: {
    fontSize: 11,
    color: '#999',
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#7C5FED',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    marginVertical: 20,
    flex: 1,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
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
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7C5FED',
    gap: 4,
  },
  backButtonText: {
    color: '#7C5FED',
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7C5FED',
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