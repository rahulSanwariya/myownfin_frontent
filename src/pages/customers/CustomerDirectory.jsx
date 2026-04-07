// src/pages/customers/CustomerDirectory.jsx
import { Search, Filter, MoreVertical, User, Phone } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

// Mock data representing our leads and customers
const customersData = [
  { id: 'CUST-001', name: 'Ramesh Kumar', phone: '+91 98765 43210', loanType: 'Personal Loan', amount: 500000, status: 'Processing', date: 'Mar 12, 2026' },
  { id: 'CUST-002', name: 'Priya Sharma', phone: '+91 87654 32109', loanType: 'Home Loan', amount: 3500000, status: 'Approved', date: 'Mar 10, 2026' },
  { id: 'CUST-003', name: 'Amit Patel', phone: '+91 76543 21098', loanType: 'Business Loan', amount: 1500000, status: 'Inquiry', date: 'Mar 13, 2026' },
  { id: 'CUST-004', name: 'Neha Gupta', phone: '+91 65432 10987', loanType: 'Personal Loan', amount: 200000, status: 'Disbursed', date: 'Mar 05, 2026' },
  { id: 'CUST-005', name: 'Vikram Singh', phone: '+91 54321 09876', loanType: 'Business Loan', amount: 800000, status: 'Rejected', date: 'Mar 01, 2026' },
];

// Helper function to color-code the statuses based on our architectural lifecycle
const getStatusBadge = (status) => {
  const styles = {
    'Inquiry': 'bg-gray-100 text-gray-700',
    'Processing': 'bg-yellow-100 text-yellow-700',
    'Approved': 'bg-blue-100 text-blue-700',
    'Disbursed': 'bg-green-100 text-green-700',
    'Rejected': 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default function CustomerDirectory() {
  return (
    <div className="flex flex-col h-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Customer Directory</h2>
        
        <div className="flex items-center space-x-3">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700"
            />
          </div>
          
          {/* Filter Button */}
          <button className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-medium">Customer Info</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Loan Details</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date Added</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {customersData.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                  {/* Name & ID */}
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Contact Info */}
                  <td className="p-4">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-3 w-3 mr-1.5" />
                      {customer.phone}
                    </div>
                  </td>

                  {/* Loan Request */}
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{formatCurrency(customer.amount)}</p>
                    <p className="text-xs text-gray-500">{customer.loanType}</p>
                  </td>

                  {/* Lifecycle Status */}
                  <td className="p-4">
                    {getStatusBadge(customer.status)}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-500">
                    {customer.date}
                  </td>

                  {/* Action Menu (3 dots) */}
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}