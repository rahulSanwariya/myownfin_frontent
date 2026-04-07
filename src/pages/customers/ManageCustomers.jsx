import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Eye, Edit, X, Save, FileText, 
  Loader2, RefreshCw, UploadCloud, ImageIcon, 
  ShieldCheck, CheckCircle2, AlertCircle, MessageSquare,
  Activity, Smartphone, MapPin, Landmark, UserCheck, IndianRupee, History
} from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

const REQUIRED_DOCUMENTS = [
  "Aadhar Front", "Aadhar Back", "PAN Card", "Residence Proof", 
  "Cancelled Cheque", "Salary Slip", "Applicant Photo", "Passbook", "Other"
];

const STATUS_OPTIONS = ["Inquiry", "Inprocess", "Approved", "Disbursed", "Rejected"];

const FormField = ({ label, name, value, onChange, modalMode, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
    {modalMode === 'edit' ? (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all bg-white"
      />
    ) : (
      <p className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-700 border border-transparent min-h-[38px] flex items-center font-medium">
        {value || '—'}
      </p>
    )}
  </div>
);

export default function ManageCustomers() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // NEW: Search state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('applicant');
  const [docBlobUrls, setDocBlobUrls] = useState({});
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [replacingDocId, setReplacingDocId] = useState(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [tempStatus, setTempStatus] = useState("");

  const getToken = () => localStorage.getItem('token');

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Filter Logic for Name and PAN
  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
    const pan = (lead.applicant_pan || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || pan.includes(search);
  });

  const handleStatusUpdate = async () => {
    if (!selectedCustomer?.id || !tempStatus) return;
    setStatusUpdating(true);
    
    const payload = { 
        ...selectedCustomer, 
        application_status: tempStatus,
        correction_feedback: selectedCustomer.correction_feedback,
        approved_loan_amount: selectedCustomer.approved_loan_amount
    };

    try {
      const response = await fetch(`${BASE_URL}/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updated = await response.json();
        setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        setIsStatusModalOpen(false);
        alert(`Status & Feedback updated successfully!`);
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setStatusUpdating(false);
    }
  };

  const openStatusModal = (customer) => {
    setSelectedCustomer(customer);
    setTempStatus(customer.application_status);
    setIsStatusModalOpen(true);
  };

  const loadDocumentBlobs = useCallback(async (documents) => {
    if (!documents || documents.length === 0) return;
    setIsLoadingDocs(true);
    const blobMap = {};
    await Promise.all(
      documents.map(async (doc) => {
        try {
          const response = await fetch(
            `${BASE_URL}/api/customers/uploads/${doc.fileName}`,
            { headers: { Authorization: `Bearer ${getToken()}` } }
          );
          if (response.ok) {
            const blob = await response.blob();
            blobMap[doc.documentType?.name || doc.name] = {
              dbId: doc.id,
              url: URL.createObjectURL(blob),
              type: doc.fileType
            };
          }
        } catch (err) {
          console.error("Doc load fail", err);
        }
      })
    );
    setDocBlobUrls(blobMap);
    setIsLoadingDocs(false);
  }, []);

  const openModal = (customer, mode) => {
    Object.values(docBlobUrls).forEach(d => URL.revokeObjectURL(d.url));
    setDocBlobUrls({});
    setSelectedCustomer({ ...customer });
    setModalMode(mode);
    setActiveTab('applicant');
    setIsModalOpen(true);
    if (customer.documents?.length > 0) {
      loadDocumentBlobs(customer.documents);
    }
  };

  const closeModal = () => {
    Object.values(docBlobUrls).forEach(d => URL.revokeObjectURL(d.url));
    setDocBlobUrls({});
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!selectedCustomer?.id) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${BASE_URL}/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(selectedCustomer)
      });
      if (response.ok) {
        const updated = await response.json();
        setLeads(leads.map(lead => lead.id === updated.id ? updated : lead));
        closeModal();
        alert("Portfolio successfully updated!");
      }
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentAction = async (docName, file, existingDbId = null) => {
    if (!file) return;
    setReplacingDocId(docName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentName", docName);
    const url = existingDbId 
      ? `${BASE_URL}/api/customers/documents/${existingDbId}/replace` 
      : `${BASE_URL}/api/customers/${selectedCustomer.id}/documents/upload`;

    try {
      const response = await fetch(url, {
        method: existingDbId ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData
      });
      if (response.ok) {
        const result = await response.json();
        const newBlobUrl = URL.createObjectURL(file);
        setDocBlobUrls(prev => ({
          ...prev,
          [docName]: { dbId: result.id || existingDbId, url: newBlobUrl, type: file.type }
        }));
        alert(`${docName} Uploaded!`);
      }
    } catch (err) {
      console.error("Upload Error:", err);
    } finally {
      setReplacingDocId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-slate-50/30 font-sans">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Manage Portfolio</h2>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search name or PAN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-72 focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-sm bg-white" 
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black border-b border-slate-100">
            <tr>
              <th className="p-4">Applicant</th>
              <th className="p-4">Identity (PAN/UID)</th>
              <th className="p-4">Income</th>
              <th className="p-4 text-blue-600">Req. Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">{lead.firstName?.charAt(0)}{lead.lastName?.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-900">{lead.firstName} {lead.lastName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">#{lead.system_uniquecust_id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 uppercase font-mono">{lead.applicant_pan}</td>
                  <td className="p-4 font-bold text-slate-700">₹{lead.monthlyIncome || '0'}</td>
                  <td className="p-4 font-bold text-blue-700">₹{lead.requested_loan_amount || '0'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase shadow-sm ${
                      lead.application_status === 'Approved' ? 'bg-green-100 text-green-700' :
                      lead.application_status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {lead.application_status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-1">
                    <button onClick={() => openStatusModal(lead)} className="p-2 text-slate-400 hover:text-emerald-600 transition-all" title="View Application Tracker">
                      <Activity size={18}/>
                    </button>
                    <button onClick={() => openModal(lead, 'view')} className="p-2 text-slate-400 hover:text-blue-600 transition-all" title="Full Details"><Eye size={18}/></button>
                    <button onClick={() => openModal(lead, 'edit')} className="p-2 text-slate-400 hover:text-indigo-600 transition-all" title="Edit Lead"><Edit size={18}/></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-slate-400 text-sm italic">
                   No applicants found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* QUICK STATUS & FEEDBACK TRACKER MODAL */}
      {isStatusModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-600"/> Application Status Hub
              </h3>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1"><X size={20}/></button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 bg-white">
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-blue-100">
                    <UserCheck size={32} />
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Monitoring Status for</p>
                <p className="font-bold text-slate-800 text-3xl tracking-tight">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                <span className="mt-2 px-3 py-1 bg-slate-100 rounded-full font-mono text-[10px] text-slate-500 uppercase tracking-widest">System ID: {selectedCustomer.system_uniquecust_id}</span>
              </div>

              {/* Progress Tracker Visual */}
              <div className="bg-slate-50/50 p-10 rounded-3xl border border-slate-100 shadow-inner mb-10">
                <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-700 z-0"
                        style={{ width: `${(STATUS_OPTIONS.indexOf(selectedCustomer.application_status) / (STATUS_OPTIONS.length - 1)) * 100}%` }}
                    ></div>
                    {STATUS_OPTIONS.map((step, index) => {
                        const stepIndex = STATUS_OPTIONS.indexOf(selectedCustomer.application_status);
                        const isActive = stepIndex >= index;
                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 shadow-sm ${
                                    isActive ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-100 text-slate-300'
                                }`}>
                                    {isActive ? <CheckCircle2 size={18} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                                </div>
                                <p className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-tighter ${
                                    stepIndex === index ? 'text-blue-600 font-black' : 'text-slate-400'
                                } transition-colors`}>{step}</p>
                            </div>
                        );
                    })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Modify Application Status</label>
                        <select 
                            value={tempStatus || ""}
                            onChange={(e) => setTempStatus(e.target.value)}
                            className="w-full px-5 py-4 border-2 border-white rounded-2xl focus:border-blue-600 outline-none font-black text-slate-800 bg-white cursor-pointer uppercase text-xs transition-all shadow-sm"
                        >
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>

                    {tempStatus === 'Approved' && (
                        <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100 shadow-md animate-in slide-in-from-left-4">
                            <label className="text-[10px] font-black text-emerald-600 uppercase mb-3 block tracking-widest">Define Approved Amount</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18}/>
                                <input 
                                    type="number"
                                    name="approved_loan_amount"
                                    value={selectedCustomer.approved_loan_amount || ""}
                                    onChange={handleInputChange}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl font-black text-xl text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <History size={14} className="text-blue-500"/> Update Feedback
                    </label>
                    <textarea 
                        name="correction_feedback"
                        value={selectedCustomer.correction_feedback || ""}
                        onChange={handleInputChange}
                        placeholder="Add comments regarding this status change for the user..."
                        className="w-full px-5 py-4 border-2 border-white rounded-2xl focus:border-blue-500 outline-none text-sm bg-white min-h-[140px] shadow-sm leading-relaxed"
                    />
                    {selectedCustomer.correction_feedback && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                             <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Previous Feedback Content:</p>
                             <p className="text-xs text-blue-700 italic">"{selectedCustomer.correction_feedback}"</p>
                        </div>
                    )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50/50 flex justify-end gap-3">
                <button onClick={() => setIsStatusModalOpen(false)} className="px-8 py-3 rounded-xl border bg-white font-bold text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">Discard</button>
                <button onClick={handleStatusUpdate} disabled={statusUpdating} className="px-10 py-3 rounded-xl bg-slate-900 text-white font-bold text-[11px] uppercase shadow-lg flex items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50">
                    {statusUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Apply Status Changes
                </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN FULL-DETAILS MODAL */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-sans">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{modalMode === 'edit' ? 'Edit Portfolio' : 'Lead Details'}</h3>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{selectedCustomer.system_uniquecust_id}</span>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X /></button>
            </div>

            <div className="flex border-b border-slate-100 px-8 gap-8 overflow-x-auto bg-white scrollbar-hide">
              {['applicant', 'address', 'nominee', 'bank', 'documents', 'journey'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 whitespace-nowrap flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-white">
              {activeTab === 'applicant' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2">
                  <FormField label="First Name" name="firstName" value={selectedCustomer.firstName} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Last Name" name="lastName" value={selectedCustomer.lastName} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Father Name" name="fatherName" value={selectedCustomer.fatherName} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="DOB" name="dob" type="date" value={selectedCustomer.dob} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Gender" name="gender" value={selectedCustomer.gender} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Monthly Income" name="monthlyIncome" value={selectedCustomer.monthlyIncome} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Req. Loan Amt" name="requested_loan_amount" value={selectedCustomer.requested_loan_amount} onChange={handleInputChange} modalMode={modalMode} type="number" />
                  <FormField label="Mobile" name="mobile" value={selectedCustomer.mobile} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Email" name="emailAddress" value={selectedCustomer.emailAddress} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="PAN Card" name="applicant_pan" value={selectedCustomer.applicant_pan} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Aadhaar" name="applicant_aadhaar" value={selectedCustomer.applicant_aadhaar} onChange={handleInputChange} modalMode={modalMode} />
                </div>
              )}

              {activeTab === 'address' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-2">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><MapPin size={14}/> Current Residence</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Street Address" name="aplicant_currentAddress" value={selectedCustomer.aplicant_currentAddress} onChange={handleInputChange} modalMode={modalMode} />
                      <div className="grid grid-cols-3 gap-2">
                        <FormField label="City" name="aplicant_city" value={selectedCustomer.aplicant_city} onChange={handleInputChange} modalMode={modalMode} />
                        <FormField label="State" name="aplicant_sate" value={selectedCustomer.aplicant_sate} onChange={handleInputChange} modalMode={modalMode} />
                        <FormField label="Pincode" name="aplicant_pinCode" value={selectedCustomer.aplicant_pinCode} onChange={handleInputChange} modalMode={modalMode} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Permanent Residence</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Street Address" name="aplicant_permanentAddress" value={selectedCustomer.aplicant_permanentAddress} onChange={handleInputChange} modalMode={modalMode} />
                      <div className="grid grid-cols-3 gap-2">
                        <FormField label="City" name="aplicant_permCity" value={selectedCustomer.aplicant_permCity} onChange={handleInputChange} modalMode={modalMode} />
                        <FormField label="State" name="aplicant_permSate" value={selectedCustomer.aplicant_permSate} onChange={handleInputChange} modalMode={modalMode} />
                        <FormField label="Pincode" name="aplicant_permPinCode" value={selectedCustomer.aplicant_permPinCode} onChange={handleInputChange} modalMode={modalMode} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'nominee' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2">
                  <FormField label="Full Name" name="nominee_fullname" value={selectedCustomer.nominee_fullname} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Relation" name="nominee_relation" value={selectedCustomer.nominee_relation} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Mobile" name="nominee_mobile" value={selectedCustomer.nominee_mobile} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="PAN Card" name="nominee_pan" value={selectedCustomer.nominee_pan} onChange={handleInputChange} modalMode={modalMode} />
                  <FormField label="Aadhaar" name="nominee_aadhaar" value={selectedCustomer.nominee_aadhaar} onChange={handleInputChange} modalMode={modalMode} />
                </div>
              )}

              {activeTab === 'bank' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-3">Applicant Account</h4>
                    <FormField label="Bank Name" name="bankName" value={selectedCustomer.bankName} onChange={handleInputChange} modalMode={modalMode} />
                    <FormField label="Account No" name="accountNumber" value={selectedCustomer.accountNumber} onChange={handleInputChange} modalMode={modalMode} />
                    <FormField label="IFSC Code" name="ifscCode" value={selectedCustomer.ifscCode} onChange={handleInputChange} modalMode={modalMode} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase border-l-4 border-emerald-600 pl-3">Nominee Account</h4>
                    <FormField label="Bank Name" name="nominee_bankName" value={selectedCustomer.nominee_bankName} onChange={handleInputChange} modalMode={modalMode} />
                    <FormField label="Account No" name="nominee_accountNumber" value={selectedCustomer.nominee_accountNumber} onChange={handleInputChange} modalMode={modalMode} />
                    <FormField label="IFSC Code" name="nominee_ifscCode" value={selectedCustomer.nominee_ifscCode} onChange={handleInputChange} modalMode={modalMode} />
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in">
                  {REQUIRED_DOCUMENTS.map((docName) => {
                    const blobData = docBlobUrls[docName];
                    const hasFile = !!blobData;
                    return (
                      <div key={docName} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm relative group">
                        <div className="h-40 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                          {isLoadingDocs ? <Loader2 className="animate-spin text-slate-200" size={24} /> : 
                           hasFile ? (blobData.type?.startsWith('image/') ? <img src={blobData.url} className="w-full h-full object-cover" alt={docName} /> : <FileText className="text-blue-500" size={40} />) :
                           <div className="flex flex-col items-center text-slate-200"><ImageIcon size={48} /><span className="text-[10px] font-black mt-2 uppercase">Missing</span></div>}
                        </div>
                        <div className="p-3 bg-white border-t border-slate-50">
                          <p className="text-[10px] font-black text-slate-700 uppercase truncate mb-3">{docName}</p>
                          <div className="flex gap-2">
                            {hasFile && <a href={blobData.url} target="_blank" rel="noreferrer" className="flex-1 text-center py-1.5 bg-slate-50 rounded-lg text-[10px] font-black uppercase flex items-center justify-center gap-1 shadow-sm"><Eye size={12}/> View</a>}
                            {modalMode === 'edit' && (
                              <label className="flex-1 text-center py-1.5 rounded-lg text-[10px] font-black uppercase cursor-pointer flex items-center justify-center gap-1 shadow-sm bg-blue-600 text-white">
                                <UploadCloud size={12}/> {hasFile ? 'Replace' : 'Upload'}
                                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => handleDocumentAction(docName, e.target.files[0], blobData?.dbId)} />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'journey' && (
                <div className="space-y-12 animate-in fade-in">
                  <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-inner">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 text-center">Journey Roadmap</h4>
                    <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-700 z-0"
                            style={{ width: `${(STATUS_OPTIONS.indexOf(selectedCustomer.application_status) / (STATUS_OPTIONS.length - 1)) * 100}%` }}
                        ></div>
                        {STATUS_OPTIONS.map((step, index) => {
                            const stepIndex = STATUS_OPTIONS.indexOf(selectedCustomer.application_status);
                            const isActive = stepIndex >= index;
                            return (
                                <div key={step} className="relative z-10 flex flex-col items-center">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-500 border-4 shadow-sm ${
                                        isActive ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-slate-100 text-slate-200'
                                    }`}>
                                        {isActive ? <CheckCircle2 size={18} /> : <div className="h-2 w-2 rounded-full bg-current" />}
                                    </div>
                                    <p className="absolute -bottom-10 whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400">{step}</p>
                                </div>
                            );
                        })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">LifeCycle Status</label>
                            <select 
                                name="application_status"
                                value={selectedCustomer.application_status || ""}
                                disabled={modalMode !== 'edit'}
                                onChange={(e) => handleInputChange({ target: { name: 'application_status', value: e.target.value }})}
                                className="w-full px-5 py-4 border-2 border-white rounded-2xl outline-none font-black text-slate-800 bg-white cursor-pointer uppercase text-xs shadow-sm transition-all focus:border-blue-500"
                            >
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </div>

                        {selectedCustomer.application_status === 'Approved' && (
                            <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100 shadow-md animate-in slide-in-from-left-4">
                                <label className="text-[10px] font-black text-emerald-600 uppercase mb-3 block tracking-widest">Approved Loan Amount</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18}/>
                                    <input 
                                        type="number"
                                        name="approved_loan_amount"
                                        value={selectedCustomer.approved_loan_amount || ""}
                                        onChange={handleInputChange}
                                        disabled={modalMode !== 'edit'}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl font-black text-xl text-emerald-700 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare size={14}/> {modalMode === 'edit' ? 'Update Feedback' : 'Last Sent Feedback'}
                        </label>
                        {modalMode === 'edit' ? (
                          <textarea
                            name="correction_feedback"
                            value={selectedCustomer.correction_feedback || ''}
                            onChange={handleInputChange}
                            className="w-full px-5 py-4 border border-slate-100 rounded-3xl min-h-[180px] shadow-sm text-sm outline-none focus:border-blue-500 bg-slate-50/50"
                          />
                        ) : (
                          <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl min-h-[180px] flex flex-col">
                            <div className="flex-1 text-sm italic text-slate-600 leading-relaxed border-l-4 border-blue-400 pl-4 bg-white/50 p-4 rounded-r-xl shadow-sm">
                                {selectedCustomer.correction_feedback || "No feedback has been sent for this application yet."}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <AlertCircle size={12}/> Customer is viewing this message
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-5 border-t bg-slate-50/50 flex justify-end gap-3">
              <button onClick={closeModal} className="px-6 py-2 rounded-xl border bg-white font-bold text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">Discard</button>
              {modalMode === 'edit' && (
                <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-2 rounded-xl bg-blue-600 text-white font-bold text-[11px] uppercase shadow-lg flex items-center gap-2 hover:bg-blue-700 transition-all">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Portfolio
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}