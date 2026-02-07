import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { addToCart } from '../../../utils/cartStorage';
import { showSnackbar } from '../../../redux/slices/snackbarSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ServiceDetailsScreen({ route, navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [modeModalVisible, setModeModalVisible] = React.useState(false);
const [selectedMode, setSelectedMode] = React.useState(null);

  const { provider, service } = route?.params || {};
  const userId = user?._id || 'guest';

  if (!provider || !service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          Service not found
        </Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = async () => {
  if (service.serviceMode === 'both') {
    setModeModalVisible(true);
    return;
  }

  await addToCart(dispatch, userId, provider, {
    ...service,
    selectedMode: service.serviceMode, // salon or home
  });
};

const confirmModeSelection = async () => {
  if (!selectedMode) return;

  await addToCart(dispatch, userId, provider, {
    ...service,
    selectedMode,
  });

  setModeModalVisible(false);
  setSelectedMode(null);
};


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#156778" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Service Detail</Text>
          <TouchableOpacity>
            <Icon name="heart-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('../../../assets/featuredSalon.png')}
              style={styles.serviceImage}
            />
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.serviceName}>{service.name}</Text>

            <View style={styles.durationRow}>
              <Icon name="time-outline" size={18} color="#6B7280" />
              <Text style={styles.durationText}>
                {service.durationMins} mins
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹ {service.price}</Text>
              {service.discountPercent > 0 && (
                <View style={styles.discountBadge}>
                  <Icon name="pricetag" size={14} color="#F59E0B" />
                  <Text style={styles.discountText}>
                    {service.discountPercent}%
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.sectionTitle}>About Service</Text>
            <Text style={styles.aboutText}>{service.description}</Text>
          </View>
        </ScrollView>

        {/* Bottom */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>Add to Booking Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode Selection Modal */}
<View>
  {modeModalVisible && (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select Service Mode</Text>

        <TouchableOpacity
          style={[
            styles.modeOption,
            selectedMode === 'salon' && styles.modeActive,
          ]}
          onPress={() => setSelectedMode('salon')}
        >
          <Icon name="cut-outline" size={20} color="#156778" />
          <Text style={styles.modeText}>At Salon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeOption,
            selectedMode === 'home' && styles.modeActive,
          ]}
          onPress={() => setSelectedMode('home')}
        >
          <Icon name="home-outline" size={20} color="#156778" />
          <Text style={styles.modeText}>At Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedMode && { opacity: 0.5 },
          ]}
          disabled={!selectedMode}
          onPress={confirmModeSelection}
        >
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
</View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#156778',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#F59E0B',
    width: 24,
  },
  infoContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  serviceName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  addButton: {
    backgroundColor: '#156778',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalContainer: {
  width: '85%',
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 20,
},

modalTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 20,
  textAlign: 'center',
},

modeOption: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  marginBottom: 12,
},

modeActive: {
  backgroundColor: '#E6F2F4',
  borderColor: '#156778',
},

modeText: {
  fontSize: 16,
  marginLeft: 10,
  color: '#111827',
},

confirmButton: {
  backgroundColor: '#156778',
  paddingVertical: 14,
  borderRadius: 20,
  alignItems: 'center',
  marginTop: 10,
},

confirmText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},
});