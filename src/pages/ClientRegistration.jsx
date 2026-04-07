// src/pages/settings/ClientRegistration.jsx
import { useState } from 'react';
import { Building2, Shield, GitBranch, Plus, Trash2, Save, User, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ClientRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. Master Company & Admin State
  const [companyDetails, setCompanyDetails] = useState({
    companyName: '',
    registrationNumber: '',
    contactEmail: '',
    contactPhone: '',
    companyAddress: '',
    masterUsername: '',
    masterPassword: ''
  });

  // 2. Dynamic Branches State
  const [branches, setBranches] = useState([
    { id: 1, branchName: 'Head Office', branchCode: 'BR-001', branchUsername: '', branchPassword: '' }
  ]);

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBranchChange = (id, e) => {
    const { name, value } = e.target;
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, [name]: value } : branch
    ));
  };

  const addBranch = () => {
    const newBranch = {
      id: Date.now(),
      branchName: '',
      branchCode: '',
      branchUsername: '',
      branchPassword: ''
    };
    setBranches([...branches, newBranch]);
  };

  const removeBranch = (id) => {
    if (branches.length > 1) {
      setBranches(branches.filter(branch => branch.id !== id));
    } else {
      alert("A company must have at least one branch.");
    }
  };

  // API Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const payload = {
      company: companyDetails,
      branches: branches
    };

    try {
      // 🟢 FIX: Pull the JWT token from storage
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8080/api/admin/register-client', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 🟢 FIX: Send the token to Spring Boot to bypass the 403 error
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowSuccessModal(true);
      } else {
        const errText = await response.text();
        setErrorMessage(`Registration Failed: ${errText}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      setErrorMessage("Cannot connect to the server. Is Spring Boot running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 relative animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Register New Client Company</h2>
        <p className="text-sm text-gray-500 mt-1">Onboard a new purchaser of the FinSaaS software, configure their Master Admin, and setup their operational branches.</p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg text-sm font-bold border bg-red-50 text-red-700 border-red-200 flex items-center animate-fade-in">
          <AlertCircle className="h-5 w-5 mr-2" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: COMPANY & MASTER ADMIN */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center">
            <Building2 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-bold text-gray-800">1. Company & Master Admin Details</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Registered Company Name *</label>
              <input type="text" name="companyName" value={companyDetails.companyName} onChange={handleCompanyChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Apex Finance Ltd." required />
            </div>
            
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Tax / Registration No.</label><input type="text" name="registrationNumber" value={companyDetails.registrationNumber} onChange={handleCompanyChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase" placeholder="e.g. GSTIN or CIN" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Company Email *</label><input type="email" name="contactEmail" value={companyDetails.contactEmail} onChange={handleCompanyChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label><input type="tel" name="contactPhone" value={companyDetails.contactPhone} onChange={handleCompanyChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Headquarters Address</label><input type="text" name="companyAddress" value={companyDetails.companyAddress} onChange={handleCompanyChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" /></div>

            {/* Master Admin Login Creation */}
            <div className="md:col-span-2 mt-4 bg-blue-50/50 p-5 rounded-lg border border-blue-100">
              <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center"><Shield className="h-4 w-4 mr-1.5" /> Master Admin Login Credentials</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Master User ID *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input type="text" name="masterUsername" value={companyDetails.masterUsername} onChange={handleCompanyChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none font-mono" placeholder="admin@apex" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Master Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input type="password" name="masterPassword" value={companyDetails.masterPassword} onChange={handleCompanyChange} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none font-mono" placeholder="Set initial password" required />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: BRANCH CONFIGURATION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <GitBranch className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-bold text-gray-800">2. Branch Configurations ({branches.length})</h3>
            </div>
            <button type="button" onClick={addBranch} className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              <Plus className="h-4 w-4 mr-1" /> Add Branch
            </button>
          </div>

          <div className="p-6 space-y-6">
            {branches.map((branch, index) => (
              <div key={branch.id} className="relative p-5 border border-gray-200 rounded-xl bg-white hover:border-blue-300 transition-colors group">
                
                {branches.length > 1 && (
                  <button type="button" onClick={() => removeBranch(branch.id)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-sm" title="Remove Branch">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                <h4 className="text-sm font-bold text-gray-800 mb-4 border-b pb-2">Branch #{index + 1}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Branch Name</label><input type="text" name="branchName" value={branch.branchName} onChange={(e) => handleBranchChange(branch.id, e)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none" placeholder="e.g. Mumbai South" required /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Branch Code</label><input type="text" name="branchCode" value={branch.branchCode} onChange={(e) => handleBranchChange(branch.id, e)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none uppercase" placeholder="e.g. BR-MUM-01" required /></div>
                  
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50 p-4 rounded-lg mt-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Branch User ID *</label>
                      <input type="text" name="branchUsername" value={branch.branchUsername} onChange={(e) => handleBranchChange(branch.id, e)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none font-mono" placeholder="mumbai_mgr" required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Branch Password *</label>
                      <input type="password" name="branchPassword" value={branch.branchPassword} onChange={(e) => handleBranchChange(branch.id, e)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none font-mono" placeholder="Set branch password" required />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md transition-all disabled:opacity-70">
            {isSubmitting ? 'Registering System...' : (
              <>
                <Save className="h-5 w-5 mr-2" /> Publish Client & Branches
              </>
            )}
          </button>
        </div>
      </form>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center transform transition-all animate-fade-in">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Success!</h2>
            <p className="text-gray-500 text-center mb-8">Company and Branches added successfully!</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setCompanyDetails({
                  companyName: '', registrationNumber: '', contactEmail: '', contactPhone: '', companyAddress: '', masterUsername: '', masterPassword: ''
                });
                setBranches([
                  { id: Date.now(), branchName: 'Head Office', branchCode: 'BR-001', branchUsername: '', branchPassword: '' }
                ]);
              }}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Add Another Client
            </button>
          </div>
        </div>
      )}

    </div>
  );
}