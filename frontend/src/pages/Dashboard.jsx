import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faBox, faUserAlt, faTools, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useInventory } from '../hooks/useInventory';
import { useSuppliers } from '../hooks/useSupplier';
import { useMaintenance } from '../hooks/useMaintenance';
import { useGetTopPurchase } from '../hooks/useGetTopPurchase';
import { useTopPurchasesPerDepartment } from '../hooks/useTopPurchasesPerDepartment';
import { useDepartmentRequest } from '../hooks/useDepartmentRequest';

// Custom Tooltip for the Bar Chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { product_name, total_purchases } = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded-md shadow-sm">
        <p className="label">{`Product: ${product_name}`}</p>
        <p className="intro">{`Total Purchase: ${total_purchases}`}</p>
      </div>
    );
  }
  return null;
};

// Define colors for the bars and pie segments
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff6f61', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffa07a', '#ff69b4', '#ffb6c1'];

export default function Dashboard() {
  const { totalQuantity } = useInventory();
  const { departmentRequests, loading, error } = useDepartmentRequest();
  const { totalSuppliers } = useSuppliers();
  const { totalMaintenance, totalCondemned } = useMaintenance();
  const { topPurchases, loading: loadingTopPurchases, error: errorTopPurchases } = useGetTopPurchase();
  const { topPurchasesDepartment } = useTopPurchasesPerDepartment();

  // Get the last 5 department requests
  const recentRequests = departmentRequests.slice(-5).reverse();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Cards Container */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="card p-5 border border-gray-300 rounded-md shadow-sm bg-blue-100">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faBox} className="text-2xl text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-blue-700">Total Inventory</h3>
              <p className="text-sm">{totalQuantity} Item & Assets</p>
            </div>
          </div>
        </div>

        <div className="card p-5 border border-gray-300 rounded-md shadow-sm bg-green-100">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faUserAlt} className="text-2xl text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-green-700">Suppliers</h3>
              <p className="text-sm">{totalSuppliers} Suppliers</p>
            </div>
          </div>
        </div>

        <div className="card p-5 border border-gray-300 rounded-md shadow-sm bg-yellow-100">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faTools} className="text-2xl text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-700">Maintenance</h3>
              <p className="text-sm">{totalMaintenance} Maintenance</p>
            </div>
          </div>
        </div>

        <div className="card p-5 border border-gray-300 rounded-md shadow-sm bg-red-100">
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faTrash} className="text-2xl text-red-500" />
            <div>
              <h3 className="text-lg font-semibold text-red-700">Disposed Assets</h3>
              <p className="text-sm">{totalCondemned} Disposed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className="card p-5 border border-gray-300 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Purchases Per Product</h3>
          {loadingTopPurchases ? (
            <p>Loading...</p>
          ) : errorTopPurchases ? (
            <p>Error: {errorTopPurchases}</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPurchases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="total_purchases"
                  name="Total Purchase"
                  fill="#8884d8"
                >
                  {topPurchases.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card p-5 border border-gray-300 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Top Distribution Product Per Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topPurchasesDepartment}
                dataKey="total_purchases"
                nameKey="product_name"
                outerRadius={100}
                fill="#8884d8"
                label={({ department_name, product_name, total_purchases }) =>
                  `${department_name} - ${product_name}: ${total_purchases}`
                }
              >
                {topPurchasesDepartment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Table Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Recent Department Requests</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : recentRequests.length === 0 ? (
          <p>No department requests available.</p>
        ) : (
          <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4">Department Name</th>
                  <th scope="col" className="px-6 py-4">Product Name</th>
                  <th scope="col" className="px-6 py-4">Model</th>
                  <th scope="col" className="px-6 py-4">Brand</th>
                  <th scope="col" className="px-6 py-4">Quantity</th>
                  <th scope="col" className="px-6 py-4">Request Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((item, index) => (
                  <tr key={`department-${index}`} className="odd:bg-white even:bg-gray-50 border-b">
                    <td className="px-6 py-4">{item.department_name}</td>
                    <td className="px-6 py-4">{item.product_name}</td>
                    <td className="px-6 py-4">{item.product_model}</td>
                    <td className="px-6 py-4">{item.product_brand}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">{item.request_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
