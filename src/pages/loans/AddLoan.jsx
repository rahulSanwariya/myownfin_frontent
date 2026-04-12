import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, Percent, Calendar, Save, UserSearch, FilePlus, ArrowRight, ArrowLeft,
  TrendingUp, CheckCircle2, FileText, Upload, Trash2, UserPlus, Check, Building2, Landmark, 
  ShieldCheck, Briefcase, Fingerprint, Receipt, Info, Search, Mail, Phone, MapPin, Globe
} from 'lucide-react';

export default function AddLoan() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null); // Step 1 Context
  
  // State strictly mapped to ALL PersonalLoanEntity fields
  const [loanData, setLoanData] = useState({
    customerId: '', customerCode: '', loanNo: `LN-${Date.now()}`,
    idProof: 'Aadhar Card', fileChargeAmount: '', loanAmount: '',
    interest: '', terms: '', frequency: 'Monthly', emi: 0,
    primaryGuarantor: '', secondaryGuarantor: '',
    status: 'PENDING', paidStatus: 'UNPAID', discount: '0',
    emiType: 'Reducing', planNo: '', emiPayMode: 'ECS',
    remark: '', processingCharge: '',
    // Applicant Bank
    applicantChqNo: '', applicantAccNo: '', applicantBankName: '', applicantBankBranch: '', applicantBankIfsc: '',
    // Nominee Bank
    nomineeChqNo: '', nomineeAccNo: '', nomineeBankName: '', nomineeBankBranch: '', nomineeBankIfsc: '',
    // Primary Guarantor Bank
    pgChqNo: '', pgAccNo: '', pgBankName: '', pgBankBranch: '', pgBankIfsc: '',
    // Secondary Guarantor Bank
    sgChqNo: '', sgAccNo: '', sgBankName: '', sgBankBranch: '', sgBankIfsc: '',
  });

  const steps = [
    { id: 1, name: 'Identity', icon: UserSearch },
    { id: 2, name: 'Loan Info', icon: IndianRupee },
    { id: 3, name: 'Applicant Bank', icon: Landmark },
    { id: 4, name: 'Guarantor Net', icon: ShieldCheck },
    { id: 5, name: 'Final Review', icon: FileText }
  ];

  // Logic: Real-time EMI Calculation
  useEffect(() => {
    const P = parseFloat(loanData.loanAmount), r = (parseFloat(loanData.interest) / 12) / 100, n = parseInt(loanData.terms);
    if (P > 0 && r > 0 && n > 0) {
      const emiCalc = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setLoanData(prev => ({ ...prev, emi: emiCalc.toFixed(2) }));
    }
  }, [loanData.loanAmount, loanData.interest, loanData.terms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-[1500px] mx-auto p-4 animate-in fade-in duration-700">
      
      {/* 1. COMPACT HORIZONTAL STEPPER */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-6 max-w-2xl mx-auto">
        <div className="relative flex justify-between items-center px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500 -z-10"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <button 
                onClick={() => (selectedEmp || step.id === 1) && setCurrentStep(step.id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border-2 
                  ${currentStep > step.id ? 'bg-emerald-500 border-emerald-200 text-white' : 
                    currentStep === step.id ? 'bg-blue-600 border-blue-200 text-white scale-110 shadow-lg' : 
                    'bg-white border-slate-100 text-slate-300'}`}
              >
                {currentStep > step.id ? <Check size={16} strokeWidth={3} /> : <step.icon size={16} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 2. MAIN FORM WORKSPACE */}
        <div className="lg:col-span-9 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm relative min-h-[650px] pb-32">
          
          {/* STEP 1: EMPLOYEE SELECTION & FULL VIEW */}
          {currentStep === 1 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <SectionHeader title="Employee Verification" icon={<Search size={20}/>} />
              
              {!selectedEmp ? (
                <div className="mt-12 max-w-xl mx-auto text-center">
                  <div className="relative group">
                    <Search className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder="Search Employee by Name, Code or Mobile..."
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl font-bold text-lg outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all border-none"
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setShowDropdown(true);}}
                    />
                    {showDropdown && searchTerm.length > 2 && (
                       <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 shadow-2xl rounded-3xl z-50 overflow-hidden divide-y divide-slate-50">
                          {['Vijay Singh', 'Rahul Sharma'].map(name => (
                            <div key={name} onClick={() => {setSelectedEmp({name, code: 'EMP-102', mobile: '8273353154', branch: 'Runkata Branch', dept: 'Operations'}); setShowDropdown(false);}} className="p-5 hover:bg-blue-50 cursor-pointer flex justify-between items-center group">
                               <div className="text-left">
                                  <p className="font-black text-slate-700 uppercase group-hover:text-blue-600 transition-colors">{name}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">CODE: EMP-102 • DEPT: Operations</p>
                               </div>
                               <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                          ))}
                       </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 animate-in zoom-in-95">
                   <div className="md:col-span-4 bg-slate-50 p-8 rounded-[2.5rem] text-center flex flex-col items-center">
                      <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.2rem] flex items-center justify-center text-4xl font-black mb-4 shadow-xl shadow-blue-100">
                         {selectedEmp.name[0]}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedEmp.name}</h3>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em] mt-1">{selectedEmp.dept}</p>
                      <button onClick={() => setSelectedEmp(null)} className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-red-500 bg-white border border-red-100 px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all">
                        <Trash2 size={12}/> Select Different Employee
                      </button>
                   </div>
                   <div className="md:col-span-8 grid grid-cols-2 gap-4">
                      <DetailCard icon={<Fingerprint/>} label="Employee Code" value={selectedEmp.code} />
                      <DetailCard icon={<Phone/>} label="Contact Number" value={selectedEmp.mobile} />
                      <DetailCard icon={<MapPin/>} label="Branch Name" value={selectedEmp.branch} />
                      <DetailCard icon={<Globe/>} label="ID Proof Provided" value="Aadhar (Verified)" />
                      <DetailCard icon={<Briefcase/>} label="Employment Type" value="Permanent" />
                      <DetailCard icon={<ShieldCheck/>} label="Status" value="Active / Loan Eligible" color="text-emerald-600" />
                   </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: LOAN CONFIGURATION */}
          {currentStep === 2 && (
            <div className="animate-in slide-in-from-bottom-2">
              <SectionHeader title="Loan Financials" icon={<IndianRupee size={20}/>} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <FormInput label="Loan Amount" name="loanAmount" value={loanData.loanAmount} onChange={handleChange} icon={<IndianRupee size={14}/>} />
                <FormInput label="Interest Rate (%)" name="interest" value={loanData.interest} onChange={handleChange} icon={<Percent size={14}/>} />
                <FormInput label="Terms (Months)" name="terms" value={loanData.terms} onChange={handleChange} icon={<Calendar size={14}/>} />
                <FormInput label="File Charge Amount" name="fileChargeAmount" value={loanData.fileChargeAmount} onChange={handleChange} />
                <FormInput label="Processing Charge" name="processingCharge" value={loanData.processingCharge} onChange={handleChange} />
                <FormInput label="Discount Amount" name="discount" value={loanData.discount} onChange={handleChange} />
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest">EMI Type</label>
                  <select name="emiType" value={loanData.emiType} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none border-r-[16px] border-transparent">
                    <option>Reducing</option>
                    <option>Flat</option>
                  </select>
                </div>
                <FormInput label="Frequency" name="frequency" value={loanData.frequency} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* STEP 3: BANKING (APPLICANT & NOMINEE) */}
          {currentStep === 3 && (
            <div className="animate-in slide-in-from-bottom-2 space-y-10">
              <div>
                <SectionHeader title="Applicant Bank Details" icon={<Building2 size={20}/>} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <FormInput label="Bank Name" name="applicantBankName" value={loanData.applicantBankName} onChange={handleChange} />
                  <FormInput label="Account Number" name="applicantAccNo" value={loanData.applicantAccNo} onChange={handleChange} />
                  <FormInput label="IFSC Code" name="applicantBankIfsc" value={loanData.applicantBankIfsc} onChange={handleChange} />
                  <FormInput label="Bank Branch" name="applicantBankBranch" value={loanData.applicantBankBranch} onChange={handleChange} />
                  <FormInput label="Cheque Number" name="applicantChqNo" value={loanData.applicantChqNo} onChange={handleChange} />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-8">
                <SectionHeader title="Nominee Bank Details" icon={<UserPlus size={20}/>} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <FormInput label="Bank Name" name="nomineeBankName" value={loanData.nomineeBankName} onChange={handleChange} />
                  <FormInput label="Account No" name="nomineeAccNo" value={loanData.nomineeAccNo} onChange={handleChange} />
                  <FormInput label="IFSC Code" name="nomineeBankIfsc" value={loanData.nomineeBankIfsc} onChange={handleChange} />
                  <FormInput label="Bank Branch" name="nomineeBankBranch" value={loanData.nomineeBankBranch} onChange={handleChange} />
                  <FormInput label="Cheque No" name="nomineeChqNo" value={loanData.nomineeChqNo} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: GUARANTORS (PRIMARY & SECONDARY) */}
          {currentStep === 4 && (
            <div className="animate-in slide-in-from-bottom-2 space-y-10">
              <div>
                <SectionHeader title="Primary Guarantor (PG)" icon={<ShieldCheck size={20}/>} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <FormInput label="Guarantor Name" name="primaryGuarantor" value={loanData.primaryGuarantor} onChange={handleChange} />
                  <FormInput label="Bank Name" name="pgBankName" value={loanData.pgBankName} onChange={handleChange} />
                  <FormInput label="Account No" name="pgAccNo" value={loanData.pgAccNo} onChange={handleChange} />
                  <FormInput label="IFSC Code" name="pgBankIfsc" value={loanData.pgBankIfsc} onChange={handleChange} />
                  <FormInput label="Cheque No" name="pgChqNo" value={loanData.pgChqNo} onChange={handleChange} />
                </div>
              </div>
              <div className="border-t border-slate-100 pt-8">
                <SectionHeader title="Secondary Guarantor (SG)" icon={<ShieldCheck size={20}/>} />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <FormInput label="Guarantor Name" name="secondaryGuarantor" value={loanData.secondaryGuarantor} onChange={handleChange} />
                  <FormInput label="Bank Name" name="sgBankName" value={loanData.sgBankName} onChange={handleChange} />
                  <FormInput label="Account No" name="sgAccNo" value={loanData.sgAccNo} onChange={handleChange} />
                  <FormInput label="IFSC Code" name="sgBankIfsc" value={loanData.sgBankIfsc} onChange={handleChange} />
                  <FormInput label="Cheque No" name="sgChqNo" value={loanData.sgChqNo} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL REVIEW */}
          {currentStep === 5 && (
            <div className="animate-in slide-in-from-bottom-2">
              <SectionHeader title="Final Review & Remarks" icon={<FileText size={20}/>} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                <FormInput label="Plan Number" name="planNo" value={loanData.planNo} onChange={handleChange} />
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest">EMI Pay Mode</label>
                  <select name="emiPayMode" value={loanData.emiPayMode} onChange={handleChange} className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none">
                    <option>ECS / NACH</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block ml-1 tracking-widest">Case Remark / Reason</label>
                  <textarea name="remark" value={loanData.remark} onChange={handleChange} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-xs min-h-[120px] outline-none border-none" placeholder="Enter reason for loan application or additional notes..."></textarea>
                </div>
              </div>
            </div>
          )}

          {/* FIXED ACTION BUTTONS (Anchored to form bottom) */}
          <div className="absolute bottom-10 left-8 right-8 flex justify-between items-center pt-8 border-t border-slate-50 bg-white">
            <button 
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
            >
              <ArrowLeft size={16}/> Previous Step
            </button>
            
            <button 
              disabled={currentStep === 1 && !selectedEmp}
              onClick={() => currentStep < 5 ? setCurrentStep(currentStep + 1) : alert("Application Sent for Maker-Checker Approval!")}
              className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
            >
              {currentStep === 5 ? 'Submit Application' : 'Next Section'} <ArrowRight size={16}/>
            </button>
          </div>
        </div>

        {/* 3. STICKY EMI & STATUS SUMMARY (RIGHT) */}
        <div className="lg:col-span-3 sticky top-6 space-y-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute -right-10 -top-10 h-32 w-32 bg-blue-500/10 rounded-full blur-3xl"></div>
             <div className="text-center mb-8 border-b border-white/10 pb-8">
                <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Monthly Installment</p>
                <h2 className="text-4xl font-black tracking-tighter">₹{loanData.emi}</h2>
             </div>
             <div className="space-y-4 relative z-10">
                <SummaryRow label="Principal" value={`₹${loanData.loanAmount || 0}`} />
                <SummaryRow label="Interest" value={`${loanData.interest || 0}%`} />
                <SummaryRow label="Duration" value={`${loanData.terms || 0} Mo.`} />
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sys Status</span>
                  <span className="text-[9px] font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg">ACTIVE</span>
                </div>
             </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex gap-4">
            <Info size={24} className="text-blue-600 shrink-0 mt-1"/>
            <p className="text-[10px] font-bold text-blue-900/60 leading-relaxed uppercase">
              Application linked to <span className="text-blue-600 font-black">{selectedEmp?.name || 'Waiting...'}</span>. Data is encrypted and RBI compliant.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// UI SUB-COMPONENTS
function DetailCard({ icon, label, value, color }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-transparent hover:border-slate-200 transition-all">
      <div className="text-slate-300">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-xs font-black uppercase ${color || 'text-slate-800'}`}>{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3 border-l-4 border-blue-600 pl-5 py-1">
      <span className="text-blue-600">{icon}</span>
      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h4>
    </div>
  );
}

function FormInput({ label, icon, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
            {icon}
          </div>
        )}
        <input 
          {...props}
          className={`w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-xs outline-none focus:bg-white focus:border-blue-50 transition-all ${icon ? 'pl-12' : ''}`}
        />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center text-[11px]">
      <span className="font-black text-slate-500 uppercase tracking-tighter">{label}</span>
      <span className="font-black text-slate-100">{value}</span>
    </div>
  );
}