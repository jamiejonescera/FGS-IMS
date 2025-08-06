import { useState, useEffect } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await fetch('/api/inventory/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      setNotifications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication state
    const session = localStorage.getItem("session");
    setIsAuthenticated(!!session);

    if (session) {
      // Fetch initial notifications
      fetchNotifications();

      // Set up polling interval for real-time updates
      const interval = setInterval(fetchNotifications, 1000);

      // Cleanup function
      return () => {
        clearInterval(interval);
        setIsAuthenticated(false);
      };
    }
  }, []);

  return { notifications, setNotifications, loading, error };
}
