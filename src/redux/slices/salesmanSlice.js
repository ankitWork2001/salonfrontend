import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ===========================
   ASYNC THUNKS
=========================== */

// 🔹 Register Sales Executive
export const registerSalesman = createAsyncThunk(
  "salesman/register",
  async (payload, { rejectWithValue }) => {
    console.log("Registering salesman with payload:", payload);
    try {
      const { data } = await axiosInstance.post(
        "/salesman/register-salesman",
        payload
      );
      console.log("Registration response data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// 🔹 Get All Sales Executives
export const fetchAllSalesman = createAsyncThunk(
  "salesman/fetchAll",
  async (_, { rejectWithValue }) => {
    console.log("Fetching all salesman...");
    try {
      const { data } = await axiosInstance.get("/salesman/get-all-salesman");
      return data.salesman;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales executives"
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "salesman/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/salesman/dashboard-stats");
      console.log("Dashboard stats data:", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard stats"
      );
    }
  }
);

/* ===========================
   SLICE
=========================== */

const salesmanSlice = createSlice({
  name: "salesman",
  initialState: {
    loading: false,
    error: null,
    salesman: [],
    success: false,

    summary: {
      totalSalons: 0,
      totalIndependentProfessionals: 0,
      commissionRate: 0,
      totalEarnings: 0,
    },

    recentSalons: [],
    monthlySalesGrowth: [],
  },
  reducers: {
    clearSalesmanState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* -------- Register -------- */
      .addCase(registerSalesman.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerSalesman.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerSalesman.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- Get All -------- */
      .addCase(fetchAllSalesman .pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSalesman .fulfilled, (state, action) => {
        state.loading = false;
        state.salesman = action.payload;
      })
      .addCase(fetchAllSalesman .rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       // 🔄 Loading
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Success
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;

        state.summary = action.payload.summary;
        state.recentSalons = action.payload.recentSalons;
        state.monthlySalesGrowth = action.payload.monthlySalesGrowth;
      })

      // ❌ Error
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSalesmanState } =
  salesmanSlice.actions;

export default salesmanSlice.reducer;