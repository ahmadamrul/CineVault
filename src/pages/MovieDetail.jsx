import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJSON, imgUrl } from '../services/tmdb/client';
import { allowExternalPlayers } from '../services/playback';
import MovieQuality from '../components/movie/MovieQuality';
import SaveActions from '../components/movie/SaveActions';
import MovieGrid from '../components/movie/MovieGrid';
export default function MovieDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setData(null);
    setErr('');
    fetchJSON('/movie/'+id+'?append_to_response=credits,videos,recommendations')
      .then(d=>{ if (active) { setData(d); setErr(''); } })
      .catch(()=>{ if (active) setErr('Failed to load (rate-limited or error)'); });
    return () => { active = false; };
  }, [id, retry]);
  const handleRetry = () => { setErr(''); setData(null); setRetry(r => r + 1); };
  if(err) return <div style={{color:'var(--error)', padding: 24}}>{err} <button onClick={handleRetry}>Retry</button></div>;
  if(!data) return <div style={{color:'var(--muted)', padding: 24}}>Loading movie details…</div>;
  const trailer = data.videos?.results?.find(v=>v.type==='Trailer' && v.site==='YouTube');
  const backdrop = imgUrl(data.backdrop_path,'w1280') || imgUrl(data.poster_path,'w1280') || '';
  return <div>
    <img src={backdrop} alt={data.title} style={{width:'100%',maxHeight:420,objectFit:'cover',borderRadius:16,marginBottom:16}} />
    <h1>{data.title}</h1>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12, color: 'var(--muted)', fontSize: 14 }}>
      <span style={{ background: 'var(--accent)', color: '#111', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>★ {data.vote_average?.toFixed(1)}</span>
      <span>{data.release_date ? data.release_date.slice(0, 4) : ''}</span>
      <span>•</span>
      <span>{data.runtime ? data.runtime + ' min' : ''}</span>
      <span>•</span>
      <span>{data.genres?.map(g => g.name).join(', ')}</span>
    </div>
    <p style={{ color: 'var(--text)', marginBottom: 16 }}>{data.overview || 'No overview available.'}</p>
    {allowExternalPlayers && <MovieQuality id={id}/>}
    <div className="detail-actions">
      <Link to={`/watch/${id}`} style={{ background:'var(--accent)', color:'#111', padding:'8px 16px', borderRadius:8, fontWeight:700, textDecoration:'none', fontSize:14 }}>▶ Play / Watch</Link>
      <SaveActions item={data}/>
    </div>
    {trailer && allowExternalPlayers ? <p><Link to={`/watch/${id}`}>Lihat trailer & pilihan server →</Link></p> : <p style={{color:'var(--muted)'}}>{trailer ? 'Embed trailer dinonaktifkan dalam mode bebas iklan.' : 'No trailer available.'}</p>}
    <section style={{marginTop:24}}><h3>Cast</h3>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>{data.credits?.cast?.slice(0,6).map(c=> (
        <div key={c.id} style={{minWidth:100,borderRadius:8,padding:8,background:'var(--card)'}}>
          <strong>{c.name}</strong><br/><span style={{fontSize:12,color:'var(--muted)'}}>{c.character}</span>
        </div>
      ))}</div>
    </section>
    <section className="detail-recommendations"><h2>Rekomendasi untukmu</h2>
      <MovieGrid items={data.recommendations?.results?.slice(0,12) || []}/>
    </section>
  </div>;
}
