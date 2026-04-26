// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  Building,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  logout,
  setActiveBranch,
  fetchBranches,
} from "../feature/auth/authSlice";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Pull branches and loading state from Redux
  const { userInfo, activeBranchId, branches, isBranchesLoading } = useSelector(
    (state) => state.auth,
  );

  const companyId = userInfo?.companyId;

  // 2. Fetch branches from API on mount if user is MASTER_ADMIN
  useEffect(() => {
    if (userInfo?.role === "MASTER_ADMIN" && companyId) {
      dispatch(fetchBranches(companyId));
    }
  }, [dispatch, userInfo?.role, companyId]);

  // 3. Format API data specifically for react-select [{ value, label }]
  // Note: Using fallbacks (branch.id || branch.branchId) to ensure it works regardless of your exact API response keys
  const branchOptions =
    branches?.map((branch) => ({
      value: branch.id || branch.branchId,
      label: branch.name || branch.branchName,
    })) || [];

  // 4. Find the currently selected option object (convert to string to ensure safe matching)
  const selectedBranchOption =
    branchOptions.find((opt) => String(opt.value) === String(activeBranchId)) ||
    null;

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // 5. react-select passes the whole option object instead of an event
  const handleBranchChange = (selectedOption) => {
    dispatch(setActiveBranch(selectedOption ? selectedOption.value : null));
  };

  // 6. Custom styles to match your Tailwind UI
  const reactSelectStyles = {
    control: (base, state) => ({
      ...base,
      background: "transparent",
      border: "none",
      boxShadow: "none",
      minHeight: "auto",
      cursor: "pointer",
      width: "220px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#1e40af", // text-blue-800
      fontWeight: "700",
      fontSize: "0.875rem", // text-sm
    }),
    placeholder: (base) => ({
      ...base,
      color: "#1e40af",
      fontWeight: "700",
      fontSize: "0.875rem",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#2563eb", // text-blue-600
      padding: "0",
      "&:hover": {
        color: "#1d4ed8",
      },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "0.75rem",
      overflow: "hidden",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      border: "1px solid #f1f5f9",
      zIndex: 50,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#eff6ff" // bg-blue-50
        : state.isFocused
          ? "#f8fafc" // bg-slate-50
          : "white",
      color: state.isSelected ? "#1d4ed8" : "#334155",
      fontSize: "0.875rem",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#eff6ff",
      },
    }),
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions, reports..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* --- REACT-SELECT BRANCH DROPDOWN (API DRIVEN) --- */}
        {userInfo?.role === "MASTER_ADMIN" && (
          <div className="flex items-center gap-1 bg-blue-50 border border-blue-100 px-3 py-1 rounded-lg animate-in fade-in">
            <Building className="h-4 w-4 text-blue-600 shrink-0" />
            <Select
              options={branchOptions}
              value={selectedBranchOption}
              onChange={handleBranchChange}
              styles={reactSelectStyles}
              placeholder="Select Branch..."
              isLoading={isBranchesLoading} // Shows a spinner while API is fetching
              isSearchable={true}
              noOptionsMessage={() => "No branches found"}
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-9 w-9 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer select-none"
          >
            <User className="h-5 w-5" />
          </div>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              ></div>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userInfo?.userId || "Admin User"}
                  </p>
                  <p className="text-[10px] font-black tracking-widest text-blue-500 uppercase mt-0.5">
                    {userInfo?.role}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/settings");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                >
                  <SettingsIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2 text-red-500" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
