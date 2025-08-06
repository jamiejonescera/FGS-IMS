import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDepartments } from '../hooks/useDepartments';
import toast from 'react-hot-toast'; 

export default function Departments() {
  const { departments, loading, error, setDepartments } = useDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [departmentName, setDepartmentName] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);
  const newDepartmentRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDepartmentName('');
  };

  // Open Update Modal
  const openUpdateModal = (departmentId, departmentName) => {
    setSelectedDepartmentId(departmentId);
    setDepartmentName(departmentName);
    setIsUpdateModalOpen(true);
  };

  // Close Update Modal
  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setDepartmentName('');
    setSelectedDepartmentId(null);
  };

  // Handle adding a new department
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/department/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ department_name: departmentName }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to create department');
      }

      const { department, message } = await response.json();

      closeModal();
      toast.success(message || 'Department added successfully!');

      setDepartments((prevDepartments) => [
        ...prevDepartments,
        {
          department_id: department.department_id,
          department_name: department.department_name,
          created_at: department.created_at,
          updated_at: department.updated_at,
        },
      ]);
    } catch (error) {
      closeModal();
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  // Handle deleting a department
  const handleDelete = async (departmentId) => {
    try {
      const response = await fetch(`/api/department/delete/${departmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to delete department');
      }

      toast.success('Department deleted successfully!');

      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.department_id !== departmentId)
      );
    } catch (error) {
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  // Handle updating the department
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/department/update/${selectedDepartmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ department_name: departmentName }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update department');
      }

      const { message } = await response.json();

      closeUpdateModal();
      toast.success(message || 'Department updated successfully!');

      setDepartments((prevDepartments) =>
        prevDepartments.map((department) =>
          department.department_id === selectedDepartmentId
            ? { ...department, department_name: departmentName, updated_at: new Date().toISOString() }
            : department
        )
      );
    } catch (error) {
      closeUpdateModal();
      toast.error('Error: ' + (error.message || 'An unexpected error occurred.'));
    }
  };

  // Smooth scroll to the newly added or updated department
  useEffect(() => {
    if (newDepartmentRef.current) {
      newDepartmentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [departments]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
        <h2 className="text-2xl font-bold">Classroom</h2>
        <div className="flex items-center">
          <button
            onClick={openModal}
            type="button"
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />  Classroom
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
      {departments.length === 0 && !loading && !error && (
        <div className="flex justify-center items-center h-32 text-gray-500">
          <p>No Classroom available.</p>
        </div>
      )}

      <div className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar">
        {departments.length > 0 && (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Classroom Name</th>
                <th scope="col" className="px-6 py-4">Created at</th>
                <th scope="col" className="px-6 py-4">Updated at</th>
                <th scope="col" className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department, index) => (
                <tr
                  key={`${department.department_id}-${index}`}
                  className="odd:bg-white even:bg-gray-50 border-b"
                  ref={index === departments.length - 1 ? newDepartmentRef : null} // Reference the last item
                >
                  <td className="px-6 py-4">{department.department_name}</td>
                  <td className="px-6 py-4">{department.created_at}</td>
                  <td className="px-6 py-4">{department.updated_at}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => openUpdateModal(department.department_id, department.department_name)}
                      className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2"
                      aria-label={`Edit department ${department.department_name}`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(department.department_id)}
                      className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2"
                      aria-label={`Delete department ${department.department_name}`}
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

      {/* Modal for adding a new department */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Add Classroom</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Classroom Name</label>
                <input
                  type="text"
                  id="departmentName"
                  name="departmentName"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder='Enter Department'
                  required
                  autoComplete='off'
                />
              </div>
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
                  className="bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for updating an existing department */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Update Classroom</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Classroom Name</label>
                <input
                  type="text"
                  id="departmentName"
                  name="departmentName"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder='Enter Department'
                  required
                  autoComplete='off'
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}