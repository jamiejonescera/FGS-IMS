import React, { useState, useEffect } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { useDepartments } from '../../hooks/useDepartments';

const DepartmentRequestModal = ({ isOpen, onClose, onSubmit }) => {
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventory();
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formValues, setFormValues] = useState({
    departmentId: '',
    productId: '',
    quantity: '',
  });
  const [availableQuantity, setAvailableQuantity] = useState(null);

  // Reset the form fields
  const resetForm = () => {
    setFormValues({
      departmentId: '',
      productId: '',
      quantity: '',
    });
    setAvailableQuantity(null);
    setIsConfirmed(false);
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Handle department selection
  const handleDepartmentChange = (e) => {
    const selectedDepartmentId = e.target.value;
    setFormValues((prev) => ({
      ...prev,
      departmentId: selectedDepartmentId,
    }));
  };

  // Handle product selection and fetch available quantity
  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;

    setFormValues((prev) => ({
      ...prev,
      productId: selectedProductId,
    }));

    const selectedProduct = inventory.find(
      (item) => item.product_id === parseInt(selectedProductId, 10)
    );

    setAvailableQuantity(selectedProduct ? selectedProduct.quantity || 0 : null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Create Classroom Request</h3>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        <form onSubmit={(e) => onSubmit(e, formValues, resetForm)}>
          {/* Department Name */}
          <div className="mb-4">
            <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">
              Classroom Name
            </label>
            <select
              id="departmentName"
              name="departmentName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formValues.departmentId}
              onChange={handleDepartmentChange}
              required
            >
              <option value="">Select Classroom</option>
              {departmentsLoading && <option>Loading...</option>}
              {departmentsError && <option>Error loading Classroom</option>}
              {departments && departments.length > 0 ? (
                departments.map((department) => (
                  <option key={department.department_id} value={department.department_id}>
                    {department.department_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No available classroom
                </option>
              )}
            </select>
          </div>

          {/* Product Name */}
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <select
              id="productName"
              name="productName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formValues.productId}
              onChange={handleProductChange}
              required
            >
              <option value="">Select Product</option>
              {inventoryLoading && <option>Loading...</option>}
              {inventoryError && <option>Error loading inventory</option>}
              {inventory &&
                inventory.filter((item) => item.quantity > 0).length > 0 ? (
                  inventory
                    .filter((item) => item.quantity > 0) // Filter products with quantity > 0
                    .map((item) => (
                      <option key={item.product_id} value={item.product_id}>
                        {item.product_name}
                      </option>
                    ))
                ) : (
                  <option value="" disabled>
                    No available items and assets
                  </option>
                )}
            </select>
          </div>

          {/* Available Quantity */}
          <div className="mb-4">
            <label htmlFor="availableQuantity" className="block text-sm font-medium text-gray-700">
              Available Quantity
            </label>
            <input
              type="text"
              id="availableQuantity"
              name="availableQuantity"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={availableQuantity !== null ? availableQuantity : ''}
              placeholder="No selected product"
              readOnly
            />
          </div>

          {/* Quantity to Request */}
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity to Request
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formValues.quantity}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only positive integers and prevent leading zeros
                if (/^\d+$/.test(value) || value === '') {
                  setFormValues({ ...formValues, quantity: value });
                }
              }}
              placeholder="Enter quantity"
              min="1"
              max={availableQuantity || undefined}
              required
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="confirm"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="confirm" className="ml-2 block text-sm text-gray-700">
              I confirm that the information I filled is correct.
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isConfirmed}
              className={`px-4 py-2 rounded-lg shadow-sm font-medium focus:outline-none ${
                isConfirmed
                  ? 'bg-green-700 text-white hover:bg-green-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentRequestModal;
