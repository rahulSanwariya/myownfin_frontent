// src/pages/customers/NewCustomerForm.jsx
import { useState } from 'react';
import { 
  User, Users, UploadCloud, Camera, FileText, 
  CreditCard, Landmark, Home, Briefcase, FileSignature,
  CheckCircle, Building 
} from 'lucide-react';

export default function NewCustomerForm() {
  // UI State
  const [activeTab, setActiveTab] = useState('applicant'); 
  const [isAddressSame, setIsAddressSame] = useState(false);
  const [isNomineeAddressSame, setIsNomineeAddressSame] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [files, setFiles] = useState({});

  // Form Data State
  const [formData, setFormData] = useState({
    // Applicant Personal
    firstName: "", lastName: "", dob: "", mobile: "", altMobile: "",
    emailAddress: "", gender: "", fatherName: "", category: "", 
    maritalStatus: "", occupation: "", monthlyIncome: "",
    applicant_pan: "", applicant_aadhaar: "",requested_loan_amount:"",

    // Applicant Address
    aplicant_currentAddress: "", aplicant_city: "", aplicant_sate: "", aplicant_pinCode: "",
    aplicant_permanentAddress: "", aplicant_permCity: "", aplicant_permSate: "", aplicant_permPinCode: "",

    // Nominee Personal
    nominee_fullname: "", nominee_relation: "", nominee_dob: "", nominee_mobile: "",
    nominee_emailAddress: "", nominee_gender: "", nominee_fatherName: "", nominee_category: "",
    nominee_maritalStatus: "", nominee_occupation: "", nominee_monthlyIncome: "",
    nominee_pan: "", nominee_aadhaar: "",

    // Nominee Address
    nominee_currentAddress: "", nominee_city: "", nominee_sate: "", nominee_pinCode: "",

    // Bank Details
    bankName: "", accountNumber: "", ifscCode: "", branchName: "",
    nominee_bankName: "", nominee_accountNumber: "", nominee_ifscCode: "", nominee_branchName: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (documentId, e) => {
    const file = e.target.files[0];
    if (file) setFiles((prev) => ({ ...prev, [documentId]: file }));
  };

  




  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage(null);

  const token = localStorage.getItem('token');

  try {
    const formDataToSend = new FormData();

    // ✅ Customer JSON - Blob with application/json
    const customerBlob = new Blob([JSON.stringify(formData)], { type: 'application/json' });
    formDataToSend.append("customer", customerBlob);

    // ✅ Files append
    const selectedFiles = Object.keys(files);

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((key) => {
        const file = files[key];
        const docTypeId = getDocumentTypeId(key);
        if (!file || !docTypeId) return;
        formDataToSend.append("files", file);
        formDataToSend.append("docTypes", String(docTypeId));
      });
    }
    // ⚠️ Else block hataya — empty blob Spring me conflict karta tha

    const response = await fetch('http://localhost:8080/api/customers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
        // ⚠️ Content-Type BILKUL mat likho
      },
      body: formDataToSend
    });

    if (response.ok) {
      setShowSuccessModal(true);
    } else {
      const errText = await response.text();
      console.error("Server error:", errText);
      setSubmitMessage({ type: 'error', text: errText || 'Failed to add customer' });
    }

  } catch (error) {
    console.error("API Error:", error);
    setSubmitMessage({ type: 'error', text: 'Server error' });
  } finally {
    setIsSubmitting(false);
  }
};








const getDocumentTypeId = (key) => {
  const map = {
    docApplicantPhoto: 1,
    docPanCard: 2,
    docAadhaar: 3,
    docBankStatement: 4,
    docIncomeProof: 5,
    docCurrentAddress: 6,
    docPermanentAddress: 7,
    docNomineePhoto: 8,
    docNomineeId: 9,
    docCancelledCheque: 10
  };

  return map[key];
};

  const FileDropzone = ({ id, label, description, icon: Icon }) => (
    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-colors group">
      <input type="file" id={id} onChange={(e) => handleFileChange(id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {files[id] ? <p className="text-xs font-bold text-green-600 mb-4">{files[id].name}</p> : <p className="text-xs text-gray-500 text-center mb-4">{description}</p>}
      <button type="button" className="px-4 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 relative z-0">
        {files[id] ? 'Change File' : 'Browse Files'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl pb-8 relative">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Register New Customer Lead</h2>
        <p className="text-sm text-gray-500 mt-1">Capture comprehensive details and upload KYC documents.</p>
      </div>

      {submitMessage && submitMessage.type === 'error' && (
        <div className="mb-6 p-4 rounded-lg text-sm font-medium border bg-red-50 text-red-700 border-red-200">
          {submitMessage.text}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* 4 Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
          <button type="button" onClick={() => setActiveTab('applicant')} className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center min-w-[150px] transition-colors border-b-2 ${activeTab === 'applicant' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <User className="h-4 w-4 mr-2" /> 1. Applicant
          </button>
          <button type="button" onClick={() => setActiveTab('nominee')} className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center min-w-[150px] transition-colors border-b-2 ${activeTab === 'nominee' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Users className="h-4 w-4 mr-2" /> 2. Nominee
          </button>
          <button type="button" onClick={() => setActiveTab('bank')} className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center min-w-[150px] transition-colors border-b-2 ${activeTab === 'bank' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Building className="h-4 w-4 mr-2" /> 3. Bank Details
          </button>
          <button type="button" onClick={() => setActiveTab('documents')} className={`flex-1 py-4 px-4 text-sm font-medium flex items-center justify-center min-w-[150px] transition-colors border-b-2 ${activeTab === 'documents' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <UploadCloud className="h-4 w-4 mr-2" /> 4. Documents
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* ==========================================
              TAB 1: APPLICANT DETAILS
          ========================================== */}
          {activeTab === 'applicant' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">1. Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder='e.g. Ramesh' className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder='e.g. Kumar' className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label><input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="e.g. Suresh Kumar" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" /></div>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white" required /></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                      <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                      <option value="">Select...</option><option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option>
                    </select>
                  </div>

                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="e.g. 9876543210" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Alt Mobile Number</label><input type="tel" name="altMobile" value={formData.altMobile} onChange={handleInputChange} placeholder="e.g. 9123456789" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleInputChange} placeholder="e.g. ramesh@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" /></div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white">
                      <option value="">Select...</option><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label><input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Salaried / Self-Employed" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (₹)</label><input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. 50000" /></div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">2. KYC & Identifiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">PAN Number *</label><input type="text" name="applicant_pan" value={formData.applicant_pan} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none uppercase" placeholder="e.g. ABCDE1234F" required /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label><input type="text" name="applicant_aadhaar" value={formData.applicant_aadhaar} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. 1234 5678 9012" /></div>
                  
                   <div><label className="block text-sm font-medium text-gray-700 mb-1">requested_loan_amount</label><input type="text" name="requested_loan_amount" value={formData.requested_loan_amount} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. 60000" /></div>
                  
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">3. Address Details</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Current Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-3"><input type="text" name="aplicant_currentAddress" value={formData.aplicant_currentAddress} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. House No 42, MG Road, Near Station" /></div>
                    <input type="text" name="aplicant_city" value={formData.aplicant_city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Mumbai" />
                    <input type="text" name="aplicant_sate" value={formData.aplicant_sate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Maharashtra" />
                    <input type="text" name="aplicant_pinCode" value={formData.aplicant_pinCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. 400001" maxLength="6" />
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <input type="checkbox" id="sameAsCurrent" className="h-4 w-4 text-blue-600 rounded cursor-pointer" checked={isAddressSame} onChange={() => setIsAddressSame(!isAddressSame)} />
                  <label htmlFor="sameAsCurrent" className="ml-2 block text-sm text-gray-700 cursor-pointer">Permanent Address is the same</label>
                </div>
                {!isAddressSame && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
                    <div className="md:col-span-3"><input type="text" name="aplicant_permanentAddress" value={formData.aplicant_permanentAddress} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. House No 42, MG Road, Near Station" /></div>
                    <input type="text" name="aplicant_permCity" value={formData.aplicant_permCity} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Pune" />
                    <input type="text" name="aplicant_permSate" value={formData.aplicant_permSate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Maharashtra" />
                    <input type="text" name="aplicant_permPinCode" value={formData.aplicant_permPinCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. 411001" />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button type="button" onClick={() => setActiveTab('nominee')} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Next: Nominee Details →</button>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: NOMINEE DETAILS
          ========================================== */}
          {activeTab === 'nominee' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">Nominee Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" name="nominee_fullname" value={formData.nominee_fullname} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Priya Sharma" required /></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship *</label>
                    <select name="nominee_relation" value={formData.nominee_relation} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" required>
                      <option value="">Select...</option><option value="Spouse">Spouse</option><option value="Parent">Parent</option><option value="Child">Child</option><option value="Sibling">Sibling</option>
                    </select>
                  </div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label><input type="text" name="nominee_fatherName" value={formData.nominee_fatherName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Mahesh Sharma" /></div>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label><input type="date" name="nominee_dob" value={formData.nominee_dob} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white" required /></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select name="nominee_gender" value={formData.nominee_gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                      <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select name="nominee_maritalStatus" value={formData.nominee_maritalStatus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                      <option value="">Select...</option><option value="Single">Single</option><option value="Married">Married</option>
                    </select>
                  </div>

                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input type="tel" name="nominee_mobile" value={formData.nominee_mobile} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 9876543211" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><input type="email" name="nominee_emailAddress" value={formData.nominee_emailAddress} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. priya@example.com" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label><input type="text" name="nominee_occupation" value={formData.nominee_occupation} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. Homemaker / Business" /></div>
                  
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income</label><input type="number" name="nominee_monthlyIncome" value={formData.nominee_monthlyIncome} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 25000" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label><input type="text" name="nominee_pan" value={formData.nominee_pan} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg uppercase" placeholder="e.g. VWXYZ9876Q" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label><input type="text" name="nominee_aadhaar" value={formData.nominee_aadhaar} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="e.g. 9876 5432 1098" /></div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">Nominee Address</h3>
                <div className="flex items-center mb-4">
                  <input type="checkbox" id="nomineeSameAsApplicant" className="h-4 w-4 text-blue-600 rounded cursor-pointer" checked={isNomineeAddressSame} onChange={() => setIsNomineeAddressSame(!isNomineeAddressSame)} />
                  <label htmlFor="nomineeSameAsApplicant" className="ml-2 block text-sm text-gray-700 cursor-pointer">Same as Applicant's Current Address</label>
                </div>
                {!isNomineeAddressSame && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in">
                    <div className="md:col-span-3"><input type="text" name="nominee_currentAddress" value={formData.nominee_currentAddress} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. House No 42, MG Road, Near Station" /></div>
                    <input type="text" name="nominee_city" value={formData.nominee_city} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Mumbai" />
                    <input type="text" name="nominee_sate" value={formData.nominee_sate} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Maharashtra" />
                    <input type="text" name="nominee_pinCode" value={formData.nominee_pinCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. 400001" maxLength="6" />
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <button type="button" onClick={() => setActiveTab('applicant')} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">← Back</button>
                <button type="button" onClick={() => setActiveTab('bank')} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Next: Bank Details →</button>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: BANK DETAILS (NEW)
          ========================================== */}
          {activeTab === 'bank' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">Applicant Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label><input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. HDFC Bank" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label><input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. 50100123456789" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label><input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase" placeholder="e.g. HDFC0001234" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label><input type="text" name="branchName" value={formData.branchName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. Andheri West" /></div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-4">Nominee Bank Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label><input type="text" name="nominee_bankName" value={formData.nominee_bankName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. State Bank of India" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label><input type="text" name="nominee_accountNumber" value={formData.nominee_accountNumber} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. 30201234567" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label><input type="text" name="nominee_ifscCode" value={formData.nominee_ifscCode} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none uppercase" placeholder="e.g. SBIN0001234" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label><input type="text" name="nominee_branchName" value={formData.nominee_branchName} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" placeholder="e.g. MG Road Branch" /></div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <button type="button" onClick={() => setActiveTab('nominee')} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">← Back</button>
                <button type="button" onClick={() => setActiveTab('documents')} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Next: Document Upload →</button>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: DOCUMENT UPLOAD
          ========================================== */}
          {activeTab === 'documents' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="text-base font-semibold text-gray-900 border-b pb-2 mb-6">Mandatory & Supporting KYC Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FileDropzone id="docApplicantPhoto" label="1. Applicant Photo" description="Clear passport size photo. JPG/PNG" icon={Camera} />
                  <FileDropzone id="docPanCard" label="2. PAN Card" description="Front side of PAN card. PDF/JPG" icon={CreditCard} />
                  <FileDropzone id="docAadhaar" label="3. Aadhaar Card" description="Front and Back merged. PDF" icon={FileText} />
                  <FileDropzone id="docBankStatement" label="4. Bank Statement" description="Last 6 months. PDF (Max 10MB)" icon={Landmark} />
                  <FileDropzone id="docIncomeProof" label="5. Income Proof" description="Salary Slips or ITR. PDF" icon={Briefcase} />
                  <FileDropzone id="docCurrentAddress" label="6. Current Address Proof" description="Utility Bill / Rent Agreement" icon={Home} />
                  <FileDropzone id="docPermanentAddress" label="7. Permanent Address Proof" description="If different from Current" icon={Home} />
                  <FileDropzone id="docNomineePhoto" label="8. Nominee Photo" description="Passport size photo of Nominee" icon={Camera} />
                  <FileDropzone id="docNomineeId" label="9. Nominee ID Proof" description="Aadhaar / Voter ID / PAN" icon={Users} />
                  <FileDropzone id="docCancelledCheque" label="10. Cancelled Cheque" description="For NACH/EMI mandate setup" icon={FileSignature} />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 rounded-b-xl">
                <button type="button" onClick={() => setActiveTab('bank')} className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">← Back</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 shadow-md disabled:opacity-70">
                  {isSubmitting ? 'Sending to Server...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ==========================================
          SUCCESS MODAL (ANIMATED POPUP)
      ========================================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center transform transition-all animate-fade-in">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Success!</h2>
            <p className="text-gray-500 text-center mb-8">Customer has been successfully Added!</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                setFormData({
                  firstName: "", lastName: "", dob: "", mobile: "", altMobile: "", emailAddress: "", gender: "", fatherName: "", category: "", maritalStatus: "", occupation: "", monthlyIncome: "", applicant_pan: "", applicant_aadhaar: "",requested_loan_amount:"", aplicant_currentAddress: "", aplicant_city: "", aplicant_sate: "", aplicant_pinCode: "", aplicant_permanentAddress: "", aplicant_permCity: "", aplicant_permSate: "", aplicant_permPinCode: "", nominee_fullname: "", nominee_relation: "", nominee_dob: "", nominee_mobile: "", nominee_emailAddress: "", nominee_gender: "", nominee_fatherName: "", nominee_category: "", nominee_maritalStatus: "", nominee_occupation: "", nominee_monthlyIncome: "", nominee_pan: "", nominee_aadhaar: "", nominee_currentAddress: "", nominee_city: "", nominee_sate: "", nominee_pinCode: "", bankName: "", accountNumber: "", ifscCode: "", branchName: "", nominee_bankName: "", nominee_accountNumber: "", nominee_ifscCode: "", nominee_branchName: ""
                });
                setActiveTab('applicant');
              }}
              className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              Add Another Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}