import React, { useState, useEffect } from 'react';
import { 
  IndianRupee, Percent, Calendar, Save, UserSearch, FilePlus, ArrowRight, ArrowLeft,
  TrendingUp, CheckCircle2, FileText, Upload, Trash2, UserPlus, Check, Building2, Landmark, 
  ShieldCheck, Briefcase, Fingerprint, Receipt, Info, Search, Mail, Phone, MapPin, Globe,
  AlertCircle, CheckCircle, Loader2, X
} from 'lucide-react';

const BASE_URL = 'http://localhost:8080';

export default function AddLoan() {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Step 1 Context
  const [customers, setCustomers] = useState([]); // Fetched customers
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  
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

  // Fetch customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);
const fetchCustomers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/customers/getCustomer/1/1`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setCustomers(data);
    } else {
      // Fallback to dummy data if API fails
      setCustomers([
        { id: 'CUST-001', name: 'John Doe', code: 'CUST-001', mobile: '9876543210', branch: 'Main Branch' },
        { id: 'CUST-002', name: 'Jane Smith', code: 'CUST-002', mobile: '9876543211', branch: 'Central Branch' },
        { id: 'CUST-003', name: 'Bob Johnson', code: 'CUST-003', mobile: '9876543212', branch: 'West Branch' }
      ]);
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    // Fallback to dummy data
    setCustomers([
      { id: 'CUST-001', name: 'John Doe', code: 'CUST-001', mobile: '9876543210', branch: 'Main Branch' },
      { id: 'CUST-002', name: 'Jane Smith', code: 'CUST-002', mobile: '9876543211', branch: 'Central Branch' },
      { id: 'CUST-003', name: 'Bob Johnson', code: 'CUST-003', mobile: '9876543212', branch: 'West Branch' }
    ]);
  }
};
  // Filter customers based on search
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = customers.filter(cust =>
        cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cust.mobile.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchTerm, customers]);

  // Real-time EMI Calculation with validation
  useEffect(() => {
    const P = parseFloat(loanData.loanAmount) || 0;
    const annualRate = parseFloat(loanData.interest) || 0;
    const n = parseInt(loanData.terms) || 0;
    
    if (P > 0 && annualRate > 0 && n > 0) {
      const monthlyRate = (annualRate / 12) / 100;
      try {
        if (monthlyRate === 0) {
          // Simple interest if rate is 0
          const emi = P / n;
          setLoanData(prev => ({ ...prev, emi: emi.toFixed(2) }));
        } else {
          const numerator = P * monthlyRate * Math.pow(1 + monthlyRate, n);
          const denominator = Math.pow(1 + monthlyRate, n) - 1;
          const emi = numerator / denominator;
          setLoanData(prev => ({ ...prev, emi: emi.toFixed(2) }));
        }
      } catch (err) {
        console.error("EMI Calculation error:", err);
      }
    } else {
      setLoanData(prev => ({ ...prev, emi: 0 }));
    }
  }, [loanData.loanAmount, loanData.interest, loanData.terms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation Functions
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1 && !selectedCustomer) {
      newErrors.customer = 'Please select a customer first';
    }

    if (step === 2) {
      if (!loanData.loanAmount || parseFloat(loanData.loanAmount) <= 0) {
        newErrors.loanAmount = 'Loan amount must be greater than 0';
      }
      if (!loanData.interest || parseFloat(loanData.interest) < 0) {
        newErrors.interest = 'Interest rate is required';
      }
      if (!loanData.terms || parseInt(loanData.terms) <= 0) {
        newErrors.terms = 'Terms must be greater than 0';
      }
    }

    if (step === 3) {
      if (!loanData.applicantBankName) newErrors.applicantBankName = 'Bank name required';
      if (!loanData.applicantAccNo) newErrors.applicantAccNo = 'Account number required';
      if (!isValidIFSC(loanData.applicantBankIfsc)) newErrors.applicantBankIfsc = 'Invalid IFSC format (11 chars)';
    }

    if (step === 5) {
      if (!loanData.primaryGuarantor) newErrors.primaryGuarantor = 'Primary guarantor required';
      if (!loanData.remark) newErrors.remark = 'Please add case remark';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidIFSC = (ifsc) => {
    // IFSC should be 11 characters: 4 letters, 0, 6 digits/letters
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  };

  const handleSubmitLoan = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const payload = {
        ...loanData,
        customerId: selectedCustomer?.id,
        customerCode: selectedCustomer?.code,
      };

      const response = await fetch(`${BASE_URL}/api/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        showToast('Loan application submitted successfully!', 'success');
        // Reset form
        setTimeout(() => {
          setCurrentStep(1);
          setSelectedCustomer(null);
          setLoanData({
            customerId: '', customerCode: '', loanNo: `LN-${Date.now()}`,
            idProof: 'Aadhar Card', fileChargeAmount: '', loanAmount: '',
            interest: '', terms: '', frequency: 'Monthly', emi: 0,
            primaryGuarantor: '', secondaryGuarantor: '',
            status: 'PENDING', paidStatus: 'UNPAID', discount: '0',
            emiType: 'Reducing', planNo: '', emiPayMode: 'ECS',
            remark: '', processingCharge: '',
            applicantChqNo: '', applicantAccNo: '', applicantBankName: '', applicantBankBranch: '', applicantBankIfsc: '',
            nomineeChqNo: '', nomineeAccNo: '', nomineeBankName: '', nomineeBankBranch: '', nomineeBankIfsc: '',
            pgChqNo: '', pgAccNo: '', pgBankName: '', pgBankBranch: '', pgBankIfsc: '',
            sgChqNo: '', sgAccNo: '', sgBankName: '', sgBankBranch: '', sgBankIfsc: '',
          });
        }, 2000);
      } else {
        const errText = await response.text();
        showToast(errText || 'Failed to submit loan application', 'error');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      showToast('Server connection error', 'error');
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
                onClick={() => (selectedCustomer || step.id === 1) && setCurrentStep(step.id)}
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
          
          {/* STEP 1: CUSTOMER SELECTION & FULL VIEW */}
          {currentStep === 1 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <SectionHeader title="Customer Selection" icon={<Search size={20}/>} />
              
              {errors.customer && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="text-red-600 shrink-0" size={20} />
                  <span className="text-red-700 text-sm font-bold">{errors.customer}</span>
                </div>
              )}
              
              {!selectedCustomer ? (
                <div className="mt-12 max-w-xl mx-auto text-center">
                  <div className="relative group">
                    <Search className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      placeholder="Search Customer by Name, Code or Mobile..."
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-3xl font-bold text-lg outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all border-none"
                      value={searchTerm}
                      onChange={(e) => {setSearchTerm(e.target.value); setShowDropdown(true);}}
                    />
                    {showDropdown && searchTerm.length > 1 && (
                       <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-100 shadow-2xl rounded-3xl z-50 overflow-hidden divide-y divide-slate-50 max-h-64 overflow-y-auto">
                          {filteredCustomers.length > 0 ? (
                            filteredCustomers.map(cust => (
                              <div key={cust.id} onClick={() => {setSelectedCustomer(cust); setShowDropdown(false); setSearchTerm("");}} className="p-5 hover:bg-blue-50 cursor-pointer flex justify-between items-center group">
                                 <div className="text-left">
                                    <p className="font-black text-slate-700 uppercase group-hover:text-blue-600 transition-colors">{cust.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">CODE: {cust.code} • BRANCH: {cust.branch}</p>
                                 </div>
                                 <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                              </div>
                            ))
                          ) : (
                            <div className="p-5 text-slate-500 text-center">No customers found</div>
                          )}
                       </div>
                    )}
                  </div>
                </div>
              ) : (
                // Selected Customer Display
                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-black text-slate-800">Selected Customer</h3>
                      <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-bold text-slate-600">Name:</span> {selectedCustomer.name}</div>
                      <div><span className="font-bold text-slate-600">Code:</span> {selectedCustomer.code}</div>
                      <div><span className="font-bold text-slate-600">Mobile:</span> {selectedCustomer.mobile}</div>
                      <div><span className="font-bold text-slate-600">Branch:</span> {selectedCustomer.branch}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: LOAN INFORMATION */}
          {currentStep === 2 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <SectionHeader title="Loan Information" icon={<IndianRupee size={20}/>} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <FormField label="Loan Amount" name="loanAmount" value={loanData.loanAmount} onChange={handleChange} placeholder="Enter loan amount" icon={<IndianRupee />} error={errors.loanAmount} />
                <FormField label="Interest Rate (%)" name="interest" value={loanData.interest} onChange={handleChange} placeholder="Enter interest rate" icon={<Percent />} error={errors.interest} />
                <FormField label="Terms (Months)" name="terms" value={loanData.terms} onChange={handleChange} placeholder="Enter loan terms" icon={<Calendar />} error={errors.terms} />
                <FormField label="EMI Amount" name="emi" value={loanData.emi} onChange={handleChange} placeholder="Auto-calculated" icon={<TrendingUp />} readOnly />
                <FormField label="File Charge Amount" name="fileChargeAmount" value={loanData.fileChargeAmount} onChange={handleChange} placeholder="Enter file charge" icon={<Receipt />} />
                <FormField label="Processing Charge" name="processingCharge" value={loanData.processingCharge} onChange={handleChange} placeholder="Enter processing charge" icon={<Receipt />} />
              </div>
            </div>
          )}

          {/* STEP 3: APPLICANT BANK DETAILS */}
          {currentStep === 3 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <SectionHeader title="Applicant Bank Details" icon={<Landmark size={20}/>} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <FormField label="Bank Name" name="applicantBankName" value={loanData.applicantBankName} onChange={handleChange} placeholder="Enter bank name" icon={<Building2 />} error={errors.applicantBankName} />
                <FormField label="Account Number" name="applicantAccNo" value={loanData.applicantAccNo} onChange={handleChange} placeholder="Enter account number" icon={<Receipt />} error={errors.applicantAccNo} />
                <FormField label="Branch" name="applicantBankBranch" value={loanData.applicantBankBranch} onChange={handleChange} placeholder="Enter branch name" icon={<MapPin />} />
                <FormField label="IFSC Code" name="applicantBankIfsc" value={loanData.applicantBankIfsc} onChange={handleChange} placeholder="Enter IFSC code" icon={<Globe />} error={errors.applicantBankIfsc} />
                <FormField label="Cheque Number" name="applicantChqNo" value={loanData.applicantChqNo} onChange={handleChange} placeholder="Enter cheque number" icon={<Receipt />} />
              </div>
            </div>
          )}

          {/* STEP 4: GUARANTOR NETWORK */}
          {currentStep === 4 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <SectionHeader title="Guarantor Network" icon={<ShieldCheck size={20}/>} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <FormField label="Primary Guarantor" name="primaryGuarantor" value={loanData.primaryGuarantor} onChange={handleChange} placeholder="Enter primary guarantor" icon={<UserPlus />} error={errors.primaryGuarantor} />
                <FormField label="Secondary Guarantor" name="secondaryGuarantor" value={loanData.secondaryGuarantor} onChange={handleChange} placeholder="Enter secondary guarantor" icon={<UserPlus />} />
              </div>
            </div>
          )}

          {/* STEP 5: FINAL REVIEW */}
          {currentStep === 5 && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <SectionHeader title="Final Review" icon={<FileText size={20}/>} />
              
              <div className="mt-8 space-y-6">
                <ReviewSection title="Customer Details" data={{
                  'Customer Name': selectedCustomer?.name,
                  'Customer Code': selectedCustomer?.code,
                  'Mobile': selectedCustomer?.mobile
                }} />
                <ReviewSection title="Loan Details" data={{
                  'Loan Number': loanData.loanNo,
                  'Loan Amount': `₹${loanData.loanAmount}`,
                  'Interest Rate': `${loanData.interest}%`,
                  'Terms': `${loanData.terms} months`,
                  'EMI': `₹${loanData.emi}`,
                  'File Charge': `₹${loanData.fileChargeAmount}`,
                  'Processing Charge': `₹${loanData.processingCharge}`
                }} />
                <ReviewSection title="Bank Details" data={{
                  'Bank Name': loanData.applicantBankName,
                  'Account Number': loanData.applicantAccNo,
                  'Branch': loanData.applicantBankBranch,
                  'IFSC': loanData.applicantBankIfsc
                }} />
                <ReviewSection title="Guarantors" data={{
                  'Primary': loanData.primaryGuarantor,
                  'Secondary': loanData.secondaryGuarantor
                }} />
                <div className="mt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Case Remark</label>
                  <textarea 
                    name="remark" 
                    value={loanData.remark} 
                    onChange={handleChange} 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-50 transition-all resize-none" 
                    rows="4" 
                    placeholder="Enter case remark..."
                  />
                  {errors.remark && <p className="text-red-600 text-sm mt-1">{errors.remark}</p>}
                </div>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft size={18} />
              Previous
            </button>
            
            {currentStep < 5 ? (
              <button 
                onClick={() => validateStep(currentStep) && setCurrentStep(prev => prev + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all"
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setShowConfirmModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all"
              >
                <Save size={18} />
                Submit Loan
              </button>
            )}
          </div>
        </div>

        {/* 3. SUMMARY SIDEBAR */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6">Loan Summary</h3>
          
          <div className="space-y-4">
            <SummaryItem label="Customer" value={selectedCustomer ? selectedCustomer.name : 'Not selected'} />
            <SummaryItem label="Loan Amount" value={loanData.loanAmount ? `₹${loanData.loanAmount}` : 'Not set'} />
            <SummaryItem label="Interest Rate" value={loanData.interest ? `${loanData.interest}%` : 'Not set'} />
            <SummaryItem label="Terms" value={loanData.terms ? `${loanData.terms} months` : 'Not set'} />
            <SummaryItem label="EMI" value={loanData.emi ? `₹${loanData.emi}` : 'Not calculated'} />
            <SummaryItem label="Status" value="Draft" />
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl max-w-md mx-4">
            <h3 className="text-xl font-black text-slate-800 mb-4">Confirm Submission</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to submit this loan application? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmitLoan} disabled={isSubmitting} className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all">
                {isSubmitting ? <Loader2 size={18} className="animate-spin mx-auto" /> : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed bottom-8 right-8 p-4 rounded-2xl shadow-lg z-50 flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// Helper Components
const SectionHeader = ({ title, icon }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
      {icon}
    </div>
    <h2 className="text-2xl font-black text-slate-800">{title}</h2>
  </div>
);

const FormField = ({ label, name, value, onChange, placeholder, icon, error, readOnly = false }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
      <input 
        type="text" 
        name={name} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        readOnly={readOnly}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-blue-50 transition-all ${readOnly ? 'cursor-not-allowed' : ''}`}
      />
    </div>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const ReviewSection = ({ title, data }) => (
  <div className="bg-slate-50 p-4 rounded-2xl">
    <h4 className="font-bold text-slate-800 mb-3">{title}</h4>
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex justify-between text-sm">
          <span className="text-slate-600">{key}:</span>
          <span className="font-bold text-slate-800">{value || 'Not provided'}</span>
        </div>
      ))}
    </div>
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-slate-600 text-sm">{label}</span>
    <span className="font-bold text-slate-800 text-sm">{value}</span>
  </div>
);