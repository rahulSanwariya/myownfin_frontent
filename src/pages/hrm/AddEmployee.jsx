import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Building2, Wallet, ArrowRight, ArrowLeft, Save, Loader2 
} from 'lucide-react';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:8080';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([]);
  const [designations, setDesignations] = useState([]);
  

  

  // ✅ 1. Bulletproof Auth Logic
  const auth = useMemo(() => {
    try {
      const rawData = localStorage.getItem('token');
      if (!rawData) return null;

      let actualToken = "";
      // Handle Case: Agar object stringified hai ya direct string
      if (rawData.startsWith('{')) {
        const parsedData = JSON.parse(rawData);
        actualToken = parsedData.token;
      } else {
        actualToken = rawData;
      }

      const payload = JSON.parse(window.atob(actualToken.split('.')[1]));
      
      return {
        token: actualToken,
        companyId: payload.companyId,
        branchId: payload.branchId,
        username: payload.sub
      };
    } catch (e) {
      console.error("Auth Parsing Error:", e);
      return null;
    }
  }, []);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", mobile: "", email: "",
    roleId: "", designationId: "", managerId: "",
    basicSalary: "", aadhaarNo: "", panNo: "", joiningDate: ""
  });

  // ✅ 2. Fetch Roles & Designations with Query Params
  useEffect(() => {
    if (!auth?.companyId) return;

    const fetchSetupData = async () => {
      const headers = { 
        'Authorization': `Bearer ${auth.token}`, 
        'username': auth.username 
      };
      try {
        const [r, d] = await Promise.all([
          fetch(`${BASE_URL}/api/hrm/roles?companyId=${auth.companyId}`, { headers }),
          fetch(`${BASE_URL}/api/hrm/designations?companyId=${auth.companyId}`, { headers })
        ]);
        
        const roleData = await r.json();
        const desigData = await d.json();

        const extract = (res) => (Array.isArray(res) ? res : res.data?.data || res.data || []);
        setRoles(extract(roleData));
        setDesignations(extract(desigData));
      } catch (err) {
        console.error("Setup Data Fetch Error:", err);
      }
    };
    fetchSetupData();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  // ✅ 3. Optimized Submit with Data Type Conversion
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.companyId) return toast.error("Session expired. Please login.");

    setIsSubmitting(true);
    try {
      const finalUrl = `${BASE_URL}/api/hrm/employees?companyId=${auth.companyId}&branchId=${auth.branchId}`;

      // Backend expects Numbers, not Strings for IDs and Salary
      const payload = {
        ...formData,
        companyId: Number(auth.companyId),
        branchId: Number(auth.branchId),
        roleId: formData.roleId ? Number(formData.roleId) : null,
        designationId: formData.designationId ? Number(formData.designationId) : null,
        managerId: formData.managerId ? Number(formData.managerId) : null,
        basicSalary: formData.basicSalary ? Number(formData.basicSalary) : 0
      };

      const response = await fetch(finalUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
          'username': auth.username
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Employee onboarded successfully!");
        navigate('/hrm/employees');
      } else {
        toast.error(result.message || "Bad Request: Check your inputs");
        console.log("Server Error Response:", result);
      }
    } catch (err) {
      toast.error("Network Error: Could not connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-10 animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Employee Onboarding</h2>
        <div className="h-1.5 w-12 bg-blue-600 mt-2 rounded-full"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-slate-50 bg-slate-50/30">
          {[
            { id: 'personal', label: 'Personal', icon: <User size={14}/> },
            { id: 'org', label: 'Organization', icon: <Building2 size={14}/> },
            { id: 'finance', label: 'Finance', icon: <Wallet size={14}/> }
          ].map((tab, idx) => (
            <button 
              key={tab.id} 
              type="button" 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex-1 py-5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-400'}`}
            >
              0{idx + 1} {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
              <InputGroup label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
              <InputGroup label="Mobile *" name="mobile" value={formData.mobile} onChange={handleInputChange} required />
              <InputGroup label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              <div className="md:col-span-2 flex justify-end pt-4"><NextButton onClick={() => setActiveTab('org')} /></div>
            </div>
          )}

          {activeTab === 'org' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role *</label>
                <select name="roleId" value={formData.roleId} onChange={handleInputChange} required className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all appearance-none cursor-pointer border-slate-100 border">
                  <option value="">Select Role</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.roleName || r.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation *</label>
                <select name="designationId" value={formData.designationId} onChange={handleInputChange} required className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all appearance-none cursor-pointer border-slate-100 border">
                  <option value="">Select Designation</option>
                  {designations.map(d => <option key={d.id} value={d.id}>{d.designationName || d.name}</option>)}
                </select>
              </div>
              <InputGroup label="Joining Date *" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleInputChange} required />
              <InputGroup label="Manager ID (Number)" name="managerId" type="number" value={formData.managerId} onChange={handleInputChange} />
              <div className="md:col-span-2 flex justify-between pt-4"><BackButton onClick={() => setActiveTab('personal')} /><NextButton onClick={() => setActiveTab('finance')} /></div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
              <InputGroup label="Basic Salary *" name="basicSalary" type="number" value={formData.basicSalary} onChange={handleInputChange} required />
              <InputGroup label="PAN Number" name="panNo" value={formData.panNo} onChange={handleInputChange} />
              <InputGroup label="Aadhaar Number" name="aadhaarNo" value={formData.aadhaarNo} onChange={handleInputChange} />
              <div className="md:col-span-2 flex justify-between pt-4">
                <BackButton onClick={() => setActiveTab('org')} />
                <button type="submit" disabled={isSubmitting} className="px-12 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Complete Onboarding
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// --- Internal Sub-components ---
const InputGroup = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input {...props} className="w-full px-5 py-4 bg-slate-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all border-slate-100 border" />
  </div>
);

const NextButton = ({ onClick }) => (
  <button type="button" onClick={onClick} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-blue-700 transition-all">
    Next Step <ArrowRight size={14} />
  </button>
);

const BackButton = ({ onClick }) => (
  <button type="button" onClick={onClick} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-200 transition-all">
    <ArrowLeft size={14} /> Back
  </button>
);