import React from "react";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminGateway() {
  const { userInfo } = useSelector((state) => state.auth);

  // You will add your condition logic here later
  const handleProceed = () => {
    alert("Condition logic will go here!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden text-center p-8 md:p-12 animate-in zoom-in-95 duration-300">
        <div className="mx-auto h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner border border-blue-100">
          <ShieldAlert size={40} />
        </div>

        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
          Master Admin Setup
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-8">
          Welcome back,{" "}
          <span className="font-bold text-slate-700">{userInfo?.userId}</span>.
          As a Master Admin, you must complete the mandatory setup or
          verification before accessing the main dashboard and portfolio.
        </p>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-8 text-left">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Pending Action Required
          </h3>
          <p className="text-sm text-slate-700 font-medium italic">
            Waiting for your specific condition to be implemented here...
          </p>
        </div>

        <button
          onClick={handleProceed}
          className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 uppercase tracking-widest"
        >
          Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
