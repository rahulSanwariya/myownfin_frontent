import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  Users, UserPlus, ShieldCheck, ClipboardList, 
  ChevronRight, AlignLeft, X 
} from 'lucide-react';

export default function CustomerLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const customerNav = [
    { name: 'Directory', path: '/customers/directory', icon: Users },
    { name: 'Add New Lead', path: '/customers/new', icon: UserPlus },
    { name: 'KYC Verification', path: '/customers/kyc', icon: ShieldCheck },
    { name: 'Manage Leads', path: '/customers/manage', icon: ClipboardList },
  ];

  return (
    // ✅ FIX: pl-2 (left padding kam ki) aur gap-2 kiya taaki content left se start ho
    <div className="flex h-full gap-2 py-4 pr-4 pl-2 bg-[#f8fafc]">
      
      {/* --- Sidebar Container --- */}
      <aside 
        className={`${
          isCollapsed ? 'w-14' : 'w-64' // ✅ Width 16 se 14 (Ultra Tight)
        } shrink-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      >
        {/* Header & Toggle */}
        <div className={`mb-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
          <div className={`${isCollapsed ? 'hidden' : 'block animate-in fade-in duration-500'}`}>
            <h2 className="text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">Customer</h2>
            <div className="h-1 w-10 bg-blue-600 mt-1 rounded-full"></div>
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90 shadow-sm"
          >
            {isCollapsed ? (
              <AlignLeft size={18} className="animate-in fade-in zoom-in duration-300" />
            ) : (
              <X size={18} className="animate-in fade-in rotate-90 duration-300" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 flex-1">
          {customerNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ""}
                className={({ isActive }) =>
                  // ✅ FIX: px-0 aur items-center justify-center icons ko tight center karega
                  `group flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'} py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 transform border ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-1 border-blue-600'
                      : 'text-slate-400 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center justify-center">
                      <Icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'} transition-all duration-300`} />
                      <span className={`${isCollapsed ? 'hidden' : 'block'} whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300`}>
                        {item.name}
                      </span>
                    </div>
                    
                    {!isCollapsed && (
                      <ChevronRight 
                        size={14} 
                        className={`transition-all duration-300 ${
                          isActive 
                            ? 'opacity-100 translate-x-1' 
                            : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                        }`} 
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Compliance Section */}
        {!isCollapsed && (
          <div className="p-4 bg-white/50 rounded-3xl border border-dashed border-slate-200 mt-6 animate-in fade-in duration-700">
            <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest text-center">RBI Compliance</p>
            <p className="text-[10px] text-slate-400 font-bold text-center leading-tight">Logs active.</p>
          </div>
        )}
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 overflow-y-auto relative min-h-[500px] transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-t-full"></div>
        <Outlet /> 
      </main>
    </div>
  );  
}