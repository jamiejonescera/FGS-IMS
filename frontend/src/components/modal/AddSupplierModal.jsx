import React, { useState, useEffect } from "react";
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddSupplierModal({
  showModal,
  setShowModal,
  formData,
  handleInputChange,
  handleAddSupplier,
}) {
  const [regionList, setRegionList] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [barangayList, setBarangayList] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [street, setStreet] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);


  // Function to reset the form
  const resetForm = () => {
    setSelectedRegion("");
    setSelectedProvince("");
    setSelectedCity("");
    setSelectedBarangay("");
    setStreet("");
    handleInputChange({ target: { name: "supplier_name", value: "" } });
    handleInputChange({ target: { name: "contact_number", value: "" } });
    handleInputChange({ target: { name: "address", value: "" } });
  };

  // Fetch regions on component mount
  useEffect(() => {
    regions().then((data) => setRegionList(data));
  }, []);

  // Fetch provinces when a region is selected
  useEffect(() => {
    if (selectedRegion) {
      provinces(selectedRegion).then((data) => setProvinceList(data));
      setCityList([]);
      setBarangayList([]);
      setSelectedProvince("");
      setSelectedCity("");
      setSelectedBarangay("");
    }
  }, [selectedRegion]);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (selectedProvince) {
      cities(selectedProvince).then((data) => setCityList(data));
      setBarangayList([]);
      setSelectedCity("");
      setSelectedBarangay("");
    }
  }, [selectedProvince]);

  // Fetch barangays when a city is selected
  useEffect(() => {
    if (selectedCity) {
      barangays(selectedCity).then((data) => setBarangayList(data));
      setSelectedBarangay("");
    }
  }, [selectedCity]);

  // Update the address field in formData
  useEffect(() => {
    const fullAddress = `${street}, Brgy ${selectedBarangay}, ${
      cityList.find((city) => city.city_code === selectedCity)?.city_name || ""
    }, ${
      provinceList.find((province) => province.province_code === selectedProvince)
        ?.province_name || ""
    }, ${
      regionList.find((region) => region.region_code === selectedRegion)?.region_name || ""
    }`;
    handleInputChange({ target: { name: "address", value: fullAddress } });
  }, [selectedRegion, selectedProvince, selectedCity, selectedBarangay, street]);

  // Handle submission and reset form
  const handleSubmit = async () => {
    try {
      await handleAddSupplier(); 
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Address Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Supplier</h2>

        {/* Region */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select Region</option>
            {regionList.map((region) => (
              <option key={region.region_code} value={region.region_code}>
                {region.region_name}
              </option>
            ))}
          </select>
        </div>

        {/* Province */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Province
          </label>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={!selectedRegion}
          >
            <option value="">Select Province</option>
            {provinceList.map((province) => (
              <option key={province.province_code} value={province.province_code}>
                {province.province_name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={!selectedProvince}
          >
            <option value="">Select City</option>
            {cityList.map((city) => (
              <option key={city.city_code} value={city.city_code}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        {/* Barangay */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Barangay
          </label>
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={!selectedCity}
          >
            <option value="">Select Barangay</option>
            {barangayList.map((barangay) => (
              <option key={barangay.brgy_code} value={barangay.brgy_name}>
                {barangay.brgy_name}
              </option>
            ))}
          </select>
        </div>

        {/* Street */}
        <div className="mb-4">
          <label
            htmlFor="street"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Street
          </label>
          <input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter street name"
            autoComplete="off"
          />
        </div>

         {/* Supplier Name */}
         <div className="mb-4">
          <label
            htmlFor="supplier_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Supplier Name
          </label>
          <input
            type="text"
            id="supplier_name"
            name="supplier_name"
            value={formData.supplier_name}
            onChange={handleInputChange}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter supplier name"
            autoComplete="off"
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label
            htmlFor="contact_number"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contact Number
          </label>
          <input
            type="text"
            id="contact_number"
            name="contact_number"
            value={formData.contact_number}
            onChange={(e) => {
              if (e.target.value.length <= 11) {
                handleInputChange(e);
              }
            }}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter contact number"
            autoComplete="off"
            maxLength={11}
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
          <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowModal(false);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
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
      </div>
    </div>
  );
}
  