import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function AddSupplierModal({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleAddSupplier,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Supplier</h2>

        <div className="mb-4">
          <label
            htmlFor="supplier_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Supplier Name
          </label>
          <input
            type="text"
            id="supplier_name"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleInputChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter supplier name"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter address"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="contact_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Number
          </label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleInputChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter contact number"
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddSupplier}
            className="bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Supplier
          </button>
        </div>
      </div>
    </div>
  );
}
