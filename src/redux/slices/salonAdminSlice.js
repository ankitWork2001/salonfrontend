import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { showSnackbar } from "./snackbarSlice";

// -------------------- SERVICE THUNKS --------------------

// 1️⃣ Fetch all services for the logged-in salon admin
export const fetchSalonServices = createAsyncThunk(
  "salonAdmin/fetchSalonServices",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/salon-admin/get-service-items");
      // console.log("Fetched services:", res.data.services);
      return res.data.services;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch services");
    }
  }
);

// 2️⃣ Create a new service item
export const createServiceItem = createAsyncThunk(
  "salonAdmin/createServiceItem",
  async (serviceData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/salon-admin/create-service-item", serviceData);
      return res.data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create service");
    }
  }
);

// 3️⃣ Update a service item
export const updateServiceItem = createAsyncThunk(
  "salonAdmin/updateServiceItem",
  async ({ serviceId, updateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/salon-admin/update-service-item/${serviceId}`, updateData);
      return res.data.service;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update service");
    }
  }
);

// 4️⃣ Delete a service item
export const deleteServiceItem = createAsyncThunk(
  "salonAdmin/deleteServiceItem",
  async (serviceId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/salon-admin/delete-service-item/${serviceId}`);
      return serviceId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete service");
    }
  }
);

// -------------------- SPECIALIST THUNKS --------------------

// 1️⃣ Fetch all specialists for the logged-in salon admin
export const fetchSalonSpecialists = createAsyncThunk(
  "salonAdmin/fetchSalonSpecialists",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/salon-admin/get-specialists");
      return res.data.specialists;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch specialists");
    }
  }
);

// 2️⃣ Add a new specialist
export const addSpecialist = createAsyncThunk(
  "salonAdmin/addSpecialist",
  async (specialistData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/salon-admin/add-specialist", specialistData);
      return res.data.specialist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add specialist");
    }
  }
);

// 3️⃣ Update a specialist
export const updateSpecialist = createAsyncThunk(
  "salonAdmin/updateSpecialist",
  async ({ specialistId, updateData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/salon-admin/update-specialist/${specialistId}`, updateData);
      return res.data.specialist;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update specialist");
    }
  }
);

// 4️⃣ Delete a specialist
export const deleteSpecialist = createAsyncThunk(
  "salonAdmin/deleteSpecialist",
  async (specialistId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/salon-admin/delete-specialist/${specialistId}`);
      return specialistId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete specialist");
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "salonAdmin/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-all-categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// -------------------- SLICE --------------------
const salonAdminSlice = createSlice({
  name: "salonAdmin",
  initialState: {
    services: [],
    specialists: [],
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSalonError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---------------- SERVICES ----------------
    builder
      .addCase(fetchSalonServices.pending, (state) => { state.loading = true; })
      .addCase(fetchSalonServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchSalonServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createServiceItem.fulfilled, (state, action) => { state.services.push(action.payload); })
      .addCase(createServiceItem.rejected, (state, action) => { state.error = action.payload; })
      .addCase(updateServiceItem.fulfilled, (state, action) => {
        const index = state.services.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.services[index] = action.payload;
      })
      .addCase(updateServiceItem.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteServiceItem.fulfilled, (state, action) => {
        state.services = state.services.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteServiceItem.rejected, (state, action) => { state.error = action.payload; })

    // ---------------- SPECIALISTS ----------------
      .addCase(fetchSalonSpecialists.pending, (state) => { state.loading = true; })
      .addCase(fetchSalonSpecialists.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload;
      })
      .addCase(fetchSalonSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addSpecialist.fulfilled, (state, action) => {
        state.specialists.push(action.payload);
      })
      .addCase(addSpecialist.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateSpecialist.fulfilled, (state, action) => {
        const index = state.specialists.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) state.specialists[index] = action.payload;
      })
      .addCase(updateSpecialist.rejected, (state, action) => { state.error = action.payload; })
      .addCase(deleteSpecialist.fulfilled, (state, action) => {
        state.specialists = state.specialists.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSpecialist.rejected, (state, action) => { state.error = action.payload; })

    // ---------------- CATEGORIES ----------------
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearSalonError } = salonAdminSlice.actions;
export default salonAdminSlice.reducer;
