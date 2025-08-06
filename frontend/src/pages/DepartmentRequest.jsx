import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useDepartmentRequest } from '../hooks/useDepartmentRequest';
import DepartmentRequestModal from '../components/modal/DepartmentRequestModal';
import toast from 'react-hot-toast';

export default function DepartmentRequest() {
  const { departmentRequests, setDepartmentRequests, loading, error } = useDepartmentRequest();

  // State for search term and modal visibility
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reference for smooth scroll
  const newRequestRef = useRef(null);

  // Search handler
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter department requests based on the search term
  const filteredRequests = departmentRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.department_name.toLowerCase().includes(searchLower) ||
      request.product_name.toLowerCase().includes(searchLower) ||
      request.product_model.toLowerCase().includes(searchLower) ||
      request.product_brand.toLowerCase().includes(searchLower)
    );
  });

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e, formValues) => {
    e.preventDefault();

    // Prepare payload for API
    const payload = {
      department_id: parseInt(formValues.departmentId, 10),
      product_id: parseInt(formValues.productId, 10),
      quantity: parseInt(formValues.quantity, 10),
    };

    try {
      const response = await fetch('/api/department-request/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newRequest = await response.json();
        setDepartmentRequests((prevRequests) => [...prevRequests, newRequest]);
        toast.success('Success! Request submitted successfully.');
        closeModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit the request.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Smooth scroll to the newly added request
  useEffect(() => {
    if (newRequestRef.current) {
      newRequestRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [departmentRequests]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Department Requests</h2>
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
          {/* Add Request Button */}
          <button
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            onClick={openModal}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> REQUEST
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
      {!loading && !error && filteredRequests.length === 0 && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Department Requests available.</p>
        </div>
      )}

      {/* Table Section */}
      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {filteredRequests.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Department Name</th>
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Product Model</th>
                <th scope="col" className="px-6 py-4">Product Brand</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Request Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr
                  key={`${request.department_request_id}-${index}`}
                  className="odd:bg-white even:bg-gray-50 border-b"
                  ref={index === filteredRequests.length - 1 ? newRequestRef : null} 
                >
                  <td className="px-6 py-4">{request.department_name}</td>
                  <td className="px-6 py-4">{request.product_name}</td>
                  <td className="px-6 py-4">{request.product_model}</td>
                  <td className="px-6 py-4">{request.product_brand}</td>
                  <td className="px-6 py-4">{request.quantity}</td>
                  <td className="px-6 py-4">{request.request_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for Create Department Request */}
      <DepartmentRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
