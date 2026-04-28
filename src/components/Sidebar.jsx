import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import myLogo from '../assets/rayonix_logo.png';
import { 
  LayoutDashboard, FileText, PieChart, Settings, 
  Users, PenBox, ChevronLeft, Menu,
  Briefcase, ChevronDown, UserCircle, CalendarCheck, PlaneTakeoff
} from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHrmOpen, setIsHrmOpen] = useState(false); // ✅ HRM Dropdown state

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users }, 
    { name: 'Loan Module', path: '/loans', icon: PenBox }, 
    // ✅ HRM Module with Sub-menu
    { 
      name: 'HRM Module', 
      path: '/hrm', 
      icon: Briefcase,
      isSubMenu: true,
      subItems: [
        { name: 'HRM Setup', path: '/hrm/setup', icon: Settings },
        { name: 'Employees', path: '/hrm/employees', icon: UserCircle },
        { name: 'Attendance', path: '/hrm/attendance', icon: CalendarCheck },
        { name: 'Leave Mgmt', path: '/hrm/leave', icon: PlaneTakeoff },
      ]
    },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r h-full hidden md:flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] relative ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}  
    >  
      {/* TOGGLE BUTTON */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="group absolute -right-5 top-20 z-50 flex items-center justify-center w-10 h-10 active:scale-95 transition-transform"
      >
        <svg className="absolute h-full w-full transform -rotate-90">
          <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-100" />
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

        <div className="relative h-7 w-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-blue-700 transition-colors">
          {isCollapsed ? <Menu size={12} className="animate-in fade-in" /> : <ChevronLeft size={12} className="animate-in fade-in" />}
        </div>
      </button>

      {/* Brand Logo Section */}
      <div className={`h-16 flex items-center border-b transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <img src={myLogo} alt="Company Logo" className="h-8 w-auto object-contain shrink-0" />
        {!isCollapsed && <span className="ml-3 text-xl font-black text-slate-800 tracking-tighter animate-in fade-in">Rayonix</span>}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;

          // ✅ Sub-menu logic for HRM
          if (item.isSubMenu && !isCollapsed) {
            return (
              <div key={item.name} className="space-y-1">
                <button 
                  onClick={() => setIsHrmOpen(!isHrmOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 text-slate-400 hover:bg-slate-50 hover:text-blue-600`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isHrmOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Collapsible Sub-items */}
                {isHrmOpen && (
                  <div className="ml-6 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.path}
                        className={({ isActive }) => 
                          `flex items-center px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-500'
                          }`
                        }
                      >
                        <sub.icon className="h-3.5 w-3.5 mr-2" />
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center rounded-2xl transition-all duration-300 ${
                  isCollapsed ? 'justify-center p-3 px-0' : 'px-4 py-3'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 translate-x-1'
                    : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
                }`
              }
            >
              <Icon className={`shrink-0 transition-transform duration-300 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5 mr-3'}`} />
              {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>}
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