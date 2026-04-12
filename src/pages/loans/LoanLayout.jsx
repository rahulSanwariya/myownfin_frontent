import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  FilePlus, FileSearch, BadgeCheck, Wallet, 
  History, ChevronRight, Calculator, CreditCard,
  AlignLeft, X 
} from 'lucide-react';

export default function LoanLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const loanNav = [
    { name: 'Apply New Loan', path: '/loans/new', icon: FilePlus },
    { name: 'Manage Personal Loan', path: '/loans/manage-personal-loan', icon: CreditCard},
    { name: 'Underwriting', path: '/loans/underwriting', icon: FileSearch },
    { name: 'Active Approvals', path: '/loans/approvals', icon: BadgeCheck },
    { name: 'Disbursement Hub', path: '/loans/disburse', icon: Wallet },
    { name: 'Loan History', path: '/loans/history', icon: History },
  ];

  return (
    // ✅ Gap 4 rakha hai taaki main page sidebar ke paas rahe
    <div className="flex h-full gap-4 p-4 bg-slate-50/30">
      
      {/* --- Sidebar Container --- */}
      <aside 
        className={`${
          isCollapsed ? 'w-12' : 'w-64'
        } shrink-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      >
        {/* Header & Premium Toggle */}
        <div className={`mb-10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          <div className={`${isCollapsed ? 'hidden' : 'block animate-in fade-in duration-500'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">Loan Module</h2>
            </div>
            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
          </div>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-90 shadow-sm"
          >
            {isCollapsed ? (
              <AlignLeft size={20} className="animate-in fade-in zoom-in duration-300" />
            ) : (
              <X size={20} className="animate-in fade-in rotate-90 duration-300" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2 flex-1">
          {loanNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : ""}
              className={({ isActive }) =>
                `group flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'} py-4 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 transform border ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-1 border-blue-600'
                    : 'text-slate-400 hover:bg-white hover:text-blue-600 border-transparent hover:border-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center">
                    <item.icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4 mr-3'} transition-all duration-300`} />
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
          ))}
        </nav>

        {/* RBI Compliance Section (Mini mode mein hide hoga) */}
        {!isCollapsed && (
          <div className="p-5 bg-white/50 rounded-3xl border border-dashed border-slate-200 mt-6 animate-in fade-in duration-700">
            <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest text-center">RBI Compliance</p>
            <p className="text-[10px] text-slate-400 leading-relaxed font-bold text-center">
              Audits Active.
            </p>
          </div>
        )}
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 overflow-y-auto relative min-h-[500px] transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-700 via-indigo-500 to-blue-700 rounded-t-full"></div>
        <Outlet /> 
      </main>
    </div>
  );
}