import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useSuppliers } from '../hooks/useSupplier';
import toast from 'react-hot-toast';
import AddSupplierModal from '../components/modal/AddSupplierModal';
import UpdateSupplierModal from '../components/modal/UpdateSupplierModal';

export default function Suppliers() {
  const { suppliers, loading, error, setSuppliers } = useSuppliers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [formData, setFormData] = useState({
    supplier_name: '',
    address: '',
    contact_number: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const newSupplierRef = useRef(null);

  // Handle input changes for form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_number.includes(searchTerm)
  );

  // Add new supplier
  const handleAddSupplier = async () => {
    try {
      const response = await fetch('/api/supplier/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to create supplier');
      }

      setSuppliers((prev) => [...prev, data.supplier]);

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setFormData({ supplier_name: '', address: '', contact_number: '' });
      setShowAddModal(false);
    }
  };

  // Update supplier
  const handleUpdateSupplier = async () => {
    try {
      const response = await fetch(`/api/supplier/update/${selectedSupplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to update supplier');
      }

      // Update the state with the updated supplier
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.supplier_id === selectedSupplierId ? { ...supplier, ...formData } : supplier
        )
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setFormData({ supplier_name: '', address: '', contact_number: '' });
      setShowUpdateModal(false);
      setSelectedSupplierId(null);
    }
  };

  // Delete supplier
  const handleDeleteSupplier = async () => {
    try {
      const response = await fetch(`/api/supplier/delete/${selectedSupplierId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error);
      }

      // Update the state to remove the deleted supplier
      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.supplier_id !== selectedSupplierId)
      );

      toast.success(data.message);
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setShowDeleteModal(false);
      setSelectedSupplierId(null);
    }
  };

  // Smooth scroll to the newly added supplier
  useEffect(() => {
    if (newSupplierRef.current) {
      newSupplierRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [suppliers]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Supplier List</h2>
        <div className="flex items-center">
          {/* Search Bar */}
          <label className="input input-bordered flex items-center gap-2 mr-5">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>

          {/* Add Supplier Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> SUPPLIER
          </button>
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
      {suppliers.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Supplier available.</p>
        </div>
      )}

      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {filteredSuppliers.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Supplier Name</th>
                <th scope="col" className="px-6 py-4">Address</th>
                <th scope="col" className="px-6 py-4">Contact Number</th>
                <th scope="col" className="px-6 py-4">Created At</th>
                <th scope="col" className="px-6 py-4">Updated At</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr
                  key={supplier.supplier_id}
                  className="odd:bg-white even:bg-gray-50 border-b"
                  ref={index === filteredSuppliers.length - 1 ? newSupplierRef : null}
                >
                  <td className="px-6 py-4">{supplier.supplier_name}</td>
                  <td className="px-6 py-4">{supplier.address}</td>
                  <td className="px-6 py-4">{supplier.contact_number}</td>
                  <td className="px-6 py-4">{supplier.created_at}</td>
                  <td className="px-6 py-4">{supplier.updated_at}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setSelectedSupplierId(supplier.supplier_id);
                        setFormData({
                          supplier_name: supplier.supplier_name,
                          address: supplier.address,
                          contact_number: supplier.contact_number,
                        });
                        setShowUpdateModal(true);
                      }}
                      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSupplierId(supplier.supplier_id);
                        setShowDeleteModal(true);
                      }}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleAddSupplier={handleAddSupplier}
      />

      {/* Update Supplier Modal */}
      <UpdateSupplierModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleUpdateSupplier={handleUpdateSupplier}
      />

      {/* Delete Supplier Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Delete Supplier</h3>
            <p className="mt-2">Are you sure you want to delete this supplier?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSupplier}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
