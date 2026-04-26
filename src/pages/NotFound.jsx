// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-blue-100">
      <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
        {/* Icon & Error Code */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-50 rounded-full"></div>
          <div className="relative flex flex-col items-center justify-center">
            <div className="h-24 w-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-slate-100 mb-6 rotate-12 hover:rotate-0 transition-transform duration-300">
              <FileQuestion
                className="text-blue-600"
                size={48}
                strokeWidth={1.5}
              />
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
              404
            </h1>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
            Page Not Found
          </h2>
          <p className="text-slate-500 leading-relaxed max-w-sm mx-auto">
            We searched high and low, but the page you are looking for has
            either moved, been renamed, or doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-100 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-[11px] uppercase tracking-widest shadow-lg hover:bg-blue-700 hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
