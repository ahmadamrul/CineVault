import { useState, useEffect } from 'react';
import { fetchJSON } from '../services/tmdb/client';
export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchJSON('/movie/popular')
      .then(d => setMovies(d.results ? d.results.slice(0, 8) : []))
      .catch(err => { setError(err); throw err; });
  }, []);
  return { movies, error };
}
