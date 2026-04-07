import { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Eye, ShieldCheck, 
  Search, Loader2, FileText, AlertCircle, Clock
} from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

// 🛑 DUMMY DATA FOR UI TESTING
const DUMMY_LEADS = [
  {
    id: 101,
    firstName: 'Aarav',
    lastName: 'Sharma',
    system_uniquecust_id: 'CUST2026000001',
    application_status: 'inquiry',
    isDeleted: false,
    documents: [{}, {}, {}], // 3 Files
    monthlyIncome: '45000'
  },
  {
    id: 102,
    firstName: 'Vikram',
    lastName: 'Singh',
    system_uniquecust_id: 'CUST2026000003',
    application_status: 'inquiry',
    isDeleted: false,
    documents: [], // 0 Files (Will show red warning)
    monthlyIncome: '15000'
  },
  {
    id: 103,
    firstName: 'Priya',
    lastName: 'Patel',
    system_uniquecust_id: 'CUST2026000008',
    application_status: 'inquiry',
    isDeleted: false,
    documents: [{}, {}, {}, {}, {}], // 5 Files
    monthlyIncome: '120000'
  }
];

export default function KycVerification() {
  const [pendingLeads, setPendingLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingLeads();
  }, []);

  const fetchPendingLeads = async () => {
    setIsLoading(true);
    
    // 🛑 DUMMY DATA MODE: Simulating a 1-second network delay
    setTimeout(() => {
      setPendingLeads(DUMMY_LEADS);
      setIsLoading(false);
    }, 1000);

    /* ✅ REAL API CODE (Uncomment this when your backend is ready)
    try {
      const response = await fetch(`${BASE_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        const pending = data.filter(c => c.application_status === 'inquiry' && !c.isDeleted);
        setPendingLeads(pending);
      }
    } catch (error) {
      console.error("KYC Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleVerification = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this application as ${status}?`)) return;

    // 🛑 DUMMY DATA MODE: Just update the UI state directly
    setPendingLeads(prev => prev.filter(lead => lead.id !== id));
    alert(`Application ${status === 'approved' ? 'Verified' : 'Rejected'} successfully.`);

    /* ✅ REAL API CODE (Uncomment when your backend is ready)
    try {
      const response = await fetch(`${BASE_URL}/api/customers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ application_status: status })
      });

      if (response.ok) {
        setPendingLeads(prev => prev.filter(lead => lead.id !== id));
        alert(`Application ${status === 'approved' ? 'Verified' : 'Rejected'} successfully.`);
      }
    } catch (error) {
      alert("Action failed. Check backend connectivity.");
    }
    */
  };

  return (
    <div className="p-6 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" size={28} />
            KYC Verification Queue
          </h2>
          <p className="text-sm text-slate-500 font-medium">Checker Module: Verify documents for loan eligibility.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by ID or Name..."
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-80 focus:ring-4 focus:ring-blue-50 outline-none bg-white transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
            <p className="text-2xl font-black text-slate-800">{pendingLeads.length}</p>
          </div>
        </div>
      </div>

      {/* Verification List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/80 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
            <tr>
              <th className="p-5">Applicant Details</th>
              <th className="p-5">Submitted Docs</th>
              <th className="p-5">Income Verification</th>
              <th className="p-5 text-right">Verification Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase">Loading Queue...</p>
                </td>
              </tr>
            ) : pendingLeads.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <div className="max-w-xs mx-auto">
                    <CheckCircle className="mx-auto text-emerald-200 mb-3" size={48} />
                    <p className="text-sm font-black text-slate-800 uppercase">Queue Clear</p>
                    <p className="text-xs text-slate-400">All pending applications have been processed.</p>
                  </div>
                </td>
              </tr>
            ) : pendingLeads.filter(l => l.firstName.toLowerCase().includes(searchTerm.toLowerCase())).map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {lead.firstName[0]}{lead.lastName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 uppercase text-sm">{lead.firstName} {lead.lastName}</p>
                      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {lead.system_uniquecust_id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${lead.documents?.length > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {lead.documents?.length || 0} Files Attached
                    </span>
                  </div>
                </td>
                <td className="p-5">
                   <p className="text-sm font-black text-slate-700">₹{lead.monthlyIncome || '0'}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Self Declared</p>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleVerification(lead.id, 'rejected')}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Reject Application"
                    >
                      <XCircle size={22} />
                    </button>
                    <button 
                      onClick={() => handleVerification(lead.id, 'approved')}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-100 transition-all"
                    >
                      <CheckCircle size={14} /> Verify & Approve
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}