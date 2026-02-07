import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSalonServices,
  fetchAllCategories,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from "../../redux/slices/salonAdminSlice";
import Loader from "../../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function IndependentManageServicesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { services = [], loading, error, categories = [] } = useSelector(
    (state) => state.salonAdmin
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [durationMins, setDurationMins] = useState("30");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [description, setDescription] = useState("");

  // Gender filter states
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
  const [modalGenderFilter, setModalGenderFilter] = useState("all");

  // Fetch services & categories on mount
  useEffect(() => {
    dispatch(fetchSalonServices());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // If categories load after modal opened for edit, keep selected category/gender in sync
  useEffect(() => {
    if (editingService) {
      // Normalize category id if editingService.category is object or string
      const catId =
        typeof editingService.category === "string"
          ? editingService.category
          : editingService.category?._id;

      // If we don't already have the category selected (maybe categories loaded later), set it
      if (catId && !category) {
        setCategory(catId);
      }

      // Determine modal gender: prefer explicit service.gender, else category.gender
      const serviceGender = editingService.gender;
      const catObj = categories.find((c) => c._id === catId);
      const derivedGender = serviceGender || catObj?.gender || "all";

      if (modalGenderFilter !== derivedGender) {
        setModalGenderFilter(derivedGender);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, editingService]);

  // Filter categories for modal based on modalGenderFilter
  const getModalFilteredCategories = () => {
    if (!categories) return [];
    if (modalGenderFilter === "all") {
      return categories;
    }
    return categories.filter(
      (cat) => cat.gender === modalGenderFilter || cat.gender === "unisex"
    );
  };

  // Helper that returns correct gender badge color
  const getGenderBadgeColor = (gender) => {
    switch (gender) {
      case "men":
        return "#2196F3";
      case "women":
        return "#E91E63";
      case "unisex":
        return "#9C27B0";
      default:
        return "#757575";
    }
  };

  // Open modal: handle both add and edit
  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);

      // Normalize category id: service.category can be string or object
      const catId =
        typeof service.category === "string"
          ? service.category
          : service.category?._id;

      setName(service.name || "");
      setCategory(catId || "");
      setPrice(service.price != null ? service.price.toString() : "");
      setDurationMins(
        service.durationMins != null ? service.durationMins.toString() : "30"
      );
      setDiscountPercent(
        service.discountPercent != null ? service.discountPercent.toString() : "0"
      );
      setDescription(service.description || "");

      // Determine modal gender: prefer explicit service.gender, else category.gender
      const serviceGender = service.gender;
      const catObj = categories.find((c) => c._id === catId);
      setModalGenderFilter(serviceGender || catObj?.gender || "all");
    } else {
      // Reset for Add
      setEditingService(null);
      setName("");
      setCategory("");
      setPrice("");
      setDurationMins("30");
      setDiscountPercent("0");
      setDescription("");
      setModalGenderFilter("all");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !category || !price) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const serviceData = {
      name,
      category,
      price: Number(price),
      durationMins: Number(durationMins),
      discountPercent: Number(discountPercent),
      description,
      providerType: "Salon",
    };

    try {
      if (editingService) {
        await dispatch(
          updateServiceItem({
            serviceId: editingService._id,
            updateData: serviceData,
          })
        ).unwrap();
      } else {
        await dispatch(createServiceItem(serviceData)).unwrap();
      }

      setModalVisible(false);
      setEditingService(null);
      // Refresh services (and categories if you need)
      dispatch(fetchSalonServices());
      dispatch(fetchAllCategories());
    } catch (err) {
      // err may be an Error object or string depending on your slice
      Alert.alert("Error", (err && err.message) || String(err));
    }
  };

  const handleDelete = (serviceId) => {
    Alert.alert("Delete Service", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteServiceItem(serviceId)).unwrap();
            // optionally refresh
            dispatch(fetchSalonServices());
          } catch (err) {
            Alert.alert("Error", (err && err.message) || String(err));
          }
        },
      },
    ]);
  };

  const toggleStatus = async (service) => {
    try {
      await dispatch(
        updateServiceItem({
          serviceId: service._id,
          updateData: {
            status: service.status === "active" ? "inactive" : "active",
          },
        })
      ).unwrap();
      dispatch(fetchSalonServices());
    } catch (err) {
      Alert.alert("Error", (err && err.message) || String(err));
    }
  };

  const renderServiceCard = (service, index) => (
    <View key={service._id || index} style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{service.name}</Text>
          <View style={styles.categoryRow}>
            {/*
              category may be string or object. Try to show icon if available.
            */}
            {typeof service.category === "object" && service.category?.icon && (
              <Icon
                name={service.category.icon}
                size={14}
                color="#156778"
                style={{ marginRight: 4 }}
              />
            )}
            {/* show category name if available, else empty */}
            <Text style={styles.categoryText}>
              {typeof service.category === "object"
                ? service.category?.name
                : // if category is id, try to find from categories list
                  categories.find((c) => c._id === service.category)?.name ||
                  ""}
            </Text>

            {/* gender badge: prefer service.gender (explicit) else category.gender */}
            {(
              service.gender ||
              (typeof service.category === "object" && service.category?.gender) ||
              categories.find((c) => c._id === service.category)?.gender
            ) && (
              <View
                style={[
                  styles.genderBadge,
                  {
                    backgroundColor: getGenderBadgeColor(
                      service.gender ||
                        (typeof service.category === "object" &&
                          service.category?.gender) ||
                        categories.find((c) => c._id === service.category)?.gender
                    ),
                    marginLeft: 8,
                  },
                ]}
              >
                <Text style={styles.genderBadgeText}>
                  {(service.gender ||
                    (typeof service.category === "object" &&
                      service.category?.gender) ||
                    categories.find((c) => c._id === service.category)?.gender ||
                    ""
                  ).toString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              { color: service.status === "active" ? "#4CAF50" : "#f44336" },
            ]}
          >
            {service.status === "active" ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.rowBetween}>
          <Text style={styles.priceText}>₹{service.price}</Text>
          <Text style={styles.durationText}>⏱ {service.durationMins} mins</Text>
        </View>
        {service.discountPercent > 0 && (
          <Text style={styles.discountText}>💸 {service.discountPercent}% off</Text>
        )}
      </View>

      {service.description && (
        <Text style={styles.desc}>{service.description}</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#156778" }]}
          onPress={() => openModal(service)}
        >
          <Icon name="create-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
          onPress={() => toggleStatus(service)}
        >
          <Icon name="swap-horizontal-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Toggle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#f44336" }]}
          onPress={() => handleDelete(service._id)}
        >
          <Icon name="trash-outline" size={16} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Filter services by gender
  const getFilteredServices = () => {
    if (selectedGenderFilter === "all") {
      return services;
    }
    return services.filter((service) => {
      const serviceGender =
        service.gender ||
        (typeof service.category === "object" && service.category?.gender) ||
        categories.find((c) => c._id === service.category)?.gender;
      return serviceGender === selectedGenderFilter || serviceGender === "unisex";
    });
  };

  const filteredServices = getFilteredServices();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.count}>{services.length} Total</Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActionsContainer}>
        {/* <TouchableOpacity
          style={[styles.quickActionBtn, { backgroundColor: '#156778' }]}
          onPress={() => navigation.navigate('ManageCategories')}
        >
          <Icon name="folder-outline" size={18} color="#fff" />
          <Text style={styles.quickActionText}>Categories</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[styles.quickActionBtn, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('ServiceAddOns')}
        >
          <Icon name="layers-outline" size={18} color="#fff" />
          <Text style={styles.quickActionText}>Add-ons</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[styles.quickActionBtn, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('ComboPackages')}
        >
          <Icon name="gift-outline" size={18} color="#fff" />
          <Text style={styles.quickActionText}>Combos</Text>
        </TouchableOpacity> */}
      </View>

      {/* Gender Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Gender:</Text>
        <View style={styles.genderFilterButtons}>
          {["all", "men", "women", "unisex"].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderFilterButton,
                selectedGenderFilter === gender && styles.genderFilterButtonActive,
              ]}
              onPress={() => setSelectedGenderFilter(gender)}
            >
              <Text
                style={[
                  styles.genderFilterText,
                  selectedGenderFilter === gender && styles.genderFilterTextActive,
                ]}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && <Loader />}
      {error && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>}

      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.addButton} onPress={() => openModal(null)}>
            <Icon name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>

          {filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="cut-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {selectedGenderFilter === "all"
                  ? "No services yet"
                  : `No ${selectedGenderFilter} services found`}
              </Text>
            </View>
          ) : (
            filteredServices.map(renderServiceCard)
          )}
        </ScrollView>
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editingService ? "Edit Service" : "Add Service"}
            </Text>

            <TextInput
              placeholder="Service Name *"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />


            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Select Category *</Text>
              <Picker
                selectedValue={category}
                onValueChange={(val) => setCategory(val)}
                style={styles.picker}
              >
                <Picker.Item label="-- Select Category --" value="" />
                {getModalFilteredCategories().map((cat) => (
                  <Picker.Item
                    key={cat._id}
                    label={`${cat.name} (${cat.gender})`}
                    value={cat._id}
                  />
                ))}
              </Picker>
            </View>

            {/* Show selected category gender info */}
            {category ? (
              <View style={styles.selectedCategoryInfo}>
                <Icon name="information-circle" size={16} color="#156778" />
                <Text style={styles.infoLabel}>Selected Category:</Text>
                <Text style={styles.infoCategoryName}>
                  {categories.find((c) => c._id === category)?.name || ""}
                </Text>
                <View
                  style={[
                    styles.genderBadge,
                    {
                      backgroundColor: getGenderBadgeColor(
                        categories.find((c) => c._id === category)?.gender || "all"
                      ),
                      marginLeft: 8,
                    },
                  ]}
                >
                  <Text style={styles.genderBadgeText}>
                    {categories.find((c) => c._id === category)?.gender || "all"}
                  </Text>
                </View>
              </View>
            ) : null}

            <TextInput
              placeholder="Price (₹) *"
              keyboardType="numeric"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
            />

            <TextInput
              placeholder="Duration (mins) *"
              keyboardType="numeric"
              style={styles.input}
              value={durationMins}
              onChangeText={setDurationMins}
            />

            <TextInput
              placeholder="Discount %"
              keyboardType="numeric"
              style={styles.input}
              value={discountPercent}
              onChangeText={setDiscountPercent}
            />

            <TextInput
              placeholder="Description"
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#156778" }]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>
                  {editingService ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#f44336" }]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingService(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#156778",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  count: { fontSize: 12, color: "#ddd", marginTop: 4 },
  quickActionsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  quickActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  genderFilterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  genderFilterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#156778",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  genderFilterButtonActive: {
    backgroundColor: "#156778",
  },
  genderFilterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#156778",
  },
  genderFilterTextActive: {
    color: "#fff",
  },
  scrollContent: { padding: 16 },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#156778",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#333" },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
    flexWrap: "wrap",
  },
  categoryText: { fontSize: 13, color: "#156778", fontWeight: "500" },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  genderBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statusContainer: { alignItems: "flex-end" },
  statusText: { fontSize: 13, fontWeight: "600" },
  section: { marginVertical: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  priceText: { fontSize: 15, fontWeight: "700", color: "#333" },
  durationText: { fontSize: 13, color: "#666" },
  discountText: { fontSize: 12, color: "#4CAF50", marginTop: 4 },
  desc: { fontSize: 12, color: "#555", marginVertical: 8, lineHeight: 18 },
  actions: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: { fontSize: 16, color: "#999", marginTop: 10, textAlign: "center" },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#156778",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  modalGenderSection: {
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedCategoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  infoCategoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#156778",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});