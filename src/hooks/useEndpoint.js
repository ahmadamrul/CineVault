import { useState, useEffect } from 'react';
import { fetchJSON, imgUrl } from '../services/tmdb/client';
export default function useMoviesEndpoint(endpoint, page = 1) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    fetchJSON(endpoint + (endpoint.includes('?') ? '&' : '?') + 'page=' + page)
      .then(d => { setItems(d.results || []); setError(null); })
      .catch(e => { setError(e.message || 'Error'); })
      .finally(() => setLoading(false));
  }, [endpoint, page]);
  return { items, loading, error };
}
