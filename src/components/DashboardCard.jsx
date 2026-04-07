// src/components/DashboardCard.jsx
export default function DashboardCard({ title, amount, trend, trendUp, icon: Icon }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{amount}</h3>
        <p className={`text-sm mt-2 font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend} <span className="text-gray-400 font-normal ml-1">vs last month</span>
        </p>
      </div>
      <div className={`p-4 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}