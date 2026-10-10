import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovie, searchTV } from '../services/tmdb/search';
import MovieGrid from '../components/movie/MovieGrid';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const type = params.get('type') === 'tv' ? 'tv' : 'movie';
  const [input, setInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => { setInput(query); }, [query]);
  useEffect(() => {
    let active = true;
    setError('');
    setResults([]);
    if (!query.trim()) { setLoading(false); return; }
    setLoading(true);
    (type === 'tv' ? searchTV(query) : searchMovie(query))
      .then(data => { if (active) setResults(data.results || []); })
      .catch(() => { if (active) setError('Pencarian gagal dimuat. Coba lagi.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, type, retry]);
  return <div>
    <p className="eyebrow">FIND YOUR NEXT STORY</p><h1 style={{ margin: '8px 0 24px' }}>Cari film & serial<span className="title-dot">.</span></h1>
    <form onSubmit={event => { event.preventDefault(); setParams({ q: input.trim(), type }); }} style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:28 }}>
      <input aria-label="Search title" value={input} onChange={event => setInput(event.target.value)} placeholder="Judul yang ingin kamu temukan…" style={{ padding:12, flex:'1 1 200px', minWidth:0 }}/>
      <select aria-label="Search category" value={type} onChange={event => setParams({ q: query, type: event.target.value })} style={{ padding:12 }}><option value="movie">Film</option><option value="tv">Serial TV</option></select>
      <button type="submit">Cari →</button>
    </form>
    {loading && <p role="status" style={{ color:'var(--muted)' }}>Mencari film…</p>}
    {error && <div className="notice" role="alert">{error}<button onClick={() => setRetry(n => n + 1)}>Coba lagi</button></div>}
    {!loading && !error && (query ? <><p style={{ color:'var(--muted)', marginBottom:20, fontSize:13 }}>Hasil untuk “{query}” · {results.length} judul</p><MovieGrid items={results} type={type}/></> : <p style={{ color:'var(--muted)' }}>Ketik judul film atau serial untuk mulai mencari.</p>)}
  </div>;
}
