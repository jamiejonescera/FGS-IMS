import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { usePurchase } from '../hooks/usePurchase';
import toast from 'react-hot-toast';

export default function PurchaseList() {
  const { purchase, setPurchase, loading, error } = usePurchase();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [undamagedQuantity, setUndamagedQuantity] = useState(0);
  const [damagedQuantity, setDamagedQuantity] = useState(0);
  const newPurchaseRef = useRef(null); 

  // Filter the purchase requests to only include those with status 'pending'
  const pendingPurchases = purchase.filter((purchase) => purchase.status === 'pending');

  // Handle opening the modal
  const handleOpenModal = (purchase) => {
    setSelectedRequest(purchase);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setUndamagedQuantity(0);
    setDamagedQuantity(0);
  };

  const handleEvaluate = async () => {
    if (undamagedQuantity + damagedQuantity !== selectedRequest.quantity) {
      toast.error('Undamaged and damaged quantities must sum up to the total requested quantity.');
      return;
    }
  
    try {
      const response = await fetch(`/api/evaluate/create/${selectedRequest.request_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ undamaged_quantity: undamagedQuantity, damaged_quantity: damagedQuantity }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Purchase request evaluated successfully!');
  
        // Determine whether the status is 'approved' or 'rejected'
        const newStatus = data.isApproved ? 'approved' : 'rejected';
  
        // Update the purchase state locally (status changes to 'approved' or 'rejected')
        const updatedPurchases = purchase.map((p) =>
          p.request_id === selectedRequest.request_id
            ? { ...p, status: newStatus }
            : p
        );
        setPurchase(updatedPurchases);
  
        handleCloseModal();

        // setTimeout(() => {
        //   window.location.reload();
        // }, 600);
      
      } else {
        toast.error(data.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Failed to evaluate purchase request.');
    }
  };

  // Smooth scroll to the newly added or evaluated purchase
  useEffect(() => {
    if (newPurchaseRef.current) {
      newPurchaseRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pendingPurchases]);

  return (
    <div className="p-6">
      {/* Modal for evaluation, ensure it's outside the table */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Evaluate Purchase Request</h3>
            <div className="mb-4">
              <label className="block text-sm">Approved Quantity</label>
              <input
                type="number"
                value={undamagedQuantity}
                onChange={(e) => setUndamagedQuantity(Number(e.target.value))}
                className="input input-bordered w-full"
                placeholder='0'
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Rejected Quantity</label>
              <input
                type="number"
                value={damagedQuantity}
                onChange={(e) => setDamagedQuantity(Number(e.target.value))}
                className="input input-bordered w-full"
                placeholder='0'
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={handleCloseModal} 
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >Cancel</button>
              <button onClick={handleEvaluate} 
               className="bg-green-700 text-white px-4 py-2 rounded-lg"
               
              ><FontAwesomeIcon icon={faEdit} className="mr-2" /> Evaluate</button>
            </div>
          </div>
        </div>
      )} */}
      {isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h3 className="text-lg font-bold mb-4">Evaluate Purchase Request</h3>
      <div className="mb-4">
        <label className="block text-sm">Approved Quantity</label>
        <input
          type="number"
          value={undamagedQuantity === 0 ? '' : undamagedQuantity}
          onChange={(e) =>
            setUndamagedQuantity(e.target.value === '' ? 0 : Number(e.target.value))
          }
          className="input input-bordered w-full"
          placeholder="Enter approved quantity"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm">Rejected Quantity</label>
        <input
          type="number"
          value={damagedQuantity === 0 ? '' : damagedQuantity}
          onChange={(e) =>
            setDamagedQuantity(e.target.value === '' ? 0 : Number(e.target.value))
          }
          className="input input-bordered w-full"
          placeholder="Enter rejected quantity"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleCloseModal}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleEvaluate}
          className="bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" /> Evaluate
        </button>
      </div>
    </div>
  </div>
)}
      {/* Purchase List */}
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Evaluate Checklist</h2>
        <label className="input input-bordered flex items-center gap-20 mr-5">
          <input type="text" className="grow" placeholder="Search" />
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
      {pendingPurchases.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No pending evaluation.</p>
        </div>
      )}

      {/* Purchase Requests Table */}
      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {pendingPurchases.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {/* <th scope="col" className="px-6 py-4">Request Id</th> */}
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Brand</th>
                <th scope="col" className="px-6 py-4">Model</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Supplier Name</th>
                <th scope="col" className="px-6 py-4">Total Amount</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Request Date</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPurchases.map((purchase, index) => (
                <tr
                  key={`${purchase.request_id}-${index}`}
                  className="odd:bg-white even:bg-gray-50 border-b"
                  ref={index === pendingPurchases.length - 1 ? newPurchaseRef : null} // Reference the last item
                >
                  {/* <td className="px-6 py-4">{purchase.request_id}</td> */}
                  <td className="px-6 py-4">{purchase.product_name}</td>
                  <td className="px-6 py-4">{purchase.brand}</td>
                  <td className="px-6 py-4">{purchase.model}</td>
                  <td className="px-6 py-4">{purchase.quantity}</td>
                  <td className="px-6 py-4">{purchase.supplier_name}</td>
                  <td className="px-6 py-4">₱{new Intl.NumberFormat().format(purchase.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        purchase.status === 'pending' ? 'text-orange-500' : ''
                      } ${
                        purchase.status === 'approved' ? 'text-green-500' : ''
                      } ${
                        purchase.status === 'rejected' ? 'text-red-500' : ''
                      }`}
                    >
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{purchase.request_date}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(purchase)}
                      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2"
                    >
                      Evaluate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}