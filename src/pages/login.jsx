import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, User } from "lucide-react";
import bgImage from "../assets/lgg.png";
import myLogo from "../assets/rayonix_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../feature/auth/authSlice";
import toast from "react-hot-toast"; // <-- IMPORT TOAST

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    toast
      .promise(dispatch(loginUser({ userId, password })).unwrap(), {
        loading: "Authenticating...",
        success: "Welcome back!",
        error: (err) => err || "Invalid credentials",
      })
      .then(() => {
        // Send EVERYONE to the dashboard.
        // The ProtectedRoute and Dashboard UI will handle the role restrictions.
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Login Error:", err);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full mb-4 shadow-md">
            <img
              src={myLogo}
              alt="Rayonix Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Rayonix</h1>
          <p className="text-blue-100 text-sm">
            Secure Financial Management System
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* USER ID FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                  placeholder="Enter User ID"
                  required
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-70"
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
