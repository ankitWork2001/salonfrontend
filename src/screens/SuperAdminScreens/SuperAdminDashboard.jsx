import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const STATS = [
  {
    id: 1,
    title: 'Total Sales Persons',
    value: '24',
    growth: '+12%',
    icon: 'people',
    bgColor: '#7C5FED',
  },
  {
    id: 2,
    title: 'Total Salons Registered',
    value: '156',
    growth: '+23%',
    icon: 'storefront',
    bgColor: '#E91E63',
  },
  {
    id: 3,
    title: 'Total Subscriptions Sold',
    value: '342',
    growth: '+18%',
    icon: 'card',
    bgColor: '#2196F3',
  },
  {
    id: 4,
    title: 'Total Revenue Received',
    value: '₹8.4L',
    growth: '+31%',
    icon: 'cash',
    bgColor: '#4CAF50',
  },
];

const PERFORMANCE_METRICS = [
  {
    id: 1,
    label: 'User Engagement',
    value: 78,
    color: '#7C5FED',
  },
  {
    id: 2,
    label: 'Platform Uptime',
    value: 99.8,
    color: '#4CAF50',
  },
  {
    id: 3,
    label: 'Customer Satisfaction',
    value: 92,
    color: '#2196F3',
  },
  {
    id: 4,
    label: 'Conversion Rate',
    value: 65,
    color: '#FF9800',
  },
];

export default function SuperAdminDashboard() {
  const renderProgressBar = (value) => {
    return (
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${value}%` },
          ]}
        />
      </View>
    );
  };

  return (
   <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#156778' }}>
  <StatusBar backgroundColor="#156778" barStyle="light-content" />
  <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoIcon}>
            <Icon name="card" size={24} color="#7C5FED" />
          </View>
          <Text style={styles.headerTitle}>Super Admin Dashboard</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications" size={24} color="#333" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Icon name="person-circle" size={28} color="#7C5FED" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{stat.title}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <View style={styles.growthContainer}>
                  <Icon name="trending-up" size={14} color="#4CAF50" />
                  <Text style={styles.growthText}>{stat.growth}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: stat.bgColor },
                ]}
              >
                <Icon name={stat.icon} size={28} color="#fff" />
              </View>
            </View>
          ))}
        </View>

        {/* Performance Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsContainer}>
            {PERFORMANCE_METRICS.map((metric) => (
              <View key={metric.id} style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={[styles.metricValue, { color: metric.color }]}>
                    {metric.value}%
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressBarBg,
                    { backgroundColor: `${metric.color}20` },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${metric.value}%`, backgroundColor: metric.color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      </View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f44336',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statContent: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  metricsContainer: {
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
