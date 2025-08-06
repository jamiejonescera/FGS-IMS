import { useState, useEffect } from 'react';

export function useRecentPurchase() {
  const [recentpurchase, setRecentPurchase] = useState([]);  
  const [loading, setLoading] = useState(true);          
  const [error, setError] = useState(null); 

  useEffect(() => {
    // Function to fetch the recent purchases from the API
    async function fetchRecentPurchase() {
      try {
        const response = await fetch('/api/purchase/recent');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recent purchase');
        }
        
        const data = await response.json(); 
        setRecentPurchase(data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPurchase();
  }, []);

  return { recentpurchase, setRecentPurchase, loading, error }; 
}
