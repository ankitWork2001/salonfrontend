import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosInstance';

export const checkSubscription = async (navigation) => {
  try {
    const now = new Date();
    const localData = await AsyncStorage.getItem("subscription");
    console.log("Local Data:", localData);
    let subscription = localData ? JSON.parse(localData) : null;
    let isActive = false;

    // ✅ If we already have a plan stored
    if (subscription && subscription.endDate && subscription.paymentStatus === 'paid') {
      const endDate = new Date(subscription.endDate);
      const diffDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

      isActive = endDate > now;

      // ⚠️ Soft warning before expiry
      if (diffDays <= 3 && diffDays > 0) {
        Alert.alert(
          "Subscription Expiring Soon",
          `Your subscription will expire in ${diffDays} day(s). Please renew to continue using the app.`,
          [{ text: "OK" }]
        );
      }
    }

    // ✅ Case 1: No local plan found → fetch immediately
    if (!subscription) {
      console.log("📡 No local plan found. Checking backend...");
      const res = await axiosInstance.get(`/salon-admin/subscription-status`);
      const data = res.data;

      await AsyncStorage.setItem("subscription", JSON.stringify(data.subscription));

      if (!data.isSubscriptionActive) {
        console.log("🚫 No active subscription found. Redirecting...");
        navigation.getParent()?.replace("SubscriptionScreen");
      } else {
        console.log("✅ Subscription found on backend and active.");
      }
      return;
    }

    // ✅ Case 2: Local plan expired → verify with backend
    if (!isActive) {
      console.log("⚠️ Local subscription expired. Verifying with backend...");
      const res = await axiosInstance.get(`/salon-admin/subscription-status`);
      const data = res.data;

      await AsyncStorage.setItem("subscription", JSON.stringify(data.subscription));

      if (!data.isSubscriptionActive) {
        console.log("🚫 Expired subscription (backend confirmed). Redirecting...");
        // navigation.getParent()?.replace("SubscriptionScreen");
      } else {
        console.log("✅ Subscription renewed or active per backend.");
      }
      return;
    }

    // ✅ Case 3: Plan is active locally → no API call
    console.log("✅ Local subscription is active. No backend call needed.");
  } catch (err) {
    console.error("❗ Subscription check error:", err);
    console.log("Assuming inactive and staying safe.");
  }
};
