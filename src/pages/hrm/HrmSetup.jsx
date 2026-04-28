import { useState, useEffect } from 'react';
import { Shield, Briefcase, Plus, Loader2, Trash2, Settings, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8080';

export default function HrmSetup() {
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRole, setNewRole] = useState("");
  const [newDesignation, setNewDesignation] = useState("");

  const getAuthData = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      return { companyId: payload.companyId, username: payload.sub };
    } catch (e) { return null; }
  };

  const fetchData = async () => {
    const auth = getAuthData();
    if (!auth) return;

    setLoading(true);
    try {
      const headers = { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'username': auth.username 
      };
      
      const [roleRes, desigRes] = await Promise.all([
        fetch(`${BASE_URL}/api/hrm/roles?companyId=${auth.companyId}`, { headers }),
        fetch(`${BASE_URL}/api/hrm/designations?companyId=${auth.companyId}`, { headers })
      ]);

      const roleData = await roleRes.json();
      const desigData = await desigRes.json();

      // 🔍 DEBUGGING: Inpect console to see the real structure
      console.log("Roles API Response:", roleData);
      console.log("Designations API Response:", desigData);

      // Extract array safely
      const rList = roleData.data || roleData || [];
      const dList = desigData.data || desigData || [];

      setRoles(Array.isArray(rList) ? rList : []);
      setDesignations(Array.isArray(dList) ? dList : []);
      
    } catch (err) {
      toast.error("Failed to fetch latest setup");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (type, value, setter) => {
    if (!value) return;
    const auth = getAuthData();
    const endpoint = type === 'role' ? 'roles' : 'designations';
    
    const requestBody = type === 'role' ? {
      companyId: auth.companyId,
      roleName: value,
      description: `User defined ${value}`
    } : {
      companyId: auth.companyId,
      designationName: value,
      description: `User defined ${value}`
    };

    try {
      const res = await fetch(`${BASE_URL}/api/hrm/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'username': auth.username 
        },
        body: JSON.stringify(requestBody)
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success("Added! Refreshing...");
        setter("");
        setTimeout(() => fetchData(), 500); // 0.5s delay to let DB settle
      } else {
        toast.error(result.message || "Failed to add");
      }
    } catch (err) { toast.error("Network Error"); }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest leading-none">HRM Setup</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure Roles & Designations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ROLES PANEL */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Shield size={14} className="text-blue-600" /> HRM Roles
          </h3>
          <div className="flex gap-2 mb-8">
            <input value={newRole} onChange={(e)=>setNewRole(e.target.value)} placeholder="New Role..." className="flex-1 px-5 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all" />
            <button onClick={()=>handleAdd('role', newRole, setNewRole)} className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-95 transition-all"><Plus size={20}/></button>
          </div>

          <div className="space-y-2">
            {roles.length > 0 ? roles.map((r, i) => (
              <div key={r.id || i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                {/* SAFE RENDER: Check multiple possible keys */}
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  {r.roleName || r.name || "Unnamed Role"}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
              </div>
            )) : <div className="text-center py-10 text-slate-300 text-[10px] font-bold uppercase">No Roles Found</div>}
          </div>
        </div>

        {/* DESIGNATIONS PANEL */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Briefcase size={14} className="text-emerald-600" /> Job Designations
          </h3>
          <div className="flex gap-2 mb-8">
            <input value={newDesignation} onChange={(e)=>setNewDesignation(e.target.value)} placeholder="New Designation..." className="flex-1 px-5 py-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-emerald-200 focus:bg-white transition-all" />
            <button onClick={()=>handleAdd('designation', newDesignation, setNewDesignation)} className="p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 active:scale-95 transition-all"><Plus size={20}/></button>
          </div>

          <div className="space-y-2">
            {designations.length > 0 ? designations.map((d, i) => (
              <div key={d.id || i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  {d.designationName || d.name || "Unnamed Job"}
                </span>
                <button className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
              </div>
            )) : <div className="text-center py-10 text-slate-300 text-[10px] font-bold uppercase">No Designations Found</div>}
          </div>
        </div>

      </div>
    </div>
  );
}