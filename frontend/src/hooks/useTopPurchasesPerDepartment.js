import { useState, useEffect } from 'react';

export function useTopPurchasesPerDepartment() {
  const [topPurchasesDepartment, setTopPurchasesDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopPurchases() {
      try {
        const response = await fetch('/api/department-request/top-purchases');
        if (!response.ok) {
          throw new Error('Failed to fetch top purchases per department');
        }
        const data = await response.json();
        setTopPurchasesDepartment(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPurchases();
  }, []);

  return { topPurchasesDepartment, setTopPurchasesDepartment, loading, error };
}