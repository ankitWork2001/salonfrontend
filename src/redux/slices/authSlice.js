import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../api/axiosInstance';
import { showSnackbar } from '../../redux/slices/snackbarSlice';
import { hideCartPopup } from './cartSlice';

// -------------------- THUNKS --------------------
// 0️⃣ Signup user
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, phone, password }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });
      const { user, token} = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      return { user, token }; // assuming your backend returns { user, token, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// 1️⃣ Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { token, user, message } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      // Show success snackbar
      dispatch(
        showSnackbar({
          message: message || 'Login successful',
          type: 'success',
          duration: 3000,
        }),
      );
      return { user, token };
    } catch (error) {
      
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Registration failed. Please try again.';

      dispatch(
        showSnackbar({
          message: errorMessage,
          type: 'error',
          duration: 3000,
        }),
      );
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


// authThunks.js or inside same file

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    const { user } = getState().auth;

    //dispatch close cart also

    if (user?._id) {
      await AsyncStorage.removeItem(`@user_cart_${user._id}`);
    }

    // also clear guest cart just in case
    await AsyncStorage.removeItem('@user_cart_guest');

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    return true;
  }
);


// ✅ Auto-login when app restarts
export const loadUserFromStorage = createAsyncThunk(
  "auth/loadUserFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");
      if (token && userData) {
        return { token, user: JSON.parse(userData) };
      }
      return rejectWithValue("No user found");
    } catch (error) {
      return rejectWithValue("Failed to load user");
    }
  }
);

// 2️⃣ Forgot password (send OTP)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

// 3️⃣ Verify OTP
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid or expired OTP');
    }
  }
);

// 4️⃣ Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/auth/reset-password', { email, newPassword });
      return res.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);


// salon regsitration
// 0️⃣ Signup Salon Owner
export const signupSalonOwner = createAsyncThunk(
  "auth/signupSalonOwner",
  async ({ name, email, phone, password, salonData }, { rejectWithValue }) => {
    console.log("Salon Owner", { salonData });
    try {
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phone,
        password,
        role: "salon_owner",  // role is fixed
        salonData,
      });

      const { user, token } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Salon owner signup failed");
    }
  }
);


// sing up independent professional
export const signupIndependentProfessional = createAsyncThunk(
  "auth/signupIndependentProfessional",
  async ({ name, email, phone, password, independentData }, { rejectWithValue }) => {
    try {
      console.log("Independent", { name, email, phone, password, independentData });
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        phone,
        password,
        role: "independent_pro",
        independentData,
      });

      const { user, token } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));


      return { user, token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Independent professional signup failed");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/auth/edit-profile", profileData);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    signUpLoading: false,
    error: null,
    forgotPasswordMessage: null,
    otpVerified: false,
    resetPasswordMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    clearAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.forgotPasswordMessage = null;
      state.otpVerified = false;
      state.resetPasswordMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder

    // Signup
.addCase(signupUser.pending, (state) => {
  state.signUpLoading = true;
  state.error = null;
})
.addCase(signupUser.fulfilled, (state, action) => {
  state.signUpLoading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
})
.addCase(signupUser.rejected, (state, action) => {
  state.signUpLoading = false;
  state.error = action.payload;
})
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
  state.user = null;
  state.token = null;
})

       // load from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loadUserFromStorage.rejected, (state) => {
        state.loading = false;
      })

      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotPasswordMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Signup Salon Owner
      .addCase(signupSalonOwner.pending, (state) => {
  state.signUpLoading = true;
  state.error = null;
})
.addCase(signupSalonOwner.fulfilled, (state, action) => {
  state.signUpLoading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
})
.addCase(signupSalonOwner.rejected, (state, action) => {
  state.signUpLoading = false;
  state.error = action.payload;
})

      // Signup Independent Professional
      .addCase(signupIndependentProfessional.pending, (state) => {
  state.signUpLoading = true;
  state.error = null;
})
.addCase(signupIndependentProfessional.fulfilled, (state, action) => {
  state.signUpLoading = false;
  state.user = action.payload.user;
  state.token = action.payload.token;
})
.addCase(signupIndependentProfessional.rejected, (state, action) => {
  state.signUpLoading = false;
  state.error = action.payload;
})

.addCase(updateUserProfile.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateUserProfile.fulfilled, (state, action) => {
  state.loading = false;
  state.user = action.payload;
})
.addCase(updateUserProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});
  },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
