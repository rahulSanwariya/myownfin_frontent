import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// 🔹 Fetch customers (Inquiry stage)
export const fetchKycLeads = createAsyncThunk(
  "kyc/fetchLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      return data.filter((l) => l.applicationStatus === "Inquiry");
    } catch (err) {
      return rejectWithValue("Failed to fetch customers");
    }
  },
);

// 🔹 PAN Verification
export const verifyPan = createAsyncThunk(
  "kyc/verifyPan",
  async ({ customerId, pan }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/kyc/verify-pan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ customerId, pan }),
      });

      if (!response.ok) throw new Error("PAN failed");
      return true;
    } catch {
      return rejectWithValue("PAN verification failed");
    }
  },
);

// 🔹 Aadhaar OTP Request
export const requestAadhaarOtp = createAsyncThunk(
  "kyc/requestOtp",
  async (aadhaarNumber, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/kyc/aadhaar-generate-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ aadhaarNumber }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error("OTP failed");

      return data.transactionId;
    } catch {
      return rejectWithValue("OTP request failed");
    }
  },
);

// 🔹 Aadhaar OTP Verify
export const verifyAadhaarOtp = createAsyncThunk(
  "kyc/verifyOtp",
  async ({ otp, transactionId, customerId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/kyc/aadhaar-verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ otp, transactionId, customerId }),
      });

      if (!response.ok) throw new Error("OTP invalid");
      return true;
    } catch {
      return rejectWithValue("Invalid OTP");
    }
  },
);

const kycSlice = createSlice({
  name: "kyc",
  initialState: {
    leads: [],
    selectedCustomer: null,
    isLoading: false,
    error: null,
    txnId: "",
    showOtpInput: false,

    kycStatus: {
      pan: "pending",
      aadhaar: "pending",
    },
  },

  reducers: {
    // ✅ Select customer
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
      state.kycStatus = { pan: "pending", aadhaar: "pending" };
      state.showOtpInput = false;
      state.txnId = "";
      state.error = null;
    },

    // ✅ Clear customer
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
      state.showOtpInput = false;
      state.txnId = "";
    },

    // ✅ NEW: Cancel OTP Flow
    cancelOtpFlow: (state) => {
      state.showOtpInput = false;
      state.txnId = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // ---------------- FETCH LEADS ----------------
      .addCase(fetchKycLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchKycLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchKycLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------------- PAN VERIFY ----------------
      .addCase(verifyPan.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPan.fulfilled, (state) => {
        state.isLoading = false;
        state.kycStatus.pan = "verified";
      })
      .addCase(verifyPan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------------- OTP REQUEST ----------------
      .addCase(requestAadhaarOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(requestAadhaarOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.txnId = action.payload;
        state.showOtpInput = true;
      })
      .addCase(requestAadhaarOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ---------------- OTP VERIFY ----------------
      .addCase(verifyAadhaarOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyAadhaarOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.kycStatus.aadhaar = "verified";
        state.showOtpInput = false;
      })
      .addCase(verifyAadhaarOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedCustomer, clearSelectedCustomer, cancelOtpFlow } =
  kycSlice.actions;

export default kycSlice.reducer;
