import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// ==========================================
// 1. ASYNC THUNK: LOGIN USER
// ==========================================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ userId, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// ==========================================
// 2. ASYNC THUNK: FETCH BRANCHES (For Admin)
// ==========================================
export const fetchBranches = createAsyncThunk(
  "auth/fetchBranches",
  async (companyId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/api/mis/get-allBranchList/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch branches");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// ==========================================
// 3. AUTH SLICE
// ==========================================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || null,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || null,
    activeBranchId: localStorage.getItem("activeBranchId") || null,

    // Branch Data State
    branches: [],
    isBranchesLoading: false,

    // Auth Status State
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      // Clear Redux State
      state.token = null;
      state.userInfo = null;
      state.activeBranchId = null;
      state.branches = [];
      state.isAuthenticated = false;

      // Clear Local Storage
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("activeBranchId");
    },
    setActiveBranch: (state, action) => {
      state.activeBranchId = action.payload;
      if (action.payload) {
        localStorage.setItem("activeBranchId", action.payload);
      } else {
        localStorage.removeItem("activeBranchId");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // --- LOGIN CASES ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.userInfo;
        state.isAuthenticated = true;

        // ROLE-BASED BRANCH LOGIC
        const isMasterAdmin = action.payload.userInfo.role === "MASTER_ADMIN";

        // If Master Admin, set to null (forces dropdown selection).
        // Otherwise, use the user's assigned branch.
        const assignedBranch = isMasterAdmin
          ? null
          : action.payload.userInfo.branchId;

        state.activeBranchId = assignedBranch;

        // Save to Local Storage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "userInfo",
          JSON.stringify(action.payload.userInfo),
        );

        if (assignedBranch) {
          localStorage.setItem("activeBranchId", assignedBranch);
        } else {
          localStorage.removeItem("activeBranchId");
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- FETCH BRANCHES CASES ---
      .addCase(fetchBranches.pending, (state) => {
        state.isBranchesLoading = true;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isBranchesLoading = false;
        state.branches = action.payload;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isBranchesLoading = false;
        console.error("Failed to load branches:", action.payload);
      });
  },
});

export const { logout, setActiveBranch } = authSlice.actions;
export default authSlice.reducer;
