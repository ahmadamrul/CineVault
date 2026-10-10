import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPopularTV } from '../services/tmdb/tv';
import { imgUrl } from '../services/tmdb';

export default function TVShowsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  useEffect(() => {
    getPopularTV().then(d => { setItems(d.results || []); setLoading(false); }).catch(e => { setErr('Failed to load TV'); setLoading(false); });
  }, []);
  if (loading) return <div style={{color:'var(--muted)'}}>Loading TV…</div>;
  if (err) return <div style={{color:'var(--error)'}}>{err}</div>;
  return (
    <div>
      <h2>Popular TV Shows</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:16}}>
        {items.map(i => (
          <Link key={i.id} to={`/tv/${i.id}`} style={{textDecoration:'none'}}>
            <div style={{background:'var(--card)', borderRadius:12, padding:8}}>
              <img src={imgUrl(i.poster_path,'w300') || 'https://via.placeholder.com/300x450?text=No+Poster'} alt={i.name} style={{width:'100%',borderRadius:8,height:240,objectFit:'cover'}} />
              <h3 style={{marginTop:8,fontSize:15,color:'var(--text)'}}>{i.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
