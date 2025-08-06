import { useState, useEffect } from 'react';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]); 
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await fetch('/api/supplier/'); 
        if (!response.ok) {
          throw new Error('Failed to fetch suppliers'); 
        }
        const data = await response.json();
        setSuppliers(data.suppliers || []);
        setTotalSuppliers(data.total_suppliers || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  return { suppliers, totalSuppliers, setSuppliers, loading, error };
}
