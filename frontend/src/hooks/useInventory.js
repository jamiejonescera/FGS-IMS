import { useState, useEffect } from 'react';

export function useInventory() {
  const [inventory, setInventory] = useState([]); 
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('/api/inventory/');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory');
        }
        const data = await response.json();
        setInventory(data.inventory);
        setTotalQuantity(data.total_quantity);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  return { inventory, totalQuantity, setInventory, loading, error };
}
