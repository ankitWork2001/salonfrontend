import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchSubscriptionPlans = createAsyncThunk(
  "salonAdmin/fetchSubscriptionPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/salon-admin/get-subscription-plans");
      console.log("Fetched subscription plans:", response.data.plans);
      return response.data.plans;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching subscription plans");
    }
  }
);

export const subscribePlan = createAsyncThunk(
  "salonAdmin/subscribePlan",
  async (planId, { rejectWithValue }) => {
    console.log("Subscribing to plan with ID:", planId);
    try {
      const res = await axiosInstance.patch(`/salon-admin/subscribe-plan`, { planId });
      console.log("Subscription response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error subscribing to plan:", error.response?.data);
      return rejectWithValue(error.response?.data || "Error subscribing to plan");
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptionPlans: [],
    loading: false,
    error: null,
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchSubscriptionPlans.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
            state.loading = false;
            state.subscriptionPlans = action.payload;
        })
        .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;