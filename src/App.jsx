// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/login'; 
import ManageCustomers from './pages/customers/ManageCustomers';
import ClientRegistration from './pages/ClientRegistration';

// Customer Module Imports
import CustomerLayout from './pages/customers/CustomerLayout';
import CustomerDirectory from './pages/customers/CustomerDirectory';
import NewCustomerForm from './pages/customers/NewCustomerForm';
import KycVerification from './pages/customers/KycVerification';

export default function App() {
  return (
    <Routes>
      {/* 1. Public Route (No Sidebar/Navbar) */}
      <Route path="/login" element={<Login />} />
      
      {/* Redirect the base URL directly to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 2. Protected Routes (Wrapped in MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        
        {/* --- Settings Routes --- */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/add-client" element={<ClientRegistration />} /> 

        {/* Customer Module Nested Routes (MERGED INTO ONE BLOCK) */}
        <Route path="/customers" element={<CustomerLayout />}>
          <Route index element={<Navigate to="directory" replace />} />
          <Route path="directory" element={<CustomerDirectory />} />
          <Route path="new" element={<NewCustomerForm />} />
          <Route path="manage" element={<ManageCustomers />} /> 
          <Route path="kyc" element={<KycVerification />} />
        </Route>
        
      </Route>
    </Routes>
  );
}