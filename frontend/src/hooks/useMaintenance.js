import { useState, useEffect } from 'react';

export function useMaintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [totalMaintenance, setTotalMaintenance] = useState(0);
  const [totalCondemned, setTotalCondemned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMaintenance() {
      try {
        const response = await fetch('/api/maintenance/');
        if (!response.ok) {
          throw new Error('Failed to fetch maintenance records');
        }
        const data = await response.json();

        // Update states based on API response structure
        setTotalCondemned(data.total_condemned);
        setTotalMaintenance(data.total_maintenance); 
        setMaintenanceRecords(data.maintenances);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMaintenance();
  }, []);

  return { maintenanceRecords, setMaintenanceRecords, totalMaintenance, totalCondemned, loading, error };
}
