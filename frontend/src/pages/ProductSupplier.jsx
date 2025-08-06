// import React, { useState } from 'react';
// import { useProductSuppliers } from '../hooks/useProductSupplier';
// import { useSuppliers } from '../hooks/useSupplier';
// import { useProducts } from '../hooks/useProducts';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
// import toast from 'react-hot-toast';

// export default function ProductSupplier() {
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);

//     const options = {
//       weekday: 'short',
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false,
//     };

//     const formattedDate = date.toLocaleString('en-GB', options);

//     return `${formattedDate} GMT`;
//   };

//   const { productSuppliers, setProductSuppliers, loading, error } = useProductSuppliers();
//   const { products } = useProducts();
//   const { suppliers } = useSuppliers();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
//   const [selectedProduct, setSelectedProduct] = useState('');
//   const [selectedSupplier, setSelectedSupplier] = useState('');
//   const [unitPrice, setUnitPrice] = useState('');
//   const [formattedUnitPrice, setFormattedUnitPrice] = useState('');
//   const [selectedSupplierId, setSelectedSupplierId] = useState(null); 
//     const [isConfirmed, setIsConfirmed] = useState(false);

//   // Sort product suppliers by ID
//   const sortedProductSuppliers = [...productSuppliers].sort((a, b) => a.product_supplier_id - b.product_supplier_id);

//   const filteredProductSuppliers = sortedProductSuppliers.filter((supplier) => {
//     if (!supplier || !supplier.product || !supplier.supplier) {
//       return false;
//     }
//     const lowercasedQuery = searchQuery.toLowerCase();
//     return (
//       String(supplier.product_supplier_id).toLowerCase().includes(lowercasedQuery) ||
//       supplier.product.name.toLowerCase().includes(lowercasedQuery) ||
//       supplier.supplier.supplier_name.toLowerCase().includes(lowercasedQuery) ||
//       String(supplier.unit_price).toLowerCase().includes(lowercasedQuery)
//     );
//   });

//   const handleAddSupplier = async (e) => {
//     e.preventDefault();
//     const newSupplier = {
//       product_id: parseInt(selectedProduct),
//       supplier_id: parseInt(selectedSupplier),
//       unit_price: parseFloat(unitPrice.replace(/,/g, '')),
//     };

//     try {
//       const response = await fetch('/api/product-suppliers/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newSupplier),
//       });
//       const result = await response.json();

//       if (response.ok) {
//         toast.success(result.message || 'Supplier added successfully!');
//         setProductSuppliers((prev) => [...prev, result.product_supplier]);

//         handleCloseModal();
//       } else {
//         toast.error(result.error || 'Failed to add supplier.');
//         handleCloseModal();
//       }
//     } catch (error) {
//       toast.error('An unexpected error occurred.');
//       handleCloseModal();
//     }
//   };

//   const handleToggleStatus = async (productSupplierId) => {
//     try {
//       const response = await fetch(`/api/product-suppliers/toggle-status/${productSupplierId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const result = await response.json();

//       if (response.ok) {
//         toast.success(result.message || 'Supplier status updated successfully!');
//         setProductSuppliers((prev) =>
//           prev.map((supplier) =>
//             supplier.product_supplier_id === productSupplierId ? result.product_supplier : supplier
//           )
//         );
//       } else {
//         toast.error(result.error || 'Failed to update supplier status.');
//       }
//     } catch (error) {
//       toast.error('An unexpected error occurred.');
//     }
//   };

//   const handleCloseModal = () => {
//     setIsAddModalOpen(false);
//     setSelectedProduct('');
//     setSelectedSupplier('');
//     setUnitPrice('');
//     setFormattedUnitPrice('');
//     setIsConfirmed(false);
//   };

//   const handleCloseDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSelectedSupplierId(null);
//   };

//   const formatNumberWithCommas = (number) => {
//     return new Intl.NumberFormat().format(number);
//   };

//   const handleChangeUnitPrice = (e) => {
//     const value = e.target.value.replace(/,/g, '');
//     if (!isNaN(value)) {
//       setUnitPrice(value);
//       setFormattedUnitPrice(formatNumberWithCommas(value));
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedSupplierId) return;
    
//     try {
//       const response = await fetch(`/api/product-suppliers/delete/${selectedSupplierId}`, {
//         method: 'DELETE',
//       });

//       const result = await response.json();

//       if (response.ok) {
//         toast.success(result.message || 'Product Supplier deleted successfully!');
//         setProductSuppliers((prev) =>
//           prev.filter((supplier) => supplier.product_supplier_id !== selectedSupplierId)
//         );
//         handleCloseDeleteModal();
//       } else {
//         toast.error(result.error || 'Failed to delete product supplier.');
//       }
//     } catch (error) {
//       toast.error('An unexpected error occurred.');
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
//         <h2 className="text-2xl font-bold">Product Supplier List</h2>
//         <div className="flex items-center">
//           <label className="input input-bordered flex items-center gap-20 mr-5">
//             <input
//               type="text"
//               className="grow"
//               placeholder="Search"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 16 16"
//               fill="currentColor"
//               className="h-4 w-4 opacity-70"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </label>
//           <button
//             type="button"
//             onClick={() => setIsAddModalOpen(true)}
//             className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
//           >
//             <FontAwesomeIcon icon={faPlus} className="mr-2" /> PRODUCT SUPPLIER
//           </button>
//         </div>
//       </div>

//       {/* Loading, Error, and Empty State Messages */}
//       {loading && (
//         <div className="flex justify-center items-center h-32">
//           <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600" role="status" />
//         </div>
//       )}
//       {error && (
//         <div className="flex justify-center items-center h-32 text-red-500">
//           <p>{error}</p>
//         </div>
//       )}
//       {filteredProductSuppliers.length === 0 && !loading && !error && (
//         <div className="flex justify-center items-center h-32 text-gray-500">
//           <p>No product suppliers found.</p>
//         </div>
//       )}

//       {/* Product Suppliers Table */}
//       <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
//         {filteredProductSuppliers.length > 0 && (
//           <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-4">Product Name</th>
//                 <th scope="col" className="px-6 py-4">Model</th>
//                 <th scope="col" className="px-6 py-4">Brand</th>
//                 <th scope="col" className="px-6 py-4">Product Type</th>
//                 <th scope="col" className="px-6 py-4">Category</th>
//                 <th scope="col" className="px-6 py-4">Supplier Name</th>
//                 <th scope="col" className="px-6 py-4">Unit Price</th>
//                 <th scope="col" className="px-6 py-4">Status</th>
//                 <th scope="col" className="px-6 py-4">Created At</th>
//                 <th scope="col" className="px-6 py-4">Updated At</th>
//                 <th scope="col" className="px-6 py-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProductSuppliers.map((supplier) => (
//                 <tr key={supplier.product_supplier_id} className="odd:bg-white even:bg-gray-50 border-b">
//                   <td className="px-6 py-4">{supplier.product.name}</td>
//                   <td className="px-6 py-4">{supplier.product.model ?? 'N/A'}</td>
//                   <td className="px-6 py-4">{supplier.product.brand ?? 'N/A'}</td>
//                   <td className="px-6 py-4">{supplier.product?.product_type ? supplier.product.product_type.charAt(0).toUpperCase() + supplier.product.product_type.slice(1) : 'N/A'}</td>
//                   <td className="px-6 py-4">{supplier.product.category}</td>
//                   <td className="px-6 py-4">{supplier.supplier.supplier_name}</td>
//                   <td className="px-6 py-4">₱{new Intl.NumberFormat().format(supplier.unit_price)}</td>
//                   <td className="px-6 py-4">
//                     <span
//                       className={`${
//                         supplier.status === 'active' ? 'text-green-500' : 'text-red-500'
//                       }`}
//                     >
//                       {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">{formatDate(supplier.created_at)}</td>
//                   <td className="px-6 py-4">{formatDate(supplier.updated_at)}</td>
//                   <td className="px-6 py-4 flex space-x-2">
//                     <div
//                       className={`relative inline-flex items-center cursor-pointer ${
//                         supplier.status === 'active' ? 'bg-green-500' : 'bg-red-500'
//                       } rounded-full w-12 h-6 transition-colors duration-300`}
//                       onClick={() => handleToggleStatus(supplier.product_supplier_id)}
//                     >
//                       <span
//                         className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
//                           supplier.status === 'active' ? 'translate-x-6' : ''
//                         }`}></span>
//                     </div>
//                     {/* Delete Button */}
//                     <button
//                       className="text-red-500 hover:text-red-700"
//                       onClick={() => {
//                         setSelectedSupplierId(supplier.product_supplier_id);
//                         setIsDeleteModalOpen(true);
//                       }}
//                     >
//                       <FontAwesomeIcon icon={faTrash} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h3 className="text-lg font-semibold">Are you sure you want to delete this product supplier?</h3>
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={handleCloseDeleteModal}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Supplier Modal */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h3 className="text-lg font-semibold">Add Product Supplier</h3>
//             <form onSubmit={handleAddSupplier} className="mt-4 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Supplier</label>
//                 <select
//                   value={selectedSupplier}
//                   onChange={(e) => setSelectedSupplier(e.target.value)}
//                   className="input input-bordered w-full"
//                   required
//                 >
//                   <option value="">Select a supplier</option>
//                   {suppliers.map((supplier) => (
//                     <option key={supplier.supplier_id} value={supplier.supplier_id}>
//                       {supplier.supplier_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Product</label>
//                 <select
//                   value={selectedProduct}
//                   onChange={(e) => setSelectedProduct(e.target.value)}
//                   className="input input-bordered w-full"
//                   required
//                 >
//                   <option value="">Select a product</option>
//                   {products.map((product) => (
//                     <option key={product.product_id} value={product.product_id}>
//                       {product.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Unit Price</label>
//                 <input
//                   type="text"
//                   value={formattedUnitPrice}
//                   onChange={handleChangeUnitPrice}
//                   className="input input-bordered w-full"
//                   placeholder="Unit Price"
//                   required
//                 />
//               </div>
//                 {/* Confirmation Checkbox */}
//           <div className="mb-4 flex items-center">
//           <input
//             type="checkbox"
//             id="confirm"
//             checked={isConfirmed}
//             onChange={(e) => setIsConfirmed(e.target.checked)}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label
//             htmlFor="confirm"
//             className="ml-2 block text-sm text-gray-700"
//           >
//             I confirm that the information I filled is correct.
//           </label>
//         </div>
//               <div className="mt-6 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={handleCloseModal}
//                   className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
//                 >
//                   Cancel
//                 </button>
//                    <button
//                             type="submit"
//                             disabled={!isConfirmed} 
//                             className={`px-4 py-2 rounded-lg shadow-sm font-medium focus:outline-none ${
//                               isConfirmed
//                                 ? "bg-green-700 text-white hover:bg-green-800"
//                                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                             }`}
//                           >
//                             <FontAwesomeIcon icon={faPlus} className="mr-2" />
//                             Add
//                           </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { useProductSuppliers } from '../hooks/useProductSupplier';
import { useSuppliers } from '../hooks/useSupplier';
import { useProducts } from '../hooks/useProducts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function ProductSupplier() {
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

  const { productSuppliers, setProductSuppliers, loading, error } = useProductSuppliers();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [formattedUnitPrice, setFormattedUnitPrice] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState(null); 
  const [isConfirmed, setIsConfirmed] = useState(false);
  const newSupplierRef = useRef(null); // Reference to the newly added or updated product supplier

  // Sort product suppliers by ID
  const sortedProductSuppliers = [...productSuppliers].sort((a, b) => a.product_supplier_id - b.product_supplier_id);

  const filteredProductSuppliers = sortedProductSuppliers.filter((supplier) => {
    if (!supplier || !supplier.product || !supplier.supplier) {
      return false;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return (
      String(supplier.product_supplier_id).toLowerCase().includes(lowercasedQuery) ||
      supplier.product.name.toLowerCase().includes(lowercasedQuery) ||
      supplier.supplier.supplier_name.toLowerCase().includes(lowercasedQuery) ||
      String(supplier.unit_price).toLowerCase().includes(lowercasedQuery)
    );
  });

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    const newSupplier = {
      product_id: parseInt(selectedProduct),
      supplier_id: parseInt(selectedSupplier),
      unit_price: parseFloat(unitPrice.replace(/,/g, '')),
    };

    try {
      const response = await fetch('/api/product-suppliers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Supplier added successfully!');
        setProductSuppliers((prev) => [...prev, result.product_supplier]);

        handleCloseModal();
      } else {
        toast.error(result.error || 'Failed to add supplier.');
        handleCloseModal();
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      handleCloseModal();
    }
  };

  const handleToggleStatus = async (productSupplierId) => {
    try {
      const response = await fetch(`/api/product-suppliers/toggle-status/${productSupplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Supplier status updated successfully!');
        setProductSuppliers((prev) =>
          prev.map((supplier) =>
            supplier.product_supplier_id === productSupplierId ? result.product_supplier : supplier
          )
        );
      } else {
        toast.error(result.error || 'Failed to update supplier status.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedProduct('');
    setSelectedSupplier('');
    setUnitPrice('');
    setFormattedUnitPrice('');
    setIsConfirmed(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedSupplierId(null);
  };

  const formatNumberWithCommas = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const handleChangeUnitPrice = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value)) {
      setUnitPrice(value);
      setFormattedUnitPrice(formatNumberWithCommas(value));
    }
  };

  const handleDelete = async () => {
    if (!selectedSupplierId) return;
    
    try {
      const response = await fetch(`/api/product-suppliers/delete/${selectedSupplierId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Product Supplier deleted successfully!');
        setProductSuppliers((prev) =>
          prev.filter((supplier) => supplier.product_supplier_id !== selectedSupplierId)
        );
        handleCloseDeleteModal();
      } else {
        toast.error(result.error || 'Failed to delete product supplier.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  // Smooth scroll to the newly added or updated product supplier
  useEffect(() => {
    if (newSupplierRef.current) {
      newSupplierRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [productSuppliers]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Product Supplier List</h2>
        <div className="flex items-center">
          <label className="input input-bordered flex items-center gap-20 mr-5">
            <input
              type="text"
              className="grow"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> PRODUCT SUPPLIER
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
      {filteredProductSuppliers.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No product suppliers found.</p>
        </div>
      )}

      {/* Product Suppliers Table */}
      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {filteredProductSuppliers.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Supplier Name</th>
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Model</th>
                <th scope="col" className="px-6 py-4">Brand</th>
                <th scope="col" className="px-6 py-4">Product Type</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Unit Price</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Created At</th>
                <th scope="col" className="px-6 py-4">Updated At</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductSuppliers.map((supplier, index) => (
                <tr
                  key={supplier.product_supplier_id}
                  ref={index === filteredProductSuppliers.length - 1 ? newSupplierRef : null}
                  className="odd:bg-white even:bg-gray-50 border-b"
                >
                  <td className="px-6 py-4">{supplier.supplier.supplier_name}</td>
                  <td className="px-6 py-4">{supplier.product.name}</td>
                  <td className="px-6 py-4">{supplier.product.model ?? 'N/A'}</td>
                  <td className="px-6 py-4">{supplier.product.brand ?? 'N/A'}</td>
                  <td className="px-6 py-4">{supplier.product?.product_type ? supplier.product.product_type.charAt(0).toUpperCase() + supplier.product.product_type.slice(1) : 'N/A'}</td>
                  <td className="px-6 py-4">{supplier.product.category}</td>
                  <td className="px-6 py-4">₱{new Intl.NumberFormat().format(supplier.unit_price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        supplier.status === 'active' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatDate(supplier.created_at)}</td>
                  <td className="px-6 py-4">{formatDate(supplier.updated_at)}</td>
                  <td className="px-6 py-4 flex space-x-2">
                  <div
  className={`relative inline-flex items-center cursor-pointer ${
    supplier.status === 'active' ? 'bg-green-500' : 'bg-red-500'
  } w-11 h-5 transition-colors duration-300`}
  onClick={() => handleToggleStatus(supplier.product_supplier_id)}
>
  <span
    className={`absolute left-0 w-6 h-6 bg-white shadow-md transform transition-transform duration-300 ${
      supplier.status === 'active' ? 'translate-x-6' : ''
    }`}
  ></span>
</div>
                    {/* Delete Button */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedSupplierId(supplier.product_supplier_id);
                        setIsDeleteModalOpen(true);
                      }}
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Are you sure you want to delete this product supplier?</h3>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold">Add Product Supplier</h3>
            <form onSubmit={handleAddSupplier} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="input input-bordered w-full"
                  required
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.supplier_id} value={supplier.supplier_id}>
                      {supplier.supplier_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="input input-bordered w-full"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit Price</label>
                <input
                  type="text"
                  value={formattedUnitPrice}
                  onChange={handleChangeUnitPrice}
                  className="input input-bordered w-full"
                  placeholder="Unit Price"
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="confirm"
            className="ml-2 block text-sm text-gray-700"
          >
            I confirm that the information I filled is correct.
          </label>
        </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md mr-2"
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
      )}
    </div>
  );
}