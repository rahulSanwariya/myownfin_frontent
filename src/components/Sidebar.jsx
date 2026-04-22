import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import myLogo from '../assets/rayonix_logo.png';
import { 
  LayoutDashboard, FileText, PieChart, Settings, 
  Users, PenBox, ChevronLeft, Menu 
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users }, 
    { name: 'Loan Module', path: '/loans', icon: PenBox }, 
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r h-full hidden md:flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${
        isCollapsed ? 'w-16' : 'w-64' // ✅ Changed w-20 to w-16 for extra tight look
      }`}  
    >  
      {/* TOGGLE BUTTON - ✅ Changed top-20 to top-8 to move it higher */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="group absolute -right-5 top-20 z-50 flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
      >
        {/* The Clockwise SVG Ring */}
        <svg className="absolute h-full w-full transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="transparent"
            className="text-slate-100"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray="113" 
            strokeDashoffset="113" 
            strokeLinecap="round" 
            className="text-blue-600 transition-all duration-700 ease-in-out group-hover:stroke-dashoffset-0"
          />
        </svg>

        {/* Inner Icon Circle */}
        <div className="relative h-7 w-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-colors">
          {isCollapsed ? (
            <Menu size={12} className="animate-in fade-in" />
          ) : (
            <ChevronLeft size={12} className="animate-in fade-in" />
          )}
        </div>
      </button>

      {/* Brand Logo Section */}
      <div className={`h-16 flex items-center border-b transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <img 
          src={myLogo}
          alt="Company Logo" 
          className="h-8 w-auto object-contain shrink-0" 
        />
        {!isCollapsed && (
          <span className="ml-3 text-xl font-black text-slate-800 tracking-tighter animate-in fade-in slide-in-from-left-2">
            Rayonix
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center rounded-2xl transition-all duration-300 ${
                  isCollapsed ? 'justify-center p-3 px-0' : 'px-4 py-3' // ✅ Added px-0 for tight fit
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
                }`
              }
            >
              <Icon className={`shrink-0 transition-transform duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'} ${isCollapsed ? '' : 'group-hover:scale-110'}`} />
              
              {!isCollapsed && (
                <span className="text-[11px] font-black uppercase tracking-widest whitespace-nowrap animate-in fade-in slide-in-from-left-2">
                  {item.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Version Tag */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-50">
           <div className="bg-slate-50/50 p-3 rounded-2xl border border-dashed border-slate-200">
              <p className="text-[9px] font-black text-slate-400 uppercase text-center tracking-tighter">v1.0.4 Premium</p>
           </div>
        </div>
      )}
    </aside>
  );
}