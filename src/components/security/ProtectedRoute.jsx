// src/components/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ==========================================
  // MASTER ADMIN STRICT LOCKDOWN
  // ==========================================
  // If the user is a MASTER_ADMIN and the path is NOT exactly "/dashboard",
  // force them back to the dashboard.
  if (userInfo?.role === "MASTER_ADMIN" && location.pathname !== "/dashboard") {
    return <Navigate to="/dashboard" replace />;
  }

  // If everything is fine (normal user, or Admin on the dashboard), render the route
  return <Outlet />;
}
