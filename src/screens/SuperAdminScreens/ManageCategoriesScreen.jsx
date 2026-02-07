import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  clearSuperAdminError,
} from '../../redux/slices/superAdminSlice';


export default function ManageCategoriesScreen() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.superAdmin);

  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    gender: 'women',
  });

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearSuperAdminError());
    }
  }, [error, dispatch]);

  // Filter categories based on tab and search
  const getFilteredCategories = () => {
    let filtered = categories;

    if (activeTab === 'active') filtered = filtered.filter((c) => c.active);
    else if (activeTab === 'inactive') filtered = filtered.filter((c) => !c.active);

    if (searchText) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const handleAddOrUpdateCategory = () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    if (!formData.icon) {
      Alert.alert('Error', 'Please enter an icon URL');
      return;
    }

    if (selectedCategory) {
      dispatch(updateCategory({ categoryId: selectedCategory._id, data: formData }));
    } else {
      dispatch(createCategory(formData));
    }

    setModalVisible(false);
    setSelectedCategory(null);
    setFormData({ name: '', icon: '', gender: 'women' });
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || '',
      gender: category.gender || 'women',
    });
    setModalVisible(true);
  };

  const filteredCategories = getFilteredCategories();

  // Stats
  const statsData = {
    total: categories.length,
    active: categories.filter((c) => c.active).length,
    inactive: categories.filter((c) => !c.active).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manage Categories</Text>
          <Text style={styles.headerSubtitle}>Salon service categories</Text>
        </View>
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => {
            setSelectedCategory(null);
            setFormData({ name: '', icon: '', gender: 'women' });
            setModalVisible(true);
          }}
        >
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.addCategoryButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <Text style={styles.statCardLabel}>Total Categories</Text>
              <Text style={styles.statCardValue}>{statsData.total}</Text>
            </View>
            <View style={[styles.statCardIcon, { backgroundColor: '#7C5FED20' }]}>
              <Icon name="pricetag" size={24} color="#7C5FED" />
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <Text style={styles.statCardLabel}>Active</Text>
              <Text style={styles.statCardValue}>{statsData.active}</Text>
            </View>
            <View style={[styles.statCardIcon, { backgroundColor: '#4CAF5020' }]}>
              <Icon name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statCardContent}>
              <Text style={styles.statCardLabel}>Inactive</Text>
              <Text style={styles.statCardValue}>{statsData.inactive}</Text>
            </View>
            <View style={[styles.statCardIcon, { backgroundColor: '#FF980020' }]}>
              <Icon name="alert-circle" size={24} color="#FF9800" />
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="close" size={20} color="#999" />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'inactive' && styles.activeTab]}
            onPress={() => setActiveTab('inactive')}
          >
            <Text style={[styles.tabText, activeTab === 'inactive' && styles.activeTabText]}>Inactive</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          {filteredCategories.length > 0 ? (
            <View style={styles.categoriesGrid}>
              {filteredCategories.map((category) => (
                <View key={category._id} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryIconContainer}>
                      {category.icon ? (
                        <Image
                          source={{ uri: category.icon }}
                          style={styles.categoryIconImage}
                          resizeMode="contain"
                        />
                      ) : (
                        <Icon name="image-outline" size={24} color="#999" />
                      )}
                    </View>
                    <View style={styles.categoryActions}>
                      <TouchableOpacity
                        onPress={() => handleEditCategory(category)}
                        style={styles.actionButton}
                      >
                        <Icon name="pencil" size={16} color="#7C5FED" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.categoryName}>{category.name}</Text>
                  
                  {category.gender && (
                    <Text style={styles.categoryGender}>
                      {category.gender.charAt(0).toUpperCase() + category.gender.slice(1)}
                    </Text>
                  )}

                  <View style={styles.categoryFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: category.active ? '#C8E6C9' : '#FFCCBC' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: category.active ? '#2E7D32' : '#E65100' },
                        ]}
                      >
                        {category.active ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icon name="search" size={48} color="#DDD" />
              <Text style={styles.emptyStateText}>No categories found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Category Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedCategory ? 'Edit Category' : 'Add New Category'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter category name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>Icon URL *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter icon URL (e.g., https://example.com/icon.png)"
                value={formData.icon}
                onChangeText={(text) => setFormData({ ...formData, icon: text })}
                placeholderTextColor="#999"
                autoCapitalize="none"
              />

              {/* Icon Preview */}
              {formData.icon ? (
                <View style={styles.iconPreviewContainer}>
                  <Text style={styles.inputLabel}>Icon Preview</Text>
                  <View style={styles.iconPreview}>
                    <Image
                      source={{ uri: formData.icon }}
                      style={styles.iconPreviewImage}
                      resizeMode="contain"
                    />
                  </View>
                </View>
              ) : null}

              <Text style={styles.inputLabel}>Gender *</Text>
              <View style={styles.genderToggle}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    styles.genderButtonLeft,
                    formData.gender === 'women' && styles.genderButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'women' })}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === 'women' && styles.genderButtonTextActive,
                    ]}
                  >
                    Women
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    styles.genderButtonRight,
                    formData.gender === 'men' && styles.genderButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, gender: 'men' })}
                >
                  <Text
                    style={[
                      styles.genderButtonText,
                      formData.gender === 'men' && styles.genderButtonTextActive,
                    ]}
                  >
                    Men
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddOrUpdateCategory}
              >
                <Icon name="checkmark" size={18} color="#fff" />
                <Text style={styles.submitButtonText}>
                  {selectedCategory ? 'Update' : 'Add'} Category
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  headerSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  addCategoryButton: { flexDirection: 'row', backgroundColor: '#2196F3', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center', gap: 4 },
  addCategoryButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 30 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard: { width: '48%', backgroundColor: '#fff', borderRadius: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  statCardContent: { flex: 1 },
  statCardLabel: { fontSize: 11, color: '#999', fontWeight: '500', marginBottom: 4 },
  statCardValue: { fontSize: 18, fontWeight: '700', color: '#333' },
  statCardIcon: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  searchSection: { marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, gap: 4, marginBottom: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  activeTab: { backgroundColor: '#2196F3' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#999' },
  activeTabText: { color: '#fff' },
  categoriesSection: { gap: 12 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 2, elevation: 1 },
  categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryIconContainer: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  categoryIconImage: { width: 32, height: 32 },
  categoryActions: { flexDirection: 'row', gap: 6 },
  actionButton: { width: 28, height: 28, borderRadius: 6, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  categoryName: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 4 },
  categoryGender: { fontSize: 11, color: '#666', marginBottom: 8, fontWeight: '500' },
  categoryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, flex: 1 },
  statusBadgeText: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 14, fontWeight: '600', color: '#999', marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 16, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  modalForm: { paddingHorizontal: 16, paddingVertical: 16 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: '#333', marginBottom: 16 },
  iconPreviewContainer: { marginBottom: 16 },
  iconPreview: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 16, alignItems: 'center', justifyContent: 'center' },
  iconPreviewImage: { width: 60, height: 60 },
  genderToggle: { flexDirection: 'row', backgroundColor: '#f5f5f5', borderRadius: 8, padding: 4, marginBottom: 16 },
  genderButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 6 },
  genderButtonLeft: { marginRight: 2 },
  genderButtonRight: { marginLeft: 2 },
  genderButtonActive: { backgroundColor: '#2196F3' },
  genderButtonText: { fontSize: 14, fontWeight: '600', color: '#666' },
  genderButtonTextActive: { color: '#fff' },
  modalFooter: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  cancelButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  cancelButtonText: { fontSize: 13, fontWeight: '600', color: '#666' },
  submitButton: { flex: 1, backgroundColor: '#2196F3', paddingVertical: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  submitButtonText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});
