// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Login from "./pages/login";
import ManageCustomers from "./pages/customers/ManageCustomers";
import ClientRegistration from "./pages/ClientRegistration";
import ManagePersonalLoan from "./pages/loans/ManagePersonalLoan.jsx";

// Customer Module Imports
import CustomerLayout from "./pages/customers/CustomerLayout";
import CustomerDirectory from "./pages/customers/CustomerDirectory";
import NewCustomerForm from "./pages/customers/NewCustomerForm";
import KycVerification from "./pages/customers/KycVerification";

// Loan Module Imports
import LoanLayout from "./pages/loans/LoanLayout";
import AddLoan from "./pages/loans/AddLoan.jsx";

import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/security/ProtectedRoute.jsx"; // Adjust path as needed

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PROTECTED ROUTES */}
        {/* Anything inside this ProtectedRoute wrapper requires authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/settings/add-client"
              element={<ClientRegistration />}
            />

            {/* --- CUSTOMER MODULE --- */}
            <Route path="/customers" element={<CustomerLayout />}>
              <Route index element={<Navigate to="directory" replace />} />
              <Route path="directory" element={<CustomerDirectory />} />
              <Route path="new" element={<NewCustomerForm />} />
              <Route path="manage" element={<ManageCustomers />} />
              <Route path="kyc" element={<KycVerification />} />
            </Route>

            {/* --- LOAN MODULE --- */}
            <Route path="/loans" element={<LoanLayout />}>
              <Route index element={<Navigate to="new" replace />} />
              <Route path="new" element={<AddLoan />} />
              <Route
                path="manage-personal-loan"
                element={<ManagePersonalLoan />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
