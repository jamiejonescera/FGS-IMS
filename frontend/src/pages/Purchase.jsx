
import React, { useState, useEffect } from 'react';
import { useProductSuppliers } from '../hooks/useProductSupplier';
import { toast } from 'react-hot-toast';
import { usePurchase } from '../hooks/usePurchase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Purchase() {
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

  const { productSuppliers } = useProductSuppliers();
  const { purchase, setPurchase, loading, error } = usePurchase();
  const [selectedProductSupplier, setSelectedProductSupplier] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0); // New state for total amount

  const activeProductSuppliers = productSuppliers.filter((ps) => ps.status === 'active');

  const handleProductChange = (event) => {
    const productSupplierId = parseInt(event.target.value, 10);
    const productSupplier = activeProductSuppliers.find((ps) => ps.product_supplier_id === productSupplierId);
    setSelectedProductSupplier(productSupplier);
    setQuantity(0);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value ? parseInt(value, 10) : '');
    }
  };

  useEffect(() => {
    // Recalculate the total amount when quantity or selectedProductSupplier changes
    if (selectedProductSupplier && quantity > 0) {
      const total = selectedProductSupplier.unit_price * quantity;
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  }, [selectedProductSupplier, quantity]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    if (selectedProductSupplier && quantity > 0) {
      const newPurchase = {
        product_id: selectedProductSupplier.product.product_id,
        supplier_id: selectedProductSupplier.supplier.supplier_id,
        unit_price: selectedProductSupplier.unit_price,
        quantity: quantity,
      };
  
      try {
        // Send request to create the purchase
        const response = await fetch('/api/purchase/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPurchase),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          toast.success(data.message);
  
          // Ensure total_amount is parsed as a number
          const totalAmountFromServer = parseFloat(data.purchase_request.total_amount);
          
          // Check if the totalAmount is valid
          if (isNaN(totalAmountFromServer)) {
            toast.error('Invalid total amount received from the server.');
            setIsSubmitting(false);
            return;
          }
  
          // Optimistically add the new purchase to the state
          const newPurchaseData = {
            product_name: selectedProductSupplier.product.name,
            brand: selectedProductSupplier.product.brand,
            model: selectedProductSupplier.product.model,
            quantity: quantity,
            total_amount: totalAmountFromServer,
            status: 'pending',
            request_date: new Date().toISOString(),
          };

          // Update the purchase state with the new purchase
          setPurchase((prevPurchases) => [
            ...prevPurchases,
            newPurchaseData,
          ]);

          // Clear form inputs after submitting
          setSelectedProductSupplier(null);
          setQuantity(0);
        } else {
          toast.error(data.error || 'An error occurred');
        }
      } catch (error) {
        toast.error('Failed to make the request');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please select a product and enter a valid quantity');
      setIsSubmitting(false);
    }
  };

  // Sorting purchases in descending order by request_date and limiting to the most recent 5
  const sortedPurchases = purchase
    .sort((a, b) => new Date(b.request_date) - new Date(a.request_date))
    .slice(0, 5);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Purchase Request</h2>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                onChange={handleProductChange}
                required
                value={selectedProductSupplier?.product_supplier_id || ''}
              >
                <option value="">Select a product</option>
                {activeProductSuppliers.map((ps) => (
                  <option key={ps.product_supplier_id} value={ps.product_supplier_id}>
                    {ps.product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                value={selectedProductSupplier?.product.category || ''}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Category"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name</label>
              <input
                type="text"
                value={selectedProductSupplier?.supplier.supplier_name || ''}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Supplier Name"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
              <input
                type="text"
                value={selectedProductSupplier?.product.model || ''}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Model"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                value={selectedProductSupplier?.product.brand || ''}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Brand"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price</label>
              <input
                type="text"
                value={selectedProductSupplier ? `₱${selectedProductSupplier.unit_price.toLocaleString()}` : ''}
                className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Unit Price"
                readOnly
              />
            </div>
          </div>

          <div className="border-t border-gray-700 pt-5">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500"
                  required
                  placeholder="0"
                />
              </div>
              <div className="text-center md:text-right w-full">
                <p className="text-lg font-semibold text-gray-800 mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">₱{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className={`w-full md:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transform hover:scale-105 transition-transform duration-300 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-3" /> PURCHASE
            </button>
          </div>
        </form>
      </div>

      {/* Recent Purchases Table */}
      <h2 className="text-xl font-bold mb-4">Recent Purchases</h2>

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
      {sortedPurchases.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Recent Purchases available.</p>
        </div>
      )}

      <div className="relative overflow-y-auto max-h-[690px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {sortedPurchases.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Brand</th>
                <th scope="col" className="px-6 py-4">Model</th>
                <th scope="col" className="px-6 py-4">Quantity</th>
                <th scope="col" className="px-6 py-4">Total Amount</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedPurchases.map((purchase, index) => (
                <tr key={index} className="border-b">
                  <td className="px-6 py-4">{purchase.product_name}</td>
                  <td className="px-6 py-4">{purchase.brand}</td>
                  <td className="px-6 py-4">{purchase.model}</td>
                  <td className="px-6 py-4">{purchase.quantity}</td>
                  <td className="px-6 py-4">₱{parseInt(purchase.total_amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        purchase.status === 'pending' ? 'text-orange-500' : ''
                      } ${purchase.status === 'approved' ? 'text-green-500' : ''} ${
                        purchase.status === 'rejected' ? 'text-red-500' : ''
                      }`}
                    >
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(purchase.request_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
