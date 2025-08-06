import { useState, useEffect } from 'react';
import { useAuth } from '../App'; // Use your auth system

export function useDamages() {
  const [damages, setDamages] = useState([]);
  const [totalDamages, setTotalDamages] = useState(0);
  const [totalPendingDamages, setTotalPendingDamages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useAuth(); // Use your auth context

  const fetchDamages = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 Fetching damages...');
      const response = await fetch('http://localhost:5000/api/damages/', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('🔍 Damages response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch damages: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 Damages data:', data);

      setDamages(data.damaged_items || []);
      setTotalDamages(data.total_damages || 0);
      setTotalPendingDamages(data.total_pending_damages || 0);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('❌ Error fetching damages:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔍 User authenticated, fetching damages...');
      // Fetch initial damages
      fetchDamages();

      // Set up interval for real-time updates (every 30 seconds instead of 1 second)
      const interval = setInterval(fetchDamages, 30000);

      return () => {
        clearInterval(interval);
      };
    } else {
      console.log('🔍 User not authenticated, skipping damage fetch');
      setLoading(false);
    }
  }, [isAuthenticated]); // Re-run when authentication status changes

  return { 
    damages, 
    totalDamages, 
    totalPendingDamages, 
    setDamages, 
    loading, 
    error,
    refetch: fetchDamages // Expose refetch function
  };
}