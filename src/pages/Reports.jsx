// src/pages/Reports.jsx
import { Download, Filter, FileText, Calendar } from 'lucide-react';

export default function Reports() {
  const recentReports = [
    { id: 1, name: 'Q1 Financial Summary', date: 'Mar 10, 2026', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'Monthly Expense Breakdown', date: 'Mar 05, 2026', type: 'CSV', size: '845 KB' },
    { id: 3, name: 'Payroll Ledger', date: 'Feb 28, 2026', type: 'Excel', size: '1.2 MB' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Calendar className="h-4 w-4 mr-2" />
            Generate New Report
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Revenue Analytics', 'Expense Tracking', 'Tax Summaries'].map((title) => (
          <div key={title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-blue-100 transition-colors cursor-pointer">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-4">Generate comprehensive {title.toLowerCase()} for any date range.</p>
            <span className="text-blue-600 text-sm font-medium hover:underline">Configure report →</span>
          </div>
        ))}
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recently Generated</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Report Name</th>
              <th className="p-4 font-medium">Date Generated</th>
              <th className="p-4 font-medium">Format</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {recentReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 text-gray-400 mr-3" />
                  {report.name}
                </td>
                <td className="p-4 text-gray-500">{report.date}</td>
                <td className="p-4 text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{report.type}</span>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50 inline-flex">
                    <Download className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}