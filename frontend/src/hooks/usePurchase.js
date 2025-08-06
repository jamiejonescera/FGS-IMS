import { useState, useEffect } from 'react';

export function usePurchase() {
  const [purchase, setPurchase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPurchase() {
      try {
        const response = await fetch('/api/purchase/');
        if (!response.ok) {
          throw new Error('Failed to fetch purchase');
        }
        const data = await response.json();
        setPurchase(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    }

    fetchPurchase();
  }, []);

  return { purchase, setPurchase, loading, error };
}
