// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { useProducts } from '../hooks/useProducts';
// import { useSuppliers } from '../hooks/useSupplier';
// import toast from 'react-hot-toast';
// import CategoryDescription from '../components/CategoryDescription';
// import ProductModal from '../components/modal//AddProductModal';

// export default function Products() {
//   const { products, loading, error, setProducts } = useProducts();
//   const { suppliers, loading: loadingSuppliers } = useSuppliers();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formValues, setFormValues] = useState({
//     productName: '',
//     description: '',
//     unitPrice: '',
//     category: '',
//     productType: '',
//     supplierId: ''
//   });

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setFormValues({
//       productName: '',
//       description: '',
//       unitPrice: '',
//       category: '',
//       productType: '',
//       supplierId: ''
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const supplierIDInt = parseInt(formValues.supplierId, 10);
//     if (isNaN(supplierIDInt)) {
//       toast.error('Please select a valid supplier.');
//       return;
//     }

//     const newProduct = {
//       name: formValues.productName,
//       description: formValues.description,
//       unit_price: parseFloat(formValues.unitPrice),
//       category: formValues.category,
//       product_type: formValues.productType,
//       supplier_id: supplierIDInt,
//     };

//     try {
//       const response = await fetch('/api/products/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error('Error:', errorResponse);
//         throw new Error(errorResponse.error || 'Failed to create product');
//       }

//       const { product, message } = await response.json();

//       const supplier = suppliers.find((s) => s.supplier_id === product.supplier_id);
//       const supplierName = supplier ? supplier.supplier_name : 'Unknown Supplier';

//       closeModal();
//       toast.success(message || 'Product added successfully!');

//       // Add the new product to the products list
//       setProducts((prevProducts) => [
//         ...prevProducts,
//         { ...product, supplier_name: supplierName },
//       ]);
//     } catch (error) {
//       closeModal();
//       toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
//     }
//   };

//   const handleDelete = async (productId) => {
//     try {
//       const response = await fetch(`/api/products/delete/${productId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         console.error('Error:', errorResponse);
//         toast.error('Failed to delete product');
//         return;
//       }

//       const { message } = await response.json();
//       toast.success(message || 'Product deleted successfully!');

//       setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
//     } catch (error) {
//       toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
//     }
//   };


//   return (
//     <div className="p-6">
//       <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
//         <h2 className="text-2xl font-bold">Predefined Products</h2>
//         <div className="flex items-center">
//           <label className="input input-bordered flex items-center gap-20 mr-5">
//             <input
//               type="text"
//               className="grow"
//               placeholder="Search"
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
//             onClick={openModal}
//             type="button"
//             className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
//           >
//             <FontAwesomeIcon icon={faPlus} className="mr-2" /> PRODUCTS
//           </button>
//         </div>
//       </div>
//       <CategoryDescription />

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
//       {products.length === 0 && !loading && !error && (
//         <div className="flex justify-center items-center h-32 text-gray-500">
//           <p>No Product available.</p>
//         </div>
//       )}

//       <div className="relative overflow-y-auto max-h-[600px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
//         {products.length > 0 && (
//           <table className="w-full text-sm text-left rtl:text-right text-gray-500">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-4 w-16">Product Id</th> 
//                 <th scope="col" className="px-6 py-4 w-1/4">Product Name</th>
//                 <th scope="col" className="px-6 py-4 w-1/4">Description</th>
//                 <th scope="col" className="px-6 py-4 w-24">Unit Price</th>
//                 <th scope="col" className="px-6 py-4 w-1/4">Category</th>
//                 <th scope="col" className="px-6 py-4 w-1/4">Product Type</th>
//                 <th scope="col" className="px-6 py-4 w-1/4">Supplier Name</th>
//                 <th scope="col" className="px-6 py-4 w-32">Created at</th>
//                 <th scope="col" className="px-6 py-4 w-32">Updated at</th>
//                 <th scope="col" className="px-6 py-4 w-1/5">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product, index) => (
//                 <tr key={`${product.product_id}-${index}`} className="odd:bg-white even:bg-gray-50 border-b">
//                   <td className="px-6 py-4 text-center">{index + 1}</td>
//                   <td className="px-6 py-4">{product.name}</td>
//                   <td className="px-6 py-4">{product.description}</td>
//                   <td className="px-6 py-4">{product.unit_price}</td>
//                   <td className="px-6 py-4">{product.category}</td>
//                   <td className="px-6 py-4">{product.product_type}</td>
//                   <td className="px-6 py-4">{product.supplier_name}</td>
//                   <td className="px-6 py-4">{product.created_at}</td>
//                   <td className="px-6 py-4">{product.updated_at}</td>
//                   <td className="px-6 py-4 flex space-x-2 justify-center">
//                     <button
//                       onClick={() => openUpdateModal(product.product_id)}
//                       className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2"
//                     >
//                       <FontAwesomeIcon icon={faEdit} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.product_id)}
//                       className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2"
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

//       <ProductModal
//         isOpen={isModalOpen}
//         closeModal={closeModal}
//         handleSubmit={handleSubmit}
//         formValues={formValues}
//         setFormValues={setFormValues}
//       />
//     </div>
//   );
// }

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSupplier';
import toast from 'react-hot-toast';
import CategoryDescription from '../components/CategoryDescription';
import ProductModal from '../components/modal//AddProductModal';
import UpdateProductModal from '../components/modal/UpdateProductModal';

export default function Products() {
  const { products, loading, error, setProducts } = useProducts();
  const { suppliers, loading: loadingSuppliers } = useSuppliers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    productName: '',
    description: '',
    unitPrice: '',
    category: '',
    productType: '',
    supplierId: ''
  });

  const [currentProductId, setCurrentProductId] = useState(null);

  const openUpdateModal = (product) => {
    setFormValues({
      productName: product.name,
      description: product.description,
      unitPrice: product.unit_price,
      category: product.category,
      productType: product.product_type,
      supplierId: product.supplier_id
    });
    setCurrentProductId(product.product_id); 
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    resetFormValues();
  };

  const resetFormValues = () => {
    setFormValues({
      productName: '',
      description: '',
      unitPrice: '',
      category: '',
      productType: '',
      supplierId: ''
    });
  };

  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   const supplierIDInt = parseInt(formValues.supplierId, 10);
  //   if (isNaN(supplierIDInt)) {
  //     toast.error('Please select a valid supplier.');
  //     return;
  //   }

  //   const updatedProduct = {
  //     id: currentProductId,
  //     name: formValues.productName,
  //     description: formValues.description,
  //     unit_price: parseFloat(formValues.unitPrice),
  //     category: formValues.category,
  //     product_type: formValues.productType,
  //     supplier_id: supplierIDInt,
  //   };

  //   try {
  //     const response = await fetch(`/api/products/update/${currentProductId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(updatedProduct),
  //     });

  //     if (!response.ok) {
  //       const errorResponse = await response.json();
  //       console.error('Error:', errorResponse);
  //       throw new Error(errorResponse.error || 'Failed to update product');
  //     }

  //     const { message } = await response.json();
  //     closeUpdateModal();
  //     toast.success(message || 'Product updated successfully!');

  //     // Update the product in the products list
  //     setProducts((prevProducts) =>
  //       prevProducts.map((product) =>
  //         product.product_id === currentProductId ? { ...product, ...updatedProduct } : product
  //       )
  //     );
  //   } catch (error) {
  //     closeUpdateModal();
  //     toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
  //   }
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    const supplierIDInt = parseInt(formValues.supplierId, 10);
    if (isNaN(supplierIDInt)) {
      toast.error('Please select a valid supplier.');
      return;
    }
  
    const updatedProduct = {
      id: currentProductId,
      name: formValues.productName,
      description: formValues.description,
      unit_price: parseFloat(formValues.unitPrice),
      category: formValues.category,
      product_type: formValues.productType,
      supplier_id: supplierIDInt,
    };
  
    try {
      const response = await fetch(`/api/products/update/${currentProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error:', errorResponse);
        throw new Error(errorResponse.error || 'Failed to update product');
      }
  
      const { product, message } = await response.json();
      closeUpdateModal();
      toast.success(message || 'Product updated successfully!');
  
      // Get the supplier's name from the suppliers list
      const updatedSupplier = suppliers.find(supplier => supplier.supplier_id === product.supplier_id);
      const updatedSupplierName = updatedSupplier ? updatedSupplier.supplier_name : 'Unknown Supplier';
  
      // Update the product in the state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.product_id === product.product_id
            ? { ...p, ...product, supplier_name: updatedSupplierName }
            : p
        )
      );
    } catch (error) {
      closeUpdateModal();
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };
  


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormValues({
      productName: '',
      description: '',
      unitPrice: '',
      category: '',
      productType: '',
      supplierId: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierIDInt = parseInt(formValues.supplierId, 10);
    if (isNaN(supplierIDInt)) {
      toast.error('Please select a valid supplier.');
      return;
    }

    const newProduct = {
      name: formValues.productName,
      description: formValues.description,
      unit_price: parseFloat(formValues.unitPrice),
      category: formValues.category,
      product_type: formValues.productType,
      supplier_id: supplierIDInt,
    };

    try {
      const response = await fetch('/api/products/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error:', errorResponse);
        throw new Error(errorResponse.error || 'Failed to create product');
      }

      const { product, message } = await response.json();

      const supplier = suppliers.find((s) => s.supplier_id === product.supplier_id);
      const supplierName = supplier ? supplier.supplier_name : 'Unknown Supplier';

      closeModal();
      toast.success(message || 'Product added successfully!');

      // Add the new product to the products list
      setProducts((prevProducts) => [
        ...prevProducts,
        { ...product, supplier_name: supplierName },
      ]);
    } catch (error) {
      closeModal();
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products/delete/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('Error:', errorResponse);
        toast.error('Failed to delete product');
        return;
      }

      const { message } = await response.json();
      toast.success(message || 'Product deleted successfully!');

      setProducts((prevProducts) => prevProducts.filter((product) => product.product_id !== productId));
    } catch (error) {
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Predefined Products</h2>
        <div className="flex items-center">
          <label className="input input-bordered flex items-center gap-20 mr-5">
            <input
              type="text"
              className="grow"
              placeholder="Search"
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
            onClick={openModal}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" /> PRODUCTS
          </button>
        </div>
      </div>
      <CategoryDescription />

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
      {products.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Product available.</p>
        </div>
      )}

      <div className="relative overflow-y-auto max-h-[600px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {products.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 w-16">Product Id</th> 
                <th scope="col" className="px-6 py-4 w-1/4">Product Name</th>
                <th scope="col" className="px-6 py-4 w-1/4">Description</th>
                <th scope="col" className="px-6 py-4 w-24">Unit Price</th>
                <th scope="col" className="px-6 py-4 w-1/4">Category</th>
                <th scope="col" className="px-6 py-4 w-1/4">Product Type</th>
                <th scope="col" className="px-6 py-4 w-1/4">Supplier Name</th>
                <th scope="col" className="px-6 py-4 w-32">Created at</th>
                <th scope="col" className="px-6 py-4 w-32">Updated at</th>
                <th scope="col" className="px-6 py-4 w-1/5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={`${product.product_id}-${index}`} className="odd:bg-white even:bg-gray-50 border-b">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">{product.unit_price}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.product_type}</td>
                  <td className="px-6 py-4">{product.supplier_name}</td>
                  <td className="px-6 py-4">{product.created_at}</td>
                  <td className="px-6 py-4">{product.updated_at}</td>
                  <td className="px-6 py-4 flex space-x-2 justify-center">
                    <button
                      onClick={() => openUpdateModal(product)}
                      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id)}
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

      <ProductModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        formValues={formValues}
        setFormValues={setFormValues}
      />

<UpdateProductModal isOpen={isUpdateModalOpen} closeModal={closeUpdateModal} handleUpdate={handleUpdate} formValues={formValues} setFormValues={setFormValues} />
    </div>
  );
}

