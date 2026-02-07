import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStates,
  fetchCities,
  createState,
  createCity,
} from "../../redux/slices/stateCitySlice";

export default function ManageStateCityScreen() {
  const dispatch = useDispatch();
  const { states, cities } = useSelector((state) => state.stateCity);

  const [activeTab, setActiveTab] = useState("state");
  const [modalVisible, setModalVisible] = useState(false);

  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [pincode, setPincode] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchStates());
    dispatch(fetchCities());
  }, []);

  const handleCreate = () => {
    if (activeTab === "state") {
      dispatch(createState({ name: stateName }));
      setStateName("");
    } else {
      dispatch(
        createCity({
          name: cityName,
          state: selectedState,
          pincode,
        })
      );
      setCityName("");
      setSelectedState(null);
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "#156778" }}>
      <StatusBar backgroundColor="#156778" barStyle="light-content" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>State & City Management</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {["state", "city"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === "state" ? "States" : "Cities"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Add Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="add" size={18} color="#fff" />
            <Text style={styles.addButtonText}>
              Add {activeTab === "state" ? "State" : "City"}
            </Text>
          </TouchableOpacity>

          {/* List */}
          {(activeTab === "state" ? states : cities).map((item) => (
            <View key={item._id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.state?.name && (
                <Text style={styles.cardSub}>
                  {item.state.name}
                </Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {activeTab === "state" ? "State" : "City"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {activeTab === "state" ? (
                <>
                  <Text style={styles.label}>State Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter state name"
                    value={stateName}
                    onChangeText={setStateName}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.label}>City Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city name"
                    value={cityName}
                    onChangeText={setCityName}
                  />

                  <Text style={styles.label}>Pincode</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter pincode"
                    value={pincode}
                    onChangeText={setPincode}
                  />

                  <Text style={styles.label}>Select State</Text>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setStateDropdown(!stateDropdown)}
                  >
                    <Text style={styles.dropdownText}>
                      {states.find((s) => s._id === selectedState)?.name ||
                        "Choose State"}
                    </Text>
                    <Icon
                      name={stateDropdown ? "chevron-up" : "chevron-down"}
                      size={18}
                    />
                  </TouchableOpacity>

                  {stateDropdown && (
                    <View style={styles.dropdownMenu}>
                      {states.map((s) => (
                        <TouchableOpacity
                          key={s._id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedState(s._id);
                            setStateDropdown(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{s.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreate}
              >
                <Text style={styles.submitText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },

  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#7C5FED" },
  tabText: { fontSize: 13, color: "#999", fontWeight: "600" },
  activeTabText: { color: "#7C5FED" },

  content: { padding: 16, gap: 12 },

  addButton: {
    flexDirection: "row",
    backgroundColor: "#7C5FED",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#333" },
  cardSub: { fontSize: 11, color: "#999", marginTop: 4 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: { fontSize: 16, fontWeight: "700" },

  modalBody: { padding: 16 },

  label: { fontSize: 12, fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 14,
  },

  dropdown: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#eee",
  },
  dropdownText: { fontSize: 13 },

  dropdownMenu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 6,
  },
  dropdownItem: { padding: 12 },
  dropdownItemText: { fontSize: 13 },

  modalFooter: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  cancelText: { fontWeight: "600", color: "#666" },
  submitButton: {
    flex: 1,
    backgroundColor: "#7C5FED",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600" },
});
