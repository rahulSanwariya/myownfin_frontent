import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

/**
 * =========================
 * CREATE CUSTOMER (FORM SUBMIT)
 * =========================
 */
export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async ({ formData, files }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const formDataToSend = new FormData();

      // Customer JSON as Blob
      const customerBlob = new Blob([JSON.stringify(formData)], {
        type: "application/json",
      });

      formDataToSend.append("customer", customerBlob);

      // Files
      const selectedFiles = Object.keys(files || {});

      selectedFiles.forEach((key) => {
        const file = files[key];
        if (!file) return;

        const docTypeId = getDocumentTypeId(key);
        if (!docTypeId) return;

        formDataToSend.append("files", file);
        formDataToSend.append("docTypes", String(docTypeId));
      });

      const response = await fetch(`${BASE_URL}/api/customers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to create customer");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

/**
 * =========================
 * SLICE
 * =========================
 */
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    formData: {
      firstName: "",
      lastName: "",
      dob: "",
      mobile: "",
      altMobile: "",
      emailAddress: "",
      gender: "",
      fatherName: "",
      category: "",
      maritalStatus: "",
      occupation: "",
      monthlyIncome: "",
      applicant_pan: "",
      applicant_aadhaar: "",
      requested_loan_amount: "",

      applicant_currentAddress: "",
      applicant_city: "",
      applicant_sate: "",
      applicant_pinCode: "",
      applicant_permanentAddress: "",
      applicant_permCity: "",
      applicant_permSate: "",
      applicant_permPinCode: "",

      nominee_fullname: "",
      nominee_relation: "",
      nominee_dob: "",
      nominee_mobile: "",
      nominee_emailAddress: "",
      nominee_gender: "",
      nominee_fatherName: "",
      nominee_category: "",
      nominee_maritalStatus: "",
      nominee_occupation: "",
      nominee_monthlyIncome: "",
      nominee_pan: "",
      nominee_aadhaar: "",

      nominee_currentAddress: "",
      nominee_city: "",
      nominee_sate: "",
      nominee_pinCode: "",

      bankName: "",
      accountNumber: "",
      ifscCode: "",
      branchName: "",
      nominee_bankName: "",
      nominee_accountNumber: "",
      nominee_ifscCode: "",
      nominee_branchName: "",
    },

    files: {},

    isSubmitting: false,
    success: false,
    error: null,
  },

  reducers: {
    // Update form field
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },

    // Bulk set form (useful for reset or preload)
    setFormData: (state, action) => {
      state.formData = action.payload;
    },

    // File upload
    setFile: (state, action) => {
      const { key, file } = action.payload;
      state.files[key] = file;
    },

    removeFile: (state, action) => {
      delete state.files[action.payload];
    },

    resetForm: (state) => {
      state.formData = initialFormState();
      state.files = {};
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createCustomer.pending, (state) => {
        state.isSubmitting = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

/**
 * =========================
 * HELPER FUNCTIONS
 * =========================
 */

function getDocumentTypeId(key) {
  const map = {
    docApplicantPhoto: 1,
    docPanCard: 2,
    docAadhaar: 3,
    docBankStatement: 4,
    docIncomeProof: 5,
    docCurrentAddress: 6,
    docPermanentAddress: 7,
    docNomineePhoto: 8,
    docNomineeId: 9,
    docCancelledCheque: 10,
  };

  return map[key];
}

function initialFormState() {
  return {
    firstName: "",
    lastName: "",
    dob: "",
    mobile: "",
    altMobile: "",
    emailAddress: "",
    gender: "",
    fatherName: "",
    category: "",
    maritalStatus: "",
    occupation: "",
    monthlyIncome: "",
    applicant_pan: "",
    applicant_aadhaar: "",
    requested_loan_amount: "",

    applicant_currentAddress: "",
    applicant_city: "",
    applicant_sate: "",
    applicant_pinCode: "",
    applicant_permanentAddress: "",
    applicant_permCity: "",
    applicant_permSate: "",
    applicant_permPinCode: "",

    nominee_fullname: "",
    nominee_relation: "",
    nominee_dob: "",
    nominee_mobile: "",
    nominee_emailAddress: "",
    nominee_gender: "",
    nominee_fatherName: "",
    nominee_category: "",
    nominee_maritalStatus: "",
    nominee_occupation: "",
    nominee_monthlyIncome: "",
    nominee_pan: "",
    nominee_aadhaar: "",

    nominee_currentAddress: "",
    nominee_city: "",
    nominee_sate: "",
    nominee_pinCode: "",

    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    nominee_bankName: "",
    nominee_accountNumber: "",
    nominee_ifscCode: "",
    nominee_branchName: "",
  };
}

export const { updateField, setFile, removeFile, resetForm, setFormData } =
  customerSlice.actions;

export default customerSlice.reducer;
