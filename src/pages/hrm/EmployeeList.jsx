import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, UserPlus, Filter, 
  Edit, Trash2, Eye, Download, Loader2 
} from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => localStorage.getItem('token');

  // ✅ API Integration: Fetch Employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/hrm/employees`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Backend format: data.data check
        setEmployees(data.data || data); 
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter logic for search
  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designationName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Employee Directory</h2>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-tighter">Manage workforce & lifecycle</p>
        </div>
        
        {/* ✅ FIXED: Link added for navigation */}
        <Link 
          to="/hrm/employees/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <UserPlus size={16} />
          Add New Employee
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, code or designation..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent border focus:border-blue-200 focus:bg-white rounded-2xl outline-none text-sm transition-all font-medium"
          />
        </div>
        
        <div className="flex gap-2">
          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200" title="Filter">
            <Filter size={18} />
          </button>
          <button className="p-3 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200" title="Export CSV">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Workforce...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No employees found.</p>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100 uppercase">
                          {emp.name ? emp.name.substring(0, 2) : 'EE'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{emp.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-tight">{emp.empCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-700">{emp.designationName || '—'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.roleName || 'Staff'}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-600 tracking-tight">{emp.mobile}</p>
                      <p className="text-[11px] text-slate-400 italic font-medium">{emp.email}</p>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        emp.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="View Profile"><Eye size={16} /></button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Edit Employee"><Edit size={16} /></button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Deactivate"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}