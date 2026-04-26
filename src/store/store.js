import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import kycReducer from "../feature/kyc/kycSlice";
import customerReducer from "../feature/customers/customerSlice";
import manageCustomersReducer from "../feature/customers/manageCustomerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    kyc: kycReducer,
    customer: customerReducer,
    manageCustomers: manageCustomersReducer, // FIX: Assign the reducer here
  },
});
