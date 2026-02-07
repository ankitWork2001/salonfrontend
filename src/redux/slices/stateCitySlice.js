import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { showSnackbar } from '../../redux/slices/snackbarSlice';

// Create State
export const createState = createAsyncThunk(
  "stateCity/createState",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/state-city/create-state", data);
      dispatch(showSnackbar({ message: res.data.message, type: 'success', duration: 3000 }));
      return res.data.state;
    } catch (err) {
        dispatch(showSnackbar({ message: err.response?.data?.message || "Failed to create state", type: 'error', duration: 3000 }));
      return rejectWithValue(err.response?.data?.message || "Failed to create state");
    }
  }
);

// Create City
export const createCity = createAsyncThunk(
  "stateCity/createCity",
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/state-city/create-city", data);
      dispatch(showSnackbar({ message: res.data.message, type: 'success', duration: 3000 }));

      return res.data.city;
    } catch (err) {
        dispatch(showSnackbar({ message: err.response?.data?.message || "Failed to create city", type: 'error', duration: 3000 }));
      return rejectWithValue(err.response?.data?.message || "Failed to create city");
    }
  }
);

// Get All States
export const fetchStates = createAsyncThunk(
  "stateCity/fetchStates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/state-city/get-all-states");
      return res.data.states;
    } catch (err) {

      return rejectWithValue(err.response?.data?.message || "Failed to fetch states");
    }
  }
);

// Get All Cities
export const fetchCities = createAsyncThunk(
  "stateCity/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/state-city/get-all-cities");
      return res.data.cities;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cities");
    }
  }
);

export const fetchCitiesByState = createAsyncThunk(
  "stateCity/fetchCitiesByState",
  async (stateId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/state-city/get-cities-by-state/${stateId}`);
      return res.data.cities;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cities by state");
    }
  }
);

/* =========================
   SLICE
========================= */

const stateCitySlice = createSlice({
  name: "stateCity",
  initialState: {
    states: [],
    cities: [],
    citiesByState: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearStateCityError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- CREATE STATE ---------- */
      .addCase(createState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createState.fulfilled, (state, action) => {
        state.loading = false;
        state.states.push(action.payload);
      })
      .addCase(createState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- CREATE CITY ---------- */
      .addCase(createCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.push(action.payload);
      })
      .addCase(createCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- FETCH STATES ---------- */
      .addCase(fetchStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.loading = false;
        state.states = action.payload;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- FETCH CITIES ---------- */
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* ---------- FETCH CITIES BY STATE ---------- */
      .addCase(fetchCitiesByState.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCitiesByState.fulfilled, (state, action) => {
        state.loading = false;
        state.citiesByState = action.payload;
      })
      .addCase(fetchCitiesByState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStateCityError } = stateCitySlice.actions;
export default stateCitySlice.reducer;
