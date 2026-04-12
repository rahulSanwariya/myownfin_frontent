import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldCheck, User, Fingerprint, CreditCard, 
  Loader2, CheckCircle, XCircle, Lock, Send, 
  FileText, Camera, AlertCircle, ChevronRight
} from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

export default function KYCVerificationModule() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  // States for API Logic
  const [isVerifying, setIsVerifying] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [txnId, setTxnId] = useState(""); 
  const [kycStatus, setKycStatus] = useState({ pan: 'pending', aadhaar: 'pending' });

  useEffect(() => {
    fetchInquiryLeads();
  }, []);

  const fetchInquiryLeads = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/customers`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      // Only show customers in 'Inquiry' stage for KYC
      setLeads(data.filter(l => l.application_status === 'Inquiry'));
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const filteredLeads = leads.filter(l => 
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.mobile?.includes(searchTerm) ||
    l.system_uniquecust_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- API ACTIONS ---

  const triggerPanApi = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`${BASE_URL}/api/kyc/verify-pan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ customerId: selectedCustomer.id, pan: selectedCustomer.applicant_pan })
      });
      if (response.ok) {
        setKycStatus(prev => ({ ...prev, pan: 'verified' }));
        alert("PAN Verified via NSDL API");
      }
    } catch (err) { alert("PAN Verification Failed"); }
    finally { setIsVerifying(false); }
  };

  const requestAadhaarOtp = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`${BASE_URL}/api/kyc/aadhaar-generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ aadhaarNumber: selectedCustomer.applicant_aadhaar })
      });
      const data = await response.json();
      if (response.ok) {
        setTxnId(data.transactionId);
        setShowOtpInput(true);
      }
    } catch (err) { alert("Could not send OTP"); }
    finally { setIsVerifying(false); }
  };

  const verifyAadhaarOtp = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`${BASE_URL}/api/kyc/aadhaar-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ otp: otpValue, transactionId: txnId, customerId: selectedCustomer.id })
      });
      if (response.ok) {
        setKycStatus(prev => ({ ...prev, aadhaar: 'verified' }));
        setShowOtpInput(false);
        alert("Aadhaar Verified Successfully!");
      }
    } catch (err) { alert("Invalid OTP"); }
    finally { setIsVerifying(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans bg-[#f8fafc] min-h-screen">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">KYC Verification Gate</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">NBFC Audit-Ready Module</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
          <input 
            type="text"
            placeholder="Search Name, Mobile or ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && filteredLeads.length > 0 && !selectedCustomer && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-2xl rounded-2xl z-50 border border-slate-100 overflow-hidden">
              {filteredLeads.map(l => (
                <div key={l.id} onClick={() => {setSelectedCustomer(l); setSearchTerm("");}} className="p-4 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-50">
                  <div>
                    <p className="font-black text-slate-800 text-sm uppercase">{l.firstName} {l.lastName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {l.system_uniquecust_id} | Mob: {l.mobile}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300"/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedCustomer ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* LEFT: CUSTOMER PROFILE & INFO */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setSelectedCustomer(null)} className="text-slate-300 hover:text-red-500 transition-colors"><XCircle size={28}/></button>
              </div>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
                  <User size={40}/>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">{selectedCustomer.firstName} {selectedCustomer.lastName}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-blue-100">{selectedCustomer.system_uniquecust_id}</span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{selectedCustomer.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataCard label="PAN Card Number" value={selectedCustomer.applicant_pan} icon={<CreditCard size={18}/>} status={kycStatus.pan}/>
                <DataCard label="Aadhaar Number" value={selectedCustomer.applicant_aadhaar} icon={<Fingerprint size={18}/>} status={kycStatus.aadhaar}/>
              </div>
            </div>

            {/* LIVE API ACTIONS PANEL */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-300 text-white">
              <div className="flex items-center gap-2 mb-8">
                <ShieldCheck className="text-blue-400" size={20}/>
                <h4 className="text-xs font-black uppercase tracking-[0.2em]">Authentication Gateway</h4>
              </div>

              {!showOtpInput ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={triggerPanApi}
                    disabled={isVerifying || kycStatus.pan === 'verified'}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-3 ${kycStatus.pan === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 hover:bg-white/20 border border-white/10'}`}
                  >
                    {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <CreditCard size={18}/>}
                    {kycStatus.pan === 'verified' ? 'PAN Verified' : 'Trigger PAN API'}
                  </button>

                  <button 
                    onClick={requestAadhaarOtp}
                    disabled={isVerifying || kycStatus.aadhaar === 'verified'}
                    className={`flex-1 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 ${kycStatus.aadhaar === 'verified' ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  >
                    {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <Fingerprint size={18}/>}
                    {kycStatus.aadhaar === 'verified' ? 'Aadhaar Verified' : 'Verify Aadhaar via OTP'}
                  </button>
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-300">
                   <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Enter 6-Digit OTP from UIDAI</p>
                      <div className="flex gap-4">
                        <input 
                          type="text" maxLength="6" placeholder="------"
                          className="flex-1 bg-slate-800 border-2 border-slate-700 rounded-xl px-6 py-4 text-2xl font-black tracking-[0.5em] focus:border-blue-500 outline-none"
                          value={otpValue} onChange={(e) => setOtpValue(e.target.value)}
                        />
                        <button onClick={verifyAadhaarOtp} className="bg-blue-600 hover:bg-blue-500 px-8 rounded-xl font-black uppercase text-xs flex items-center gap-2">
                           {isVerifying ? <Loader2 className="animate-spin"/> : <Send size={18}/>}
                           Submit
                        </button>
                      </div>
                      <button onClick={() => setShowOtpInput(false)} className="mt-4 text-[10px] font-black text-slate-500 uppercase hover:text-white transition-colors">Go Back</button>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: AUDIT & EVIDENCE LOG */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <FileText size={14}/> Audit Documentation
              </h4>
              
              <div className="space-y-6">
                <AuditItem label="Applicant Selfie" icon={<Camera size={16}/>} isMandatory={true}/>
                <AuditItem label="Bank Statements" icon={<FileText size={16}/>} isMandatory={true}/>
                
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 mt-10">
                   <div className="flex items-center gap-2 text-amber-700 mb-2">
                      <AlertCircle size={16}/>
                      <span className="text-[10px] font-black uppercase">Internal Note</span>
                   </div>
                   <p className="text-[11px] text-amber-800 leading-relaxed font-medium"> Ensure the photo returned by Aadhaar API matches the uploaded selfie for NBFC compliance.</p>
                </div>

                <button 
                  disabled={kycStatus.pan !== 'verified' || kycStatus.aadhaar !== 'verified'}
                  className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest disabled:opacity-30 shadow-xl shadow-slate-200 transition-all hover:bg-slate-800"
                >
                  Finalize KYC for Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-32 text-center">
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="text-slate-200" size={48}/>
          </div>
          <h3 className="text-slate-400 font-black uppercase tracking-widest text-sm">Select a pending inquiry to begin verification</h3>
        </div>
      )}
    </div>
  );
}

// Sub-Components
function DataCard({ label, value, icon, status }) {
  return (
    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50 relative group transition-all hover:border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest">
          {icon} {label}
        </div>
        {status === 'verified' && <CheckCircle size={16} className="text-green-500 animate-in zoom-in"/>}
      </div>
      <p className={`text-lg font-black ${status === 'verified' ? 'text-blue-700' : 'text-slate-800'}`}>{value || '---'}</p>
    </div>
  );
}

function AuditItem({ label, icon, isMandatory }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg shadow-sm text-slate-400">{icon}</div>
        <span className="text-xs font-bold text-slate-700">{label}</span>
      </div>
      <button className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-800">Upload</button>
    </div>
  );
}