// src/pages/Settings.jsx
import { useState } from 'react';
import { User, Lock, Bell, Shield, Building2 } from 'lucide-react';
import ClientRegistration from './ClientRegistration';
export default function Settings() {
  // State to track which tab is currently selected
  const [activeTab, setActiveTab] = useState('profile');

  // Helper function to apply active/inactive styles to sidebar buttons
  const getTabClass = (tabName) => {
    const baseClasses = "w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
    return activeTab === tabName
      ? `${baseClasses} bg-blue-50 text-blue-700` // Active styling
      : `${baseClasses} text-gray-700 hover:bg-gray-50`; // Inactive styling
  };

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('profile')} className={getTabClass('profile')}>
              <User className="h-4 w-4 mr-3" /> Profile
            </button>
            <button onClick={() => setActiveTab('security')} className={getTabClass('security')}>
              <Lock className="h-4 w-4 mr-3" /> Security
            </button>
            <button onClick={() => setActiveTab('notifications')} className={getTabClass('notifications')}>
              <Bell className="h-4 w-4 mr-3" /> Notifications
            </button>
            
            {/* New Company Registration Tab */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <button onClick={() => setActiveTab('companyRegistration')} className={getTabClass('companyRegistration')}>
                <Building2 className="h-4 w-4 mr-3" /> Company Registration
              </button>
            </div>
          </nav>
        </aside>

        {/* Settings Content Area */}
        <div className="flex-1">
          
          {/* 1. PROFILE TAB (Your exact existing code) */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <form className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                    JS
                  </div>
                  <div>
                    <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" defaultValue="John" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" defaultValue="Smith" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" defaultValue="john.smith@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
              <p className="text-gray-500 text-sm">Update your password and secure your account here.</p>
            </div>
          )}

          {/* 3. NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <p className="text-gray-500 text-sm">Choose what alerts you want to receive.</p>
            </div>
          )}

          {/* 4. COMPANY REGISTRATION TAB */}
          {activeTab === 'companyRegistration' && (
            <div className="animate-fade-in">
               <ClientRegistration />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}