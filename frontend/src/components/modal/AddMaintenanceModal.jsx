import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddMaintenanceModal = ({ isOpen, onClose, formData, onInputChange, onSubmit, products }) => {
  if (!isOpen) return null;
    const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Maintenance</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Scheduled Date</label>
            <input
              type="datetime-local"
              name="scheduled_date"
              value={formData.scheduled_date}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Engineer Name</label>
            <input
              type="text"
              name="engineer_name"
              value={formData.engineer_name}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
              autoComplete="off"
              placeholder="Enter engineer name"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Asset</label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select Asset</option>
              {products
                .filter((product) => product.product_type === 'asset')
                .map((product) => (
                  <option key={product.product_id} value={product.product_id}>
                    {product.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Problem Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
              autoComplete="off"
              placeholder="Enter problem description"
            />
          </div>
    
          {/* <div className="mb-4">
            <label className="block mb-1 text-sm">Total Cost</label>
            <input
              type="number"
              name="total_cost"
              value={formData.total_cost}
              onChange={onInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div> */}

           {/* Confirmation Checkbox */}
           <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="confirm"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="confirm"
            className="ml-2 block text-sm text-gray-700"
          >
            I confirm that the information I filled is correct.
          </label>
        </div>
        
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-700 bg-gray-200 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
            type="submit"
            disabled={!isConfirmed} 
            className={`px-4 py-2 rounded-lg shadow-sm font-medium focus:outline-none ${
              isConfirmed
                ? "bg-green-700 text-white hover:bg-green-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
