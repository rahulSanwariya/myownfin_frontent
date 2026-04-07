// src/components/Navbar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear the user's JWT token or session here
    // localStorage.removeItem('token');
    
    // Redirect back to the login page
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 z-10">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-96 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search transactions, reports..."
          className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors relative">
          <Bell className="h-5 w-5" />
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {/* User Avatar & Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-9 w-9 bg-blue-600 hover:bg-blue-700 transition-colors rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer select-none"
          >
            <User className="h-5 w-5" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Invisible overlay to close dropdown when clicking outside */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">rahul@gmail.com</p>
                </div>
                
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/settings');
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