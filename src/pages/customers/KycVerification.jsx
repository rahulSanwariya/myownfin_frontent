import React, { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  User,
  Fingerprint,
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  Camera,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchKycLeads,
  verifyPan,
  requestAadhaarOtp,
  verifyAadhaarOtp,
  setSelectedCustomer,
  clearSelectedCustomer,
  cancelOtpFlow,
} from "../../feature/kyc/kycSlice";

export default function KYCVerificationModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [otpValue, setOtpValue] = useState("");

  const dispatch = useDispatch();

  const {
    leads,
    selectedCustomer,
    kycStatus,
    showOtpInput,
    txnId,
    isLoading,
    error,
  } = useSelector((state) => state.kyc);

  useEffect(() => {
    dispatch(fetchKycLeads());
  }, [dispatch]);

  const filteredLeads = leads.filter(
    (l) =>
      `${l.firstName} ${l.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      l.mobile?.includes(searchTerm) ||
      l.system_uniquecust_id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ✅ Redux Actions
  const triggerPanApi = () => {
    dispatch(
      verifyPan({
        customerId: selectedCustomer.id,
        pan: selectedCustomer.applicant_pan,
      }),
    );
  };

  const handleRequestOtp = () => {
    dispatch(requestAadhaarOtp(selectedCustomer.applicant_aadhaar));
  };

  const handleVerifyOtp = () => {
    dispatch(
      verifyAadhaarOtp({
        otp: otpValue,
        transactionId: txnId,
        customerId: selectedCustomer.id,
      }),
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#f8fafc] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase">
            KYC Verification Gate
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase">
            NBFC Audit-Ready Module
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-3 border rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && filteredLeads.length > 0 && !selectedCustomer && (
            <div className="absolute top-full mt-2 bg-white shadow rounded-2xl w-full z-50">
              {filteredLeads.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    dispatch(setSelectedCustomer(l));
                    setSearchTerm("");
                  }}
                  className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {l.firstName} {l.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {l.system_uniquecust_id}
                    </p>
                  </div>
                  <ChevronRight size={16} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>
      )}

      {selectedCustomer ? (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow">
              <button
                onClick={() => dispatch(clearSelectedCustomer())}
                className="float-right text-red-500"
              >
                <XCircle />
              </button>

              <h3 className="text-xl font-bold mb-4">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </h3>

              <DataCard
                label="PAN"
                value={selectedCustomer.applicant_pan}
                icon={<CreditCard />}
                status={kycStatus.pan}
              />
              <DataCard
                label="Aadhaar"
                value={selectedCustomer.applicant_aadhaar}
                icon={<Fingerprint />}
                status={kycStatus.aadhaar}
              />
            </div>

            {/* ACTIONS */}
            <div className="bg-black text-white p-6 rounded-2xl">
              {!showOtpInput ? (
                <div className="flex gap-4">
                  <button
                    onClick={triggerPanApi}
                    disabled={isLoading || kycStatus.pan === "verified"}
                    className="flex-1 p-3 bg-gray-800 rounded"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Verify PAN"
                    )}
                  </button>

                  <button
                    onClick={handleRequestOtp}
                    disabled={isLoading || kycStatus.aadhaar === "verified"}
                    className="flex-1 p-3 bg-blue-600 rounded"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Aadhaar OTP"
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="Enter OTP"
                    className="p-3 text-black rounded"
                  />

                  <button
                    onClick={handleVerifyOtp}
                    className="ml-2 bg-blue-600 p-3 rounded"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </button>

                  <button
                    onClick={() => dispatch(cancelOtpFlow())}
                    className="ml-2 text-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow">
              <h4 className="font-bold mb-4">Audit Docs</h4>
              <AuditItem label="Selfie" icon={<Camera />} />
              <AuditItem label="Bank Statement" icon={<FileText />} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400">
          Select a customer to start KYC
        </div>
      )}
    </div>
  );
}

// Components
function DataCard({ label, value, icon, status }) {
  return (
    <div className="p-4 bg-gray-50 rounded mb-3 flex justify-between">
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-bold">{value}</p>
      </div>
      {status === "verified" && <CheckCircle className="text-green-500" />}
    </div>
  );
}

function AuditItem({ label, icon }) {
  return (
    <div className="flex justify-between p-3 border rounded mb-2">
      <div className="flex gap-2 items-center">
        {icon}
        {label}
      </div>
      <button className="text-blue-600">Upload</button>
    </div>
  );
}
