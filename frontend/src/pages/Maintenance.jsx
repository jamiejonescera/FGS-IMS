import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useMaintenance } from '../hooks/useMaintenance';
import { useProducts } from '../hooks/useProducts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddMaintenanceModal from '../components/modal/AddMaintenanceModal';
import ManageMaintenanceModal from '../components/modal/ManageMaintenanceModal';
import MaintenanceHistory from '../components/MaintenanceHistory';

const Maintenance = () => {
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
    return `${date.toLocaleString('en-GB', options)} GMT`;
  };

  const { maintenanceRecords, setMaintenanceRecords, loading, error } = useMaintenance();
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);

  // Reference to the scrollable container
  const tableContainerRef = useRef(null);

  useEffect(() => {
    if (tableContainerRef.current) {
      setTimeout(() => {
        tableContainerRef.current.scrollTo({
          top: tableContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 300);
    }
  }, [maintenanceRecords]);

  const handleManageClick = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setIsManageModalOpen(true);
  };

  const [formData, setFormData] = useState({
    product_id: '',
    description: '',
    engineer_name: '',
    scheduled_date: '',
  });

  const filteredMaintenance = maintenanceRecords.filter(
    (maintenance) =>
      maintenance.status.includes(statusFilter) || statusFilter === ''
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/maintenance/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create maintenance record');

      const newRecord = await response.json();

      toast.success('Maintenance record created successfully');
      setIsModalOpen(false);
      setFormData({
        product_id: '',
        description: '',
        engineer_name: '',
        scheduled_date: '',
      });
      setMaintenanceRecords((prevRecords) => [...prevRecords, newRecord]);
    } catch (error) {
      toast.error('Error creating maintenance record');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6 border-b-2 border-gray-500 pb-2">
            <h2 className="text-2xl font-bold">Maintenance Details</h2>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Maintenance
              </button>
              <select
                className="select select-bordered"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="condemned">Condemned</option>
              </select>
            </div>
          </div>

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
          {filteredMaintenance.length === 0 && !loading && !error && (
            <div className="flex justify-center items-center h-32 text-gray-500">
              <p>No maintenance records found.</p>
            </div>
          )}

          <div
            className="relative overflow-y-auto max-h-[750px] shadow-md sm:rounded-lg mb-6 custom-scrollbar"
            ref={tableContainerRef} // Attach the ref here
          >
            {filteredMaintenance.length > 0 && (
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4">Maintenance Id</th>
                    <th scope="col" className="px-6 py-4">Product Name</th>
                    <th scope="col" className="px-6 py-4">Problem Description</th>
                    <th scope="col" className="px-6 py-4">Engineer Name</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4">Scheduled Date</th>
                    <th scope="col" className="px-6 py-4">Completed Date</th>
                    <th scope="col" className="px-6 py-4">Action Taken</th>
                    <th scope="col" className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaintenance.map((maintenance) => (
                    <tr
                      key={maintenance.maintenance_id}
                      className="odd:bg-white even:bg-gray-50 border-b"
                    >
                      <td className="px-6 py-4">{maintenance.maintenance_id}</td>
                      <td className="px-6 py-4">{maintenance.product_name}</td>
                      <td className="px-6 py-4">{maintenance.description}</td>
                      <td className="px-6 py-4">{maintenance.engineer_name}</td>
                      <td
                        className={`px-6 py-4 
                          ${maintenance.status === 'pending' ? 'text-orange-500' : ''}
                          ${maintenance.status === 'in_progress' ? 'text-blue-500' : ''}
                          ${maintenance.status === 'completed' ? 'text-green-500' : ''}
                          ${maintenance.status === 'condemned' ? 'text-red-500' : ''}`}
                      >
                        {maintenance.status
                          .replace(/_/g, ' ')
                          .split(' ')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(' ')}
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(maintenance.scheduled_date)}
                      </td>
                      <td className="px-6 py-4">
                        {maintenance.completed_date
                          ? formatDate(maintenance.completed_date)
                          : 'Not Completed'}
                      </td>
                      <td className="px-6 py-4">
                        {maintenance.notes ? maintenance.notes : 'Not Completed'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleManageClick(maintenance)}
                          className={`font-medium rounded-lg text-sm px-3 py-2 
                            ${maintenance.status === 'completed' || maintenance.status === 'condemned' 
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                              : 'bg-blue-700 text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300'
                            }`}
                          disabled={maintenance.status === 'completed'}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <MaintenanceHistory
          maintenanceRecords={maintenanceRecords}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <AddMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        products={products}
      />

      <ManageMaintenanceModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        maintenance={selectedMaintenance}
        setMaintenanceRecords={setMaintenanceRecords}
      />
    </div>
  );
};

export default Maintenance;
