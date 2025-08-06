import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';

export default function Inventory() {
  const { inventory, loading, error } = useInventory();

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for managing modal visibility and selected inventory item
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState(null);

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter inventory based on the search term
  const filteredInventory = inventory.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.product_name.toLowerCase().includes(searchLower) ||
      item.product_type.toLowerCase().includes(searchLower) ||
      item.product_model.toLowerCase().includes(searchLower) ||
      item.product_brand.toLowerCase().includes(searchLower) ||
      item.product_category.toLowerCase().includes(searchLower)
    );
  });

  // Function to open the modal with the selected inventory item
  const openViewModal = (inventoryId) => {
    const item = inventory.find((i) => i.inventory_id === inventoryId);
    setSelectedInventory(item);
    setIsViewModalOpen(true);
  };

  // Function to close the modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedInventory(null);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Inventory</h2>
        <div className="flex items-center">
          <label className="input input-bordered flex items-center gap-20 mr-5">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>
      </div>

      {/* Loading, Error, and Empty State Messages */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600" role="status" />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-32 text-red-500">
          <p>{error}</p>
        </div>
      )}
      {filteredInventory.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Inventory available.</p>
        </div>
      )}

      <div className="relative overflow-y-auto max-h-[75s0px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {filteredInventory.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {/* <th scope="col" className="px-6 py-4">Product Id</th> */}
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Product Type</th>
                <th scope="col" className="px-6 py-4">Product Category</th>
                <th scope="col" className="px-6 py-4">Model</th>
                <th scope="col" className="px-6 py-4">Brand</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Total Amount</th>
                <th scope="col" className="px-6 py-4">Created at</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <tr key={`${item.inventory_id}-${index}`} className="odd:bg-white even:bg-gray-50 border-b">
                  {/* <td className="px-6 py-4 text-center">{item.inventory_id}</td> */}
                  <td className="px-6 py-4">{item.product_name}</td>
                  <td className="px-6 py-4">{item.product_type.charAt(0).toUpperCase() + item.product_type.slice(1)}</td>
                  <td className="px-6 py-4">{item.product_category}</td>
                  <td className="px-6 py-4">{item.product_model}</td>
                  <td className="px-6 py-4">{item.product_brand}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">₱
                   {new Intl.NumberFormat().format(item.running_amount)}
                  </td>
                  <td className="px-6 py-4">{item.created_at}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => openViewModal(item.inventory_id)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Inventory Details Modal */}
      {isViewModalOpen && selectedInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-3xl">
            <h3 className="text-2xl font-semibold mb-6 text-center">Inventory Details</h3>

            {/* Inventory Information */}
            <div className="space-y-4">
              <p><strong>Inventory ID:</strong> {selectedInventory.inventory_id}</p>
              <p><strong>Product Name:</strong> {selectedInventory.product_name}</p>
              <p><strong>Product Type:</strong> {selectedInventory.product_type}</p>
              <p><strong>Supplier Name:</strong> {selectedInventory.supplier_name}</p>
              <p><strong>Quantity:</strong> {selectedInventory.quantity}</p>
              <p><strong>Available Quantity:</strong> {selectedInventory.available_quantity}</p>
              <p><strong>Running Amount:</strong> ₱{new Intl.NumberFormat().format(selectedInventory.running_amount)}</p>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={closeViewModal}
                className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
