import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ProductModal = ({ isOpen, closeModal, handleSubmit, formValues, setFormValues }) => {


  // const handleUnitPriceChange = (e) => {
  //   const rawValue = e.target.value.replace(/,/g, "");
  //   if (!isNaN(rawValue) && rawValue !== "") {
  //     const formattedValue = new Intl.NumberFormat("en-US").format(rawValue);
  //     setFormValues({
  //       ...formValues,
  //       unitPrice: rawValue,
  //       unitPriceDisplay: formattedValue,
  //     });
  //   } else if (rawValue === "") {
  //     setFormValues({
  //       ...formValues,
  //       unitPrice: "",
  //       unitPriceDisplay: "",
  //     });
  //   }
  // };

  // Define category options based on product type
   const [isConfirmed, setIsConfirmed] = useState(false);
  const assetCategories = [
    "Classroom Furniture",
    "Electronics",
    "Sports Equipment",
    "Infrastructure",
    "Library Resources",
  ];

  const itemCategories = [
    "Stationery Supplies",
    "Teaching Materials",
    "Art Supplies",
    "Cleaning Supplies",
    "Medical Supplies",
  ];

  // Effect to reset category if product type changes
  useEffect(() => {
    if (formValues.productType === "asset" && !assetCategories.includes(formValues.category)) {
      setFormValues({ ...formValues, category: "" });
    } else if (formValues.productType === "item" && !itemCategories.includes(formValues.category)) {
      setFormValues({ ...formValues, category: "" });
    }
  }, [formValues.productType, formValues.category, setFormValues]);

  if (!isOpen) return null;

  const categoriesToDisplay = formValues.productType === "asset" ? assetCategories : itemCategories;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Flex container for Supplier and Product Type */}
          <div className="mb-4 flex justify-between gap-4">
            <div className="w-full">
              <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                Product Type
              </label>
              <select
                id="productType"
                name="productType"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formValues.productType}
                onChange={(e) => setFormValues({ ...formValues, productType: e.target.value, category: "" })}
                required
              >
                <option value="">Select Product Type</option>
                <option value="asset">Asset</option>
                <option value="item">Item</option>
              </select>
            </div>

            {/* Conditionally Render Categories */}
            {formValues.productType && (
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="mt-1 block w-full px-4 py-2 border rounded-md text-sm"
                  value={formValues.category || ''}
                  onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                  required
                >
                  <option value="">Select a category</option>
                  {categoriesToDisplay.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="productName"
              name="productName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formValues.productName}
              onChange={(e) => setFormValues({ ...formValues, productName: e.target.value })}
              placeholder="Enter Product Name"
              required
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formValues.model}
              onChange={(e) => setFormValues({ ...formValues, model: e.target.value })}
              placeholder="Enter Model"
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={formValues.brand}
              onChange={(e) => setFormValues({ ...formValues, brand: e.target.value })}
              placeholder="Enter Brand"
              autoComplete="off"
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
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

export default ProductModal;
