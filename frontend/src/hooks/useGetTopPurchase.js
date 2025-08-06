import { useState, useEffect } from 'react';

// Custom hook to fetch top 10 products based on approved purchase requests
export function useGetTopPurchase() {
  const [topPurchases, setTopPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopPurchases() {
      try {
        // Fetch data from the API
        const response = await fetch('/api/purchase/top10approvedproducts');
        if (!response.ok) {
          throw new Error('No Purhchases Made Yet');
        }
        const data = await response.json();
        setTopPurchases(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPurchases();
  }, []);

  return { topPurchases, setTopPurchases, loading, error };
}