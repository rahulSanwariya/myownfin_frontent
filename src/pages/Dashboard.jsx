// src/pages/Dashboard.jsx
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Activity,
  Building,
} from "lucide-react";
import { useSelector } from "react-redux";
import DashboardCard from "../components/DashboardCard";
import RevenueChart from "../components/RevenueChart";
import ProfitChart from "../components/ProfitChart";
import ExpensePieChart from "../components/ExpensePieChart";
import TransactionsTable from "../components/TransactionsTable";
import { formatCurrency } from "../utils/formatCurrency";

export default function Dashboard() {
  // Pull userInfo from Redux to check the role
  const { userInfo } = useSelector((state) => state.auth);

  // Conditional Rendering for MASTER_ADMIN
  if (userInfo?.role === "MASTER_ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 animate-in fade-in duration-300">
        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
          <Building className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">
          Branch Selection Required
        </h2>
        <p className="text-slate-500 text-center max-w-md leading-relaxed">
          Please select a branch from the top navigation dropdown to view the
          specific analytics, revenue, and metrics for that location.
        </p>
      </div>
    );
  }

  // Standard Render for regular users
  return (
    <div className="space-y-6 pb-8 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Revenue"
          amount={formatCurrency(48500)}
          trend="12.5%"
          trendUp={true}
          icon={DollarSign}
        />
        <DashboardCard
          title="Total Profit"
          amount={formatCurrency(32400)}
          trend="8.2%"
          trendUp={true}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Total Expenses"
          amount={formatCurrency(16100)}
          trend="3.1%"
          trendUp={false}
          icon={CreditCard}
        />
        <DashboardCard
          title="Active Clients"
          amount="2,845"
          trend="5.4%"
          trendUp={true}
          icon={Activity}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <ProfitChart />
      </div>

      {/* Bottom Grid: Pie Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ExpensePieChart />
        </div>
        <div className="lg:col-span-2">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
}
