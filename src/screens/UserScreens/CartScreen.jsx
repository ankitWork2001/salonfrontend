import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getCart,
  removeFromCart,
  removeServiceFromCart,
  clearCart,
} from '../../utils/cartStorage';
import { hideCartPopup, setCart, setCartScreenFocused } from '../../redux/slices/cartSlice';
import { createBooking } from '../../redux/slices/bookingSlice';

const CartItem = ({ item, onRemove, onRemoveService, navigation }) => {
  const grouped = item.services.reduce(
    (acc, s) => {
      if (s.selectedMode === 'home') acc.home.push(s);
      else acc.salon.push(s);
      return acc;
    },
    { salon: [], home: [] }
  );

  const salonTotal = grouped.salon.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const homeTotal = grouped.home.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
  const HOME_FEE = 149;

  return (
    <View style={styles.salonCard}>
      {/* Salon Header */}
      <View style={styles.salonHeader}>
        <View style={styles.salonTitleRow}>
          <MaterialCommunityIcons name="store" size={20} color="#E91E63" />
          <Text style={styles.salonName}>{item.providerName}</Text>
          <Icon name="chevron-forward" size={16} color="#999" />
        </View>
      </View>

      {/* At Salon Services */}
      {grouped.salon.length > 0 && (
        <View style={styles.serviceSection}>
          {grouped.salon.map((s, idx) => (
            <View key={s._id}>
              <View style={styles.serviceItem}>
                <View style={styles.serviceIcon}>
                  <MaterialCommunityIcons name="content-cut" size={20} color="#fff" />
                </View>
                <View style={styles.serviceDetails}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <View style={styles.serviceInfo}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Service Price:</Text>
                      <Text style={styles.priceValue}>₹{s.price}</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationLabel}>Location:</Text>
                      <Text style={styles.locationValue}>At Salon</Text>
                    </View>
                  </View>
                  
                  {/* Date/Time Display or Selection for Salon Mode */}
                  {item.selectedDateSalon && item.selectedTimeSalon ? (
                    <View style={styles.dateTimeRow}>
                      <MaterialCommunityIcons name="calendar-clock" size={14} color="#666" />
                      <Text style={styles.dateTimeText}>
                        {item.selectedDateSalon}, {item.selectedTimeSalon}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('SelectDateAndTime', {
                            providerId: item.providerId,
                            mode: 'salon',
                          })
                        }
                      >
                        <MaterialCommunityIcons name="reload" size={14} color="#E91E63" />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  
                  <View style={styles.totalPayRow}>
                    <Text style={styles.payLabel}>Pay at Salon:</Text>
                    <Text style={styles.payValue}>₹{s.price}</Text>
                  </View>
                  <Text style={styles.totalLabel}>Total to Pay</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemoveService(item.providerId, s._id, s.selectedMode)}
                >
                  <Icon name="close" size={18} color="#999" />
                </TouchableOpacity>
              </View>
              {idx < grouped.salon.length - 1 && <View style={styles.serviceDivider} />}
            </View>
          ))}
          
          {/* Select Date & Time Button for Salon Services */}
          {!item.selectedDateSalon && (
            <TouchableOpacity
              style={styles.selectDateBtn}
              onPress={() =>
                navigation.navigate('SelectDateAndTime', {
                  providerId: item.providerId,
                  mode: 'salon',
                })
              }
            >
              <MaterialCommunityIcons name="calendar-clock" size={18} color="#E91E63" />
              <Text style={styles.selectDateText}>Select Date & Time for Salon Services</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* At Home Services */}
      {grouped.home.length > 0 && (
        <View style={styles.serviceSection}>
          {grouped.home.map((s, idx) => (
            <View key={s._id}>
              <View style={styles.serviceItem}>
                <View style={[styles.serviceIcon, { backgroundColor: '#E91E63' }]}>
                  <MaterialCommunityIcons name="spa" size={20} color="#fff" />
                </View>
                <View style={styles.serviceDetails}>
                  <View style={styles.serviceNameRow}>
                    <Text style={styles.serviceName}>{s.name}</Text>
                    <Text style={styles.homeBadge}>(Home)</Text>
                  </View>
                  
                  {/* Date/Time Display or Selection for Home Mode */}
                  {item.selectedDateHome && item.selectedTimeHome ? (
                    <View style={styles.dateTimeRow}>
                      <MaterialCommunityIcons name="calendar-clock" size={14} color="#666" />
                      <Text style={styles.dateTimeText}>
                        {item.selectedDateHome}, {item.selectedTimeHome}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('SelectDateAndTime', {
                            providerId: item.providerId,
                            mode: 'home',
                          })
                        }
                      >
                        <MaterialCommunityIcons name="reload" size={14} color="#E91E63" />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  
                  <View style={styles.serviceInfo}>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Service Price:</Text>
                      <Text style={styles.priceValue}>₹{s.price}</Text>
                    </View>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Home Service Charge:</Text>
                      <Text style={styles.priceValue}>₹{HOME_FEE}</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationLabel}>Location:</Text>
                      <Text style={styles.locationValue}>At Home</Text>
                    </View>
                  </View>
                  <View style={styles.totalPayRow}>
                    <Text style={styles.payLabel}>Pay at Home:</Text>
                    <Text style={[styles.payValue, styles.homePayValue]}>
                      ₹{Number(s.price) + HOME_FEE}
                    </Text>
                    <Text style={styles.totalLabel}>Total to Pay</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => onRemoveService(item.providerId, s._id, s.selectedMode)}
                >
                  <Icon name="close" size={18} color="#999" />
                </TouchableOpacity>
              </View>
              {idx < grouped.home.length - 1 && <View style={styles.serviceDivider} />}
            </View>
          ))}
          
          {/* Select Date & Time Button for Home Services */}
          {!item.selectedDateHome && (
            <TouchableOpacity
              style={styles.selectDateBtn}
              onPress={() =>
                navigation.navigate('SelectDateAndTime', {
                  providerId: item.providerId,
                  mode: 'home',
                })
              }
            >
              <MaterialCommunityIcons name="calendar-clock" size={18} color="#E91E63" />
              <Text style={styles.selectDateText}>Select Date & Time for Home Services</Text>
            </TouchableOpacity>
          )}

          {/* Bottom Summary for Home Services */}
          <View style={styles.bottomSummary}>
            <Text style={styles.bottomSummaryText}>
              Pay at Home: ₹{homeTotal + HOME_FEE}
              <Text style={styles.bottomSummaryLabel}> (Total to Pay)</Text>
            </Text>
          </View>
        </View>
      )}

      {/* Salon Group Totals */}
      <View style={styles.salonTotals}>
        {salonTotal > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Pay at Salon:</Text>
            <Text style={styles.totalAmount}>₹{salonTotal}</Text>
          </View>
        )}
        {grouped.home.length > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Pay at Home:</Text>
            <Text style={styles.totalAmount}>₹{homeTotal + HOME_FEE}</Text>
            <Icon name="chevron-forward" size={16} color="#E91E63" />
          </View>
        )}
      </View>
    </View>
  );
};

export default function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const userId = user?._id || 'guest';

  const [localCart, setLocalCart] = useState([]);
  const { loading } = useSelector(state => state.booking);

  useFocusEffect(
    useCallback(() => {
      dispatch(setCartScreenFocused(true));
      dispatch(hideCartPopup());
      loadCart();

      return () => {
        dispatch(setCartScreenFocused(false));
      };
    }, [dispatch])
  );

  const loadCart = async () => {
    const data = await getCart(userId);
    setLocalCart(data);
    dispatch(setCart(data));
  };

  // Check if booking is disabled - need BOTH salon and home dates if both service types exist
  const isBookingDisabled = localCart.some(item => {
    const hasSalonServices = item.services.some(s => s.selectedMode === 'salon');
    const hasHomeServices = item.services.some(s => s.selectedMode === 'home');
    
    if (hasSalonServices && (!item.selectedDateSalon || !item.selectedTimeSalon)) {
      return true;
    }
    if (hasHomeServices && (!item.selectedDateHome || !item.selectedTimeHome)) {
      return true;
    }
    return false;
  });

  const handleRemove = async (providerId) => {
    const updated = await removeFromCart(userId, providerId);
    setLocalCart(updated);
    dispatch(setCart(updated));
  };

  const handleRemoveService = async (providerId, serviceId, selectedMode) => {
    const updated = await removeServiceFromCart(
      userId,
      providerId,
      serviceId,
      selectedMode
    );
    setLocalCart(updated);
    dispatch(setCart(updated));
  };

  const calculateTotals = () => {
    let salonTotal = 0;
    let homeTotal = 0;
    const HOME_FEE = 149;

    localCart.forEach(salonGroup => {
      salonGroup.services.forEach(s => {
        const price = Number(s.price) || 0;
        if (s.selectedMode === 'home') {
          homeTotal += price + HOME_FEE;
        } else {
          salonTotal += price;
        }
      });
    });

    return { salonTotal, homeTotal, grandTotal: salonTotal + homeTotal };
  };

  const totals = calculateTotals();

  const handleBooking = () => {
    // Create separate bookings for salon and home services
    const bookings = [];
    
    localCart.forEach(item => {
      const salonServices = item.services.filter(s => s.selectedMode === 'salon');
      const homeServices = item.services.filter(s => s.selectedMode === 'home');
      
      // Add salon booking if there are salon services
      if (salonServices.length > 0 && item.selectedDateSalon && item.selectedTimeSalon) {
        bookings.push({
          providerId: item.providerId,
          bookingDate: item.selectedDateSalon,
          timeSlot: { start: item.selectedTimeSalon, end: item.selectedTimeSalon },
          services: salonServices.map(s => ({
            serviceId: s._id,
            serviceMode: 'salon',
          })),
          bookingType: 'salon',
        });
      }
      
      // Add home booking if there are home services
      if (homeServices.length > 0 && item.selectedDateHome && item.selectedTimeHome) {
        bookings.push({
          providerId: item.providerId,
          bookingDate: item.selectedDateHome,
          timeSlot: { start: item.selectedTimeHome, end: item.selectedTimeHome },
          services: homeServices.map(s => ({
            serviceId: s._id,
            serviceMode: 'home',
          })),
          bookingType: 'home',
        });
      }
    });

    const payload = { bookings };

    console.log('Booking Payload:', payload); // Debug log

    dispatch(createBooking(payload))
      .unwrap()
      .then(async () => {
        await clearCart(userId);
        setLocalCart([]);
        dispatch(setCart([]));
        dispatch(hideCartPopup());
        navigation.navigate('HomeTab', { screen: 'Bookings' });
      });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E91E63" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#E91E63" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="store" size={28} color="#E91E63" />
          <Text style={styles.headerTitle}>Booking Summary</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {localCart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="cart-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <Text style={styles.emptySubtext}>Add some services to get started</Text>
            </View>
          ) : (
            localCart.map(item => (
              <CartItem
                key={item.providerId}
                item={item}
                onRemove={handleRemove}
                onRemoveService={handleRemoveService}
                navigation={navigation}
              />
            ))
          )}
        </ScrollView>

        {localCart.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                (loading || isBookingDisabled) && styles.confirmBtnDisabled,
              ]}
              onPress={handleBooking}
              disabled={loading || isBookingDisabled}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Booking</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F0F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E91E63',
    marginTop: 4,
  },
  backButton: {
    padding: 4,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  salonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  salonHeader: {
    backgroundColor: '#FAF5FB',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  salonTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  salonName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  serviceSection: {
    padding: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  serviceDetails: {
    flex: 1,
  },
  serviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  homeBadge: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  serviceInfo: {
    marginTop: 6,
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  priceLabel: {
    fontSize: 13,
    color: '#666',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  locationRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  locationLabel: {
    fontSize: 13,
    color: '#666',
  },
  locationValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginLeft: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0F5', // Light pink background
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    alignSelf: 'flex-start', // Keeps the badge from stretching full width
  },
  dateTimeText: {
    fontSize: 12, // Increased size
    fontWeight: '600', // Semi-bold for better readability
    color: '#C2185B', // Darker pink for contrast
  },
  reloadIcon: {
    marginLeft: 'auto',
    paddingLeft: 10,
  },
  totalPayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 8,
  },
  payLabel: {
    fontSize: 13,
    color: '#666',
  },
  payValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  homePayValue: {
    color: '#E91E63',
  },
  totalLabel: {
    fontSize: 11,
    color: '#999',
  },
  removeBtn: {
    padding: 4,
  },
  serviceDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  selectDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginTop: 12,
    backgroundColor: '#FAF5FB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E91E63',
    gap: 8,
  },
  selectDateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E91E63',
  },
  bottomSummary: {
    backgroundColor: '#FAF5FB',
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
  },
  bottomSummaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E91E63',
    textAlign: 'center',
  },
  bottomSummaryLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
  },
  salonTotals: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    padding: 16,
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    textAlign: 'right',
    marginRight: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
});
