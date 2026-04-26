import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const getToken = () => localStorage.getItem("token");

// Fetch All Customers - Now accepts an ID parameter
export const fetchCustomers = createAsyncThunk(
  "manageCustomers/fetchCustomers",
  async (companyId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        // The hardcoded '1' is replaced with the dynamic variable
        `${BASE_URL}/api/customers/getAllCustomer/${companyId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch customers");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Update Customer Details
export const updateCustomer = createAsyncThunk(
  "manageCustomers/updateCustomer",
  async (customer, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) throw new Error("Failed to update customer");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Upload/Replace Document
// Note: We pass the file and construct FormData inside the thunk
// Upload/Replace Document
export const uploadDocument = createAsyncThunk(
  "manageCustomers/uploadDocument",
  // ADDED companyId and branchId to the destructured arguments so they don't throw an error
  async (
    { customerId, docName, file, existingDbId, companyId, branchId },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("docTypes", docName);

      // Cleaned up the URL template literal
      const url = existingDbId
        ? `${BASE_URL}/api/customers/documents/${existingDbId}/replace`
        : `${BASE_URL}/api/customers/upload-documents/${customerId}/${companyId}/${branchId}`;

      const response = await fetch(url, {
        method: existingDbId ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload document");
      const result = await response.json();

      return { docName, dbId: result.id || existingDbId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const manageCustomersSlice = createSlice({
  name: "manageCustomers",
  initialState: {
    leads: [],
    isLoading: false,
    isSaving: false,
    statusUpdating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Customer (Both Status and Details use this)
      .addCase(updateCustomer.pending, (state, action) => {
        // Distinguish between a status update vs a full save based on the payload size/context if needed,
        // but for simplicity, we trigger isSaving.
        state.isSaving = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isSaving = false;
        state.statusUpdating = false;
        // Update the specific lead in the array
        const index = state.leads.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isSaving = false;
        state.statusUpdating = false;
        state.error = action.payload;
      });
  },
});

export default manageCustomersSlice.reducer;
