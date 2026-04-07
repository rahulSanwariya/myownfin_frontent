// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Lock, ArrowRight, AlertCircle, User } from 'lucide-react';
import bgImage from '../assets/lgg.png';

export default function Login() {
  const navigate = useNavigate();

  // ✅ UPDATED STATE (userId instead of email)
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    console.log("LOGIN ATTEMPT:", userId);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,     // 🔥 FIXED
          password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();

        console.log("LOGIN SUCCESS:", data);

        if (data.token) {
          localStorage.setItem('token', data.token);
        } else if (data.jwt) {
          localStorage.setItem('token', data.jwt);
        }

        navigate('/dashboard');
      } else {
        console.log("LOGIN FAILED");
        setErrorMessage('Invalid User ID or Password');
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage('Cannot connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative z-10">

        {/* Header */}
        <div className="bg-blue-600 px-8 py-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-full mb-4 shadow-inner">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Rapid System</h1>
          <p className="text-blue-100 text-sm">Secure Financial Management System</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Sign in to your account
          </h2>

          {/* Error */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
              {errorMessage}
            </div>
          )}

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
              {isLoading ? 'Authenticating...' : (
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