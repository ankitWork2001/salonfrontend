import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/* ===========================
   ASYNC THUNKS
=========================== */

// 🔹 Register Sales Executive
export const registerSalesExecutive = createAsyncThunk(
  "salesExecutive/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/sales-executives/register",
        payload
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// 🔹 Get All Sales Executives
export const fetchAllSalesExecutives = createAsyncThunk(
  "salesExecutive/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/sales-executives");
      return data.salesExecutives;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales executives"
      );
    }
  }
);

// 🔹 Get Sales Executives by City
export const fetchSalesExecutivesByCity = createAsyncThunk(
  "salesExecutive/fetchByCity",
  async (cityId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/sales-executives/city/${cityId}`
      );
      return data.salesExecutives;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch by city"
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "salesman/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/sales-executive/dashboard-stats");
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

const salesExecutiveSlice = createSlice({
  name: "salesExecutive",
  initialState: {
    loading: false,
    error: null,
    salesExecutives: [],
    selectedCityExecutives: [],
    success: false,

    summary: {
      totalSalesman: 0,
      totalSalons: 0,
      commissionRate: 0,
      totalEarnings: 0,
    },
    salesman: [],
  },
  reducers: {
    clearSalesExecutiveState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* -------- Register -------- */
      .addCase(registerSalesExecutive.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerSalesExecutive.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerSalesExecutive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- Get All -------- */
      .addCase(fetchAllSalesExecutives.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSalesExecutives.fulfilled, (state, action) => {
        state.loading = false;
        state.salesExecutives = action.payload;
      })
      .addCase(fetchAllSalesExecutives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* -------- Get By City -------- */
      .addCase(fetchSalesExecutivesByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesExecutivesByCity.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCityExecutives = action.payload;
      })
      .addCase(fetchSalesExecutivesByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ✅ Success
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.salesman = action.payload.salesman;
      })

      // ❌ Error
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSalesExecutiveState } =
  salesExecutiveSlice.actions;

export default salesExecutiveSlice.reducer;
