import { useState, useEffect } from 'react';

export function useProductSuppliers() {
  const [productSuppliers, setProductSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductSuppliers() {
      try {
        const response = await fetch('/api/product-suppliers/');
        if (!response.ok) {
          throw new Error('Failed to fetch product suppliers');
        }
        const data = await response.json();
        setProductSuppliers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProductSuppliers();
  }, []);

  return { productSuppliers, setProductSuppliers, loading, error };
}