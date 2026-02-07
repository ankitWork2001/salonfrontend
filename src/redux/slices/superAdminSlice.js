import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ==================== ASYNC THUNKS ====================

// 🔹 SALOONS
// 🔹 Fetch All Saloons (Paginated)
export const fetchAllSaloons = createAsyncThunk(
  "superAdmin/fetchAllSaloons",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/super-admin/getAllSaloons?page=${page}&limit=${limit}`
      );
      console.log(res.data);
      return res.data; // contains saloons, page, totalPages, etc.
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching saloons");
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "superAdmin/fetchAllUsers",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/super-admin/get-all-users?page=${page}&limit=${limit}`
      );
      return res.data; // should include users, page, totalPages, count
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching users");
    }
  }
);

// 🔹 CATEGORIES
export const fetchAllCategories = createAsyncThunk(
  "superAdmin/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/super-admin/getAllCategories");
      return res.data.categories;
    } catch (error) {

      // 🔥 Always return a clean string message
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching categories";

      return rejectWithValue(message);  // return string only!
    }
  }
);

export const createCategory = createAsyncThunk(
  "superAdmin/createCategory",
  async (data, { rejectWithValue }) => {
    console.log("Creating category with data:", data);
    try {
      const res = await axiosInstance.post("/super-admin/create-category", data);
      return res.data.category;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching categories";

      return rejectWithValue(message);  // return string only!
    }
  }
);

export const updateCategory = createAsyncThunk(
  "superAdmin/updateCategory",
  async ({ categoryId, data }, { rejectWithValue }) => {
    try {
      console.log("Updating category with ID:", categoryId, "and data:", data);
      const res = await axiosInstance.patch(`/super-admin/update-category/${categoryId}`, data);
      return res.data.category;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error updating categories";

      return rejectWithValue(message);  // return string only!
    }
  }
);

// 🔹 OFFERS
export const fetchAllOffers = createAsyncThunk(
  "superAdmin/fetchAllOffers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/super-admin/get-all-offers");
      return res.data.offers;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching offers";
      return rejectWithValue(message);  // return string only!
    }
  }
);

export const createOffer = createAsyncThunk(
  "superAdmin/createOffer",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/super-admin/create-offer", data);
      return res.data.offer;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error creating offer");
    }
  }
);

export const updateOffer = createAsyncThunk(
  "superAdmin/updateOffer",
  async ({ offerId, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/super-admin/update-offer/${offerId}`, data);
      return res.data.offer;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating offer");
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "superAdmin/deleteOffer",
  async (offerId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/super-admin/delete-offer/${offerId}`);
      return offerId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting offer");
    }
  }
);

// ==================== SLICE ====================
const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    saloons: [],
    users: [],
    categories: [],
    offers: [],
    saloonsPage: 1,
    saloonsTotalPages: 1,
    usersPage: 1,
    usersTotalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearSuperAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SALOONS
      .addCase(fetchAllSaloons.pending, (state) => {
        state.loading = true;
      })
       .addCase(fetchAllSaloons.fulfilled, (state, action) => {
        state.loading = false;
        state.saloonsPage = action.payload.page;
        state.saloonsTotalPages = action.payload.totalPages;

        if (action.meta.arg.page === 1) {
          state.saloons = action.payload.saloons; // first page
        } else {
          state.saloons = [...state.saloons, ...action.payload.saloons]; // append next pages
        }
      })
      .addCase(fetchAllSaloons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // USERS
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
       .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersPage = action.payload.page;
        state.usersTotalPages = action.payload.totalPages;

        if (action.meta.arg.page === 1) {
          state.users = action.payload.users;
        } else {
          state.users = [...state.users, ...action.payload.users];
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CATEGORIES
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // OFFERS
      .addCase(fetchAllOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchAllOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.push(action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.offers.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) state.offers[index] = action.payload;
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = state.offers.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuperAdminError } = superAdminSlice.actions;
export default superAdminSlice.reducer;
