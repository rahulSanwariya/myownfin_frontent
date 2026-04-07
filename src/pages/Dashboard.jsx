// src/pages/Dashboard.jsx
import { DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import RevenueChart from '../components/RevenueChart';
import ProfitChart from '../components/ProfitChart';
import ExpensePieChart from '../components/ExpensePieChart';
import TransactionsTable from '../components/TransactionsTable';
import { formatCurrency } from '../utils/formatCurrency';

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Total Revenue" amount={formatCurrency(48500)} trend="12.5%" trendUp={true} icon={DollarSign} />
        <DashboardCard title="Total Profit" amount={formatCurrency(32400)} trend="8.2%" trendUp={true} icon={TrendingUp} />
        <DashboardCard title="Total Expenses" amount={formatCurrency(16100)} trend="3.1%" trendUp={false} icon={CreditCard} />
        <DashboardCard title="Active Clients" amount="2,845" trend="5.4%" trendUp={true} icon={Activity} />
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