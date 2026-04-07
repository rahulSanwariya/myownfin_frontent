import { NavLink, Outlet } from 'react-router-dom';
import { Users, UserPlus, ShieldCheck, ClipboardList, ChevronRight } from 'lucide-react';

export default function CustomerLayout() {
  const customerNav = [
    { name: 'Directory', path: '/customers/directory', icon: Users },
    { name: 'Add New Lead', path: '/customers/new', icon: UserPlus },
    { name: 'Manage Leads', path: '/customers/manage', icon: ClipboardList },
    { name: 'KYC Verification', path: '/customers/kyc', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-full gap-8 p-4">
      <aside className="w-64 shrink-0 flex flex-col">
        <div className="mb-8 px-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Customer Module</h2>
          <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full"></div>
        </div>

        <nav className="space-y-2 flex-1">
          {customerNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  // ✅ FIX: Moved 'border' to the base class list so height is always consistent
                  `group flex items-center justify-between px-5 py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 transform border ${
                    isActive
                      // ✅ FIX: Added 'border-blue-600' so the border matches the background
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-2 border-blue-600'
                      : 'text-slate-400 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3" />
                      {item.name}
                    </div>
                    {/* ✅ FIX: Chevron stays visible when the tab is active */}
                    <ChevronRight 
                      size={14} 
                      className={`transition-all duration-300 ${
                        isActive 
                          ? 'opacity-100 translate-x-1' 
                          : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                      }`} 
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-5 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 mt-6">
          <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Compliance Note</p>
          <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
            All KYC uploads and modifications are logged under RBI Digital Lending guidelines.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 overflow-y-auto relative min-h-[500px]">
        {/* Animated Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-t-full"></div>
        
        {/* Component renders here */}
        <Outlet /> 
      </main>
    </div>
  );  
}