import { useState, useEffect } from 'react';

export function useEvaluate() {
  const [evaluate, setEvaluate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvaluate() {
      try {
        const response = await fetch('/api/evaluate/');
        if (!response.ok) {
          throw new Error('Failed to fetch evaluate');
        }
        const data = await response.json();
        setEvaluate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    }

    fetchEvaluate();
  }, []);

  return { evaluate, setEvaluate, loading, error };
}
