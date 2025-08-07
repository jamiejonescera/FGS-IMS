import React, { useState } from 'react';
import { useDamages } from '../hooks/useDamages';
import { toast } from 'react-hot-toast';

export default function Damage() {
  const { damages, setDamages, loading, error } = useDamages();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState(null);

  const openViewModal = (damage) => {
    setSelectedDamage(damage);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDamage(null);
  };

  const markAsReplaced = async (damage) => {
    try {
      const response = await fetch(`http://localhost:5000/api/damages/update/${damage.damaged_item_id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ return_status: 'replaced' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update damage status');
      }

      const data = await response.json();
      const successMessage = data.message || 'Damage status marked as replaced!';

      const updatedDamages = damages.map((d) =>
        d.damaged_item_id === damage.damaged_item_id
          ? { ...d, return_status: 'replaced' }
          : d
      );
      setDamages(updatedDamages);

      toast.success(successMessage);
      closeViewModal(false);

    } catch (error) {
      console.error('Error marking as replaced:', error);
      toast.error('Failed to mark as replaced!');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-200 pb-2">
        <h2 className="text-2xl font-bold">Damage Item & Assets</h2>
        <div className="flex items-center gap-2 mr-5 bg-white border border-gray-300 rounded-lg px-3 py-2">
          <input 
            type="text" 
            className="bg-white text-gray-900 outline-none flex-1" 
            placeholder="Search damages..." 
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600"
            role="status"
          />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-32 text-red-500">
          <p>{error}</p>
        </div>
      )}
      {damages.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Damage available.</p>
        </div>
      )}
      
      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {damages.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-white border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Brand</th>
                <th scope="col" className="px-6 py-4">Model</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Request Date</th>
                <th scope="col" className="px-6 py-4">Updated at</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {damages.map((damage, index) => (
                <tr
                  key={`${damage.damaged_item_id}-${index}`}
                  className="odd:bg-white even:bg-gray-100 border-b border-gray-200"
                >
                  <td className="px-6 py-4">{damage.product_name}</td>
                  <td className="px-6 py-4">{damage.product_brand}</td>
                  <td className="px-6 py-4">{damage.product_model}</td>
                  <td className="px-6 py-4">{damage.quantity}</td>
                  <td className="px-6 py-4">
                    {['pending', 'replaced', 'rejected'].includes(damage.return_status) && (
                      <span
                        className={`${
                          damage.return_status === 'pending' ? 'text-orange-500' : ''
                        } ${damage.return_status === 'replaced' ? 'text-green-500' : ''} ${
                          damage.return_status === 'rejected' ? 'text-red-500' : ''
                        }`}
                      >
                        {damage.return_status.charAt(0).toUpperCase() + damage.return_status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{damage.created_at}</td>
                  <td className="px-6 py-4">{damage.updated_at}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    {damage.return_status === 'pending' ? (
                      <button
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2"
                        onClick={() => openViewModal(damage)}
                      >
                        Manage
                      </button>
                    ) : (
                      <button
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2"
                        onClick={() => openViewModal(damage)}
                      >
                        View  
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Damage Details Modal */}
      {isViewModalOpen && selectedDamage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-3xl">
            <h3 className="text-2xl font-semibold mb-6 text-center">Damage Details</h3>

            <div className="space-y-4">
              <p><strong>Damage Id:</strong> {selectedDamage.damaged_item_id}</p>
              <p><strong>Product Name:</strong> {selectedDamage.product_name}</p>
              <p><strong>Brand:</strong> {selectedDamage.product_brand}</p>
              <p><strong>Model:</strong> {selectedDamage.product_model}</p>
              <p><strong>Quantity:</strong> {selectedDamage.quantity}</p>

              <p>
                <strong>Status: </strong>
                <span
                  className={`${
                    selectedDamage.return_status === 'pending' ? 'text-orange-500' : ''
                  } ${
                    selectedDamage.return_status === 'replaced' ? 'text-green-500' : ''
                  } ${
                    selectedDamage.return_status === 'rejected' ? 'text-red-500' : ''
                  }`}
                >
                  {selectedDamage.return_status.charAt(0).toUpperCase() + selectedDamage.return_status.slice(1)}
                </span>
              </p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={closeViewModal}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              >
                Close
              </button>

              {selectedDamage.return_status === 'pending' && (
                <button
                  onClick={() => markAsReplaced(selectedDamage)}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
                >
                  Mark as Replaced
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}