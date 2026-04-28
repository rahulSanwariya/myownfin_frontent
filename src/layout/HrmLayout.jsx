import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  PieChart, UserCircle, CalendarCheck, PlaneTakeoff, 
  ChevronRight, AlignLeft, X, Briefcase
} from 'lucide-react';

export default function HrmLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const hrmNav = [
    { name: 'Dashboard', path: '/hrm/dashboard', icon: PieChart },
    { name: 'Employees', path: '/hrm/employees', icon: UserCircle },
    { name: 'Attendance', path: '/hrm/attendance', icon: CalendarCheck },
    { name: 'Leave Management', path: '/hrm/leave', icon: PlaneTakeoff },
  ];

  return (
    <div className="flex h-full gap-2 py-4 pr-4 pl-2 bg-[#f8fafc]">
      <aside className={`${isCollapsed ? 'w-14' : 'w-64'} shrink-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}>
        <div className={`mb-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!isCollapsed && (
            <div className="animate-in fade-in duration-500">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-blue-600" />
                <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">HRM Module</h2>
              </div>
              <div className="h-1 w-10 bg-blue-600 mt-1 rounded-full"></div>
            </div>
          )}
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 transition-all shadow-sm">
            {isCollapsed ? <AlignLeft size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {hrmNav.map((item) => (
            <NavLink key={item.name} to={item.path} className={({ isActive }) => `group flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'} py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border ${isActive ? 'bg-blue-600 text-white shadow-lg translate-x-1 border-blue-600' : 'text-slate-400 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-100'}`}>
              <div className="flex items-center">
                <item.icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'}`} />
                {!isCollapsed && <span>{item.name}</span>}
              </div>
              {!isCollapsed && <ChevronRight size={12} className="opacity-0 group-hover:opacity-100" />}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 overflow-y-auto relative transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-full"></div>
        <Outlet /> 
      </main>
    </div>
  );
}