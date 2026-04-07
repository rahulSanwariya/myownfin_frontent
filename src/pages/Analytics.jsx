// src/pages/Analytics.jsx
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, Legend, Area, AreaChart 
} from 'recharts';
import { Calendar, Download, TrendingUp, Users, Target } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

// Local Dummy Data specifically for Loan Analytics
const loanFunnelData = [
  { stage: '1. Inquiries', count: 1200 },
  { stage: '2. Processing', count: 850 },
  { stage: '3. Approved', count: 620 },
  { stage: '4. Disbursed', count: 480 },
];

const monthlyTrendData = [
  { month: 'Jan', target: 500000, disbursed: 450000 },
  { month: 'Feb', target: 550000, disbursed: 580000 },
  { month: 'Mar', target: 600000, disbursed: 520000 },
  { month: 'Apr', target: 650000, disbursed: 710000 },
  { month: 'May', target: 700000, disbursed: 850000 },
  { month: 'Jun', target: 750000, disbursed: 920000 },
];

const agentPerformance = [
  { name: 'Rahul S.', leads: 145, disbursed: 42, incentive: 42000 },
  { name: 'Priya M.', leads: 110, disbursed: 38, incentive: 38000 },
  { name: 'Amit K.', leads: 95, disbursed: 25, incentive: 25000 },
  { name: 'Neha R.', leads: 130, disbursed: 35, incentive: 35000 },
];

export default function Analytics() {
  return (
    <div className="space-y-6 pb-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Track loan conversions, targets, and agent incentives.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            This Quarter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4"><Target className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Disbursement (YTD)</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(4030000)}</h3>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg mr-4"><TrendingUp className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">40.0%</h3>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg mr-4"><Users className="h-6 w-6" /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Agents</p>
            <h3 className="text-2xl font-bold text-gray-900">24</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Loan Conversion Funnel */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={loanFunnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13 }} />
              <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Target vs Disbursed Trends */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Target vs. Actual Disbursement</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis hide />
              <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="target" stroke="#9CA3AF" strokeDasharray="5 5" fill="none" name="Target" />
              <Area type="monotone" dataKey="disbursed" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorDisbursed)" name="Actual Disbursed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Top Agent Performance & Incentives</h3>
          <span className="text-sm text-gray-500">Based on Disbursed Loans</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Agent Name</th>
                <th className="p-4 font-medium">Raw Leads Generated</th>
                <th className="p-4 font-medium">Loans Disbursed</th>
                <th className="p-4 font-medium text-right">Estimated Incentive</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {agentPerformance.map((agent, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">
                      {agent.name.charAt(0)}
                    </div>
                    {agent.name}
                  </td>
                  <td className="p-4 text-gray-600">{agent.leads}</td>
                  <td className="p-4 text-green-600 font-medium">{agent.disbursed}</td>
                  <td className="p-4 font-bold text-gray-900 text-right">{formatCurrency(agent.incentive)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}