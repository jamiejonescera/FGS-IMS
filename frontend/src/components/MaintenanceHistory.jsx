import React from 'react';

const MaintenanceHistory = ({ maintenanceRecords, searchTerm, setSearchTerm }) => {
  const filteredHistory = maintenanceRecords
    .filter(
      (maintenance) =>
        maintenance.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.engineer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.maintenance_id - a.maintenance_id);

  return (
    <div className="w-1/5">
      <h3 className="text-xl font-bold mb-4">Maintenance History</h3>
      {/* Search Bar */}
      <div className="mb-4">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search history"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      </div>

      <div className="max-h-[680px] overflow-y-auto scrollbar-hidden space-y-4">
        {filteredHistory.map((maintenance) => (
          <div key={maintenance.maintenance_id} className="bg-white p-4 rounded-lg shadow-lg">
            <h4 className="font-semibold">Maintenance {maintenance.product_name}</h4>
            {/* <p>Status: {maintenance.status}</p> */}
            <p
  className={`inline-block rounded 
    ${maintenance.status === 'pending' ? 'text-orange-500' : ''}
    ${maintenance.status === 'in_progress' ? 'text-blue-500' : ''}
    ${maintenance.status === 'completed' ? 'text-green-500' : ''}
    ${maintenance.status === 'condemned' ? 'text-red-500' : ''}`}
>
  {maintenance.status
    .replace(/_/g, ' ')
    .split(' ') // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(' ')} 
</p>

            <p>Description: {maintenance.description}</p>
            <p>Engineer Name: {maintenance.engineer_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceHistory;
