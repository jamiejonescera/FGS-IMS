import { useState, useEffect } from 'react';

export function useDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await fetch('/api/department/');
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    }

    fetchDepartments();
  }, []);

  return { departments, setDepartments, loading, error };
}
