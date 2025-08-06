import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useProducts } from '../hooks/useProducts';
import toast from 'react-hot-toast';
import CategoryDescription from '../components/CategoryDescription';
import ProductModal from '../components/modal/AddProductModal';
import UpdateProductModal from '../components/modal/UpdateProductModal';

export default function Products() {
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

  const { products, loading, error, setProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const newProductRef = useRef(null); 

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.product_type.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.model.toLowerCase().includes(searchLower)
    );
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    productName: '',
    category: '',
    productType: '',
    model: '',
    brand: '',
  });

  const [currentProductId, setCurrentProductId] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormValues({
      productName: '',
      category: '',
      productType: '',
      model: '',
      brand: '',
    });
  };

  const openUpdateModal = (product) => {
    setFormValues({
      productName: product.name,
      category: product.category,
      productType: product.product_type,
      model: product.model,
      brand: product.brand,
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
      category: '',
      productType: '',
      brand: '',
      model: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name: formValues.productName,
      category: formValues.category,
      product_type: formValues.productType,
      model: formValues.model || 'N/A',
      brand: formValues.brand || 'N/A',
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
        throw new Error(errorResponse.error || 'Failed to create product');
      }

      const { product, message } = await response.json();

      closeModal();
      toast.success(message || 'Product added successfully!');

      setProducts((prevProducts) => [
        ...prevProducts,
        product,
      ]);
    } catch (error) {
      closeModal();
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      id: currentProductId,
      name: formValues.productName,
      category: formValues.category,
      product_type: formValues.productType,
      model: formValues.model || 'N/A',
      brand: formValues.brand || 'N/A',
    };

    try {
      const response = await fetch(`/api/products/update/${currentProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.error || 'Failed to update product');
      }

      const { product, message } = jsonResponse;

      // Handle "No changes made" response
      if (!product && message === "No changes made to the product") {
        closeUpdateModal();
        toast.success(message || "No changes made to the product.");
        return;
      }

      closeUpdateModal();
      toast.success(message || 'Product updated successfully!');

      // Update the product in the state without supplier_name
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.product_id === product.product_id
            ? { ...p, ...product }
            : p
        )
      );
    } catch (error) {
      closeUpdateModal();
      console.error('Update Error:', error);
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/products/delete/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to delete product');
        return;
      }

      toast.success(data.message || 'Product deleted successfully!');

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.product_id !== productId)
      );
    } catch (error) {
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  // Smooth scroll to the newly added product
  useEffect(() => {
    if (newProductRef.current) {
      newProductRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [products]);

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
              value={searchTerm}
              onChange={handleSearchChange}
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
      {filteredProducts.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Product available.</p>
        </div>
      )}

      <div className="relative overflow-y-auto max-h-[600px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {filteredProducts.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Product Name</th>
                <th scope="col" className="px-6 py-4">Model</th>
                <th scope="col" className="px-6 py-4">Brand</th>
                <th scope="col" className="px-6 py-4">Category</th>
                <th scope="col" className="px-6 py-4">Product Type</th>
                <th scope="col" className="px-6 py-4">Created at</th>
                <th scope="col" className="px-6 py-4">Updated at</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={`${product.product_id}-${index}`}
                  className="odd:bg-white even:bg-gray-50 border-b"
                  ref={index === filteredProducts.length - 1 ? newProductRef : null} // Reference the last item
                >
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.model}</td>
                  <td className="px-6 py-4">{product.brand}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1)}</td>
                  <td className="px-6 py-4">{formatDate(product.created_at)}</td>
                  <td className="px-6 py-4">{formatDate(product.updated_at)}</td>
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

      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        closeModal={closeUpdateModal}
        handleUpdate={handleUpdate}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </div>
  );
}