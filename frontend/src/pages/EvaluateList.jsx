
import React, { useState, useEffect, useRef } from 'react';
import { useEvaluate } from '../hooks/useEvaluations';

export default function EvaluateList() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const options = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const formattedDate = date.toLocaleString('en-GB', options);

    return `${formattedDate} GMT`;
  };

  const { evaluate, loading, error } = useEvaluate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const newEvaluationRef = useRef(null); 

  // Open View Modal with selected evaluation
  const openViewModal = (evaluationId) => {
    const evaluation = evaluate.find((item) => item.evaluation_id === evaluationId);
    setSelectedEvaluation(evaluation);
    setIsViewModalOpen(true);
  };

  // Close the View Modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedEvaluation(null);
  };

  // Filter evaluations based on the search query and "approved" status
  const filteredEvaluations = evaluate.filter((evaluation) => {
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      evaluation.status === 'approved' &&
      (
        String(evaluation.evaluation_id).toLowerCase().includes(lowercasedQuery) || 
        evaluation.product_name.toLowerCase().includes(lowercasedQuery) ||
        evaluation.supplier_name.toLowerCase().includes(lowercasedQuery) ||
        String(evaluation.quantity).toLowerCase().includes(lowercasedQuery)
      )
    );
  });

  // Smooth scroll to the newly added or updated evaluation
  useEffect(() => {
    if (newEvaluationRef.current) {
      newEvaluationRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredEvaluations]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Evaluate List</h2>
        <label className="input input-bordered flex items-center gap-20 mr-5">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
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
      {filteredEvaluations.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No pending evaluations.</p>
        </div>
      )}

      {/* Evaluations Table */}
      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {filteredEvaluations.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {/* <th scope="col" className="px-6 py-4">Evaluation ID</th> */}
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Supplier Name</th>
                <th scope="col" className="px-6 py-4">Total Amount</th>
                <th scope="col" className="px-6 py-4">Approved Quantity</th>
                <th scope="col" className="px-6 py-4">Rejected Quantity</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Evaluation Date</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvaluations.map((evaluation, index) => (
                <tr
                  key={evaluation.evaluation_id}
                  ref={index === filteredEvaluations.length - 1 ? newEvaluationRef : null} // Reference the last item
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  {/* <td className="px-6 py-4">{evaluation.evaluation_id}</td> */}
                  <td className="px-6 py-4">{evaluation.product_name}</td>
                  <td className="px-6 py-4">{evaluation.quantity}</td>
                  <td className="px-6 py-4">{evaluation.supplier_name}</td>
                  <td className="px-6 py-4">₱{new Intl.NumberFormat().format(evaluation.total_amount)}</td>
                  <td className="px-6 py-4">{evaluation.undamaged_quantity}</td>
                  <td className="px-6 py-4">{evaluation.damaged_quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        evaluation.status === 'pending' ? 'text-orange-500' : ''
                      } ${
                        evaluation.status === 'approved' ? 'text-green-500' : ''
                      } ${
                        evaluation.status === 'rejected' ? 'text-red-500' : ''
                      }`}
                    >
                      {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(evaluation.evaluation_date)}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => openViewModal(evaluation.evaluation_id)}
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

      {/* View Evaluation Details Modal */}
      {isViewModalOpen && selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-w-3xl">
            <h3 className="text-2xl font-semibold mb-6 text-center">Evaluation Details</h3>

            {/* Evaluation Information */}
            <div className="space-y-4">
              <p><strong>Evaluation ID:</strong> {selectedEvaluation.evaluation_id}</p>
              <p><strong>Product Name:</strong> {selectedEvaluation.product_name}</p>
              <p><strong>Quantity:</strong> {selectedEvaluation.quantity}</p>
              <p><strong>Supplier Name:</strong> {selectedEvaluation.supplier_name}</p>
              <p><strong>Total Amount:</strong> ₱{new Intl.NumberFormat().format(selectedEvaluation.total_amount)}</p>
              <p><strong>Approved Quantity:</strong> {selectedEvaluation.undamaged_quantity}</p>
              <p><strong>Rejected Quantity:</strong> {selectedEvaluation.damaged_quantity}</p>
                {/* Status with color */}
                <p>
                <strong>Status: </strong>
                <span
                  className={`${
                    selectedEvaluation.status === 'pending' ? 'text-orange-500' : ''
                  } ${
                    selectedEvaluation.status === 'approved' ? 'text-green-500' : ''
                  } ${
                    selectedEvaluation.status === 'rejected' ? 'text-red-500' : ''
                  }`}
                >
                  {selectedEvaluation.status.charAt(0).toUpperCase() + selectedEvaluation.status.slice(1)}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}