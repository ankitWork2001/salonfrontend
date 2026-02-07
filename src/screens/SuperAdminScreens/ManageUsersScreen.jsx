import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers } from "../../redux/slices/superAdminSlice";

export default function ManageUsersScreen() {
  const dispatch = useDispatch();

  const { users, usersPage, usersTotalPages, loading } = useSelector(
    (state) => state.superAdmin
  );

  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  // Load first page
  useEffect(() => {
    dispatch(fetchAllUsers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const loadMore = () => {
    if (!loading && usersPage < usersTotalPages) {
      dispatch(fetchAllUsers({ page: usersPage + 1, limit: 10 }));
    }
  };

  const handleDeleteUser = (userId) => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => Alert.alert("Success", "User deleted successfully"),
      },
    ]);
  };

  // Filter + Search Logic
  const filteredUsers = users?.filter((u) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && u.status === "Active") ||
      (activeTab === "blocked" && u.status === "Blocked");

    const matchesSearch =
      searchText.trim() === "" ||
      u.name.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email.toLowerCase().includes(searchText.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const statsData = {
    total: users.length,
    active: users.filter((u) => u.status === "Active").length,
    blocked: users.filter((u) => u.status === "Blocked").length,
  };

  const renderUserItem = ({ item: user }) => (
    <View style={styles.userCard}>
      <View style={styles.userCardHeader}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>👤</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>

          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${user.email}`)}>
            <Text style={[styles.userEmail, { color: "#2196F3" }]}>{user.email}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => handleDeleteUser(user._id)}
          style={styles.actionButton}
        >
          <Icon name="trash" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>

      <View style={styles.userCardDetails}>
        <View style={styles.userDetail}>
          <Icon name="call" size={14} color="#999" />
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${user.phone}`)}>
            <Text style={[styles.userDetailText, { color: "#2196F3" }]}>
              {user.phone}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusBadgeContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: user.status === "Active" ? "#C8E6C9" : "#FFCCBC" },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: user.status === "Active" ? "#2E7D32" : "#E65100" },
              ]}
            >
              {user.status}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.joinDate}>
        Joined {new Date(user.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <Text style={styles.headerSubtitle}>Control customer accounts</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Total</Text>
          <Text style={styles.statCardValue}>{statsData.total}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Active</Text>
          <Text style={styles.statCardValue}>{statsData.active}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statCardLabel}>Blocked</Text>
          <Text style={styles.statCardValue}>{statsData.blocked}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText !== "" && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {["all", "active", "blocked"].map((tab) => (
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
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ padding: 12 }} /> : null
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Icon name="search" size={48} color="#DDD" />
              <Text style={styles.emptyStateText}>No users found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  headerSubtitle: { fontSize: 12, color: "#777" },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    width: "32%",
    alignItems: "center",
  },
  statCardLabel: { fontSize: 11, color: "#999" },
  statCardValue: { fontSize: 18, fontWeight: "700" },

  searchBar: {
    backgroundColor: "#fff",
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#333" },

  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginBottom: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#7C5FED" },
  tabText: { fontSize: 12, color: "#555" },
  activeTabText: { color: "#fff", fontWeight: "700" },

  userCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    margin: 10,
  },
  userCardHeader: { flexDirection: "row", alignItems: "center" },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8D4F8",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarText: { fontSize: 24 },
  userInfo: { flex: 1, marginLeft: 10 },
  userName: { fontSize: 14, fontWeight: "700" },
  userEmail: { fontSize: 11, marginTop: 2 },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  userCardDetails: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  userDetail: { flexDirection: "row", alignItems: "center" },
  userDetailText: { fontSize: 11, marginLeft: 4 },
  statusBadgeContainer: {},
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusBadgeText: { fontSize: 10, fontWeight: "700" },
  joinDate: { fontSize: 10, color: "#999", marginTop: 6 },
  emptyState: { alignItems: "center", padding: 30 },
  emptyStateText: { fontSize: 14, color: "#999" },
});
