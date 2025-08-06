import { useState, useEffect } from 'react';

export function useDepartmentRequest() {
  const [departmentRequests, setDepartmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDepartmentRequests() {
      try {
        const response = await fetch('/api/department-request/');
        if (!response.ok) {
          throw new Error('Failed to fetch department requests');
        }
        const data = await response.json();
        setDepartmentRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDepartmentRequests();
  }, []);

  return { departmentRequests, setDepartmentRequests, loading, error };
}