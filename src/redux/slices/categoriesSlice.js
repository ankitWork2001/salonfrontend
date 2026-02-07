import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

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

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
    extraReducers: (builder) => {
    builder
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
        });
    }
});

export default categoriesSlice.reducer;