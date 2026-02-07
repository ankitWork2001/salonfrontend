import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { showSnackbar } from "./snackbarSlice";
import { clearCart } from "../../utils/cartStorage";

export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (payload, { dispatch, rejectWithValue }) => {
    console.log("Booking Payload in Thunk:", payload);
    try {
      const response = await axiosInstance.post("/booking/create-booking", payload);
      console.log("Booking Response:", response.data);
      dispatch(showSnackbar({ message: response?.data?.message, type: "success" }));
      return response.data;
    } catch (error) {
      dispatch(showSnackbar({ message: error.response?.data?.message || "Booking failed", type: "error" }));
      return rejectWithValue(error.response.data);
    }
    }
);

export const fetchUserBookings = createAsyncThunk(
  "booking/fetchUserBookings",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/booking/get-my-bookings");
      return response.data.bookings;
    } 
    catch (error) {
      return rejectWithValue(error.response.data);
    }
    });

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
    extraReducers: (builder) => {
    builder
        .addCase(createBooking.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings.push(action.payload.booking);
        })
        .addCase(createBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to create booking";
        })
        .addCase(fetchUserBookings.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUserBookings.fulfilled, (state, action) => {
            state.loading = false;
            state.bookings = action.payload;
        })
        .addCase(fetchUserBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || "Failed to fetch bookings";
        });
      
    }
});

export default bookingSlice.reducer;