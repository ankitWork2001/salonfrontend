import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = [
  {
    id: '1',
    name: 'Haircut',
    price: 50,
    icon: 'cut-outline',
  },
  {
    id: '2',
    name: 'Facial',
    price: 149,
    icon: 'happy-outline',
  },
  {
    id: '3',
    name: 'Waxing',
    price: 199,
    icon: 'brush-outline',
  },
  {
    id: '4',
    name: 'Massage',
    price: 249,
    icon: 'hand-left-outline',
  },
];

export default function ServicesMenuScreen({ navigation }) {
  const renderService = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.price}>₹ {item.price}</Text>
        <Text style={styles.visitCharge}>Home Visit Charge: ₹ 49</Text>
      </View>

      {/* Service Icon */}
      <Icon name={item.icon} size={32} color="#555" style={{ marginRight: 12 }} />

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Book at Home</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* --- Header (same structure as your code) --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home Salon</Text>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-down-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Services List */}
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderService}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  /* --- Header same as your SalonList header --- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
  },

  /* Card style matching screenshot */
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderColor: 'black',
    borderWidth: 0.1,
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  serviceName: {
    fontSize: 20,
    fontWeight: '600',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  visitCharge: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
  },

  button: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
