// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import superAdminReducer from "./slices/superAdminSlice";
import salonAdminReducer from "./slices/salonAdminSlice";
import userReducer from "./slices/userSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import categoriesReducer from "./slices/categoriesSlice";
import snackbarReducer from './slices/snackbarSlice';
import salesExecutiveReducer from "./slices/salesExecutive";
import stateCityReducer from "./slices/stateCitySlice";
import salesmanReducer from "./slices/salesmanSlice";
import bookingReducer from "./slices/bookingSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    superAdmin: superAdminReducer,
    salonAdmin: salonAdminReducer,
    user: userReducer,
    subscription: subscriptionReducer,
    categories: categoriesReducer,
    snackbar: snackbarReducer,
    salesExecutive: salesExecutiveReducer,
    stateCity: stateCityReducer,
    salesman: salesmanReducer,
    booking: bookingReducer,
    cart: cartReducer,
  },
}); 