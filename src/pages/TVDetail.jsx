import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchJSON, imgUrl } from '../services/tmdb';
import SaveActions from '../components/movie/SaveActions';
import MovieGrid from '../components/movie/MovieGrid';

export default function TVDetailPage() {
  const { id } = useParams();
  const [data,setData] = useState(null);
  const [error,setError] = useState('');
  const [season,setSeason] = useState(1);
  const [episodes,setEpisodes] = useState([]);
  const [episodeError,setEpisodeError] = useState('');
  const [loadingEpisodes,setLoadingEpisodes] = useState(false);
  const [retry,setRetry] = useState(0);
  useEffect(()=>{
    let active=true;
    setData(null);setError('');setEpisodes([]);
    fetchJSON(`/tv/${id}?append_to_response=credits,recommendations`)
      .then(result=>{if(active){setData(result);setSeason(result.seasons?.find(item=>item.season_number>0)?.season_number || 1);}})
      .catch(()=>{if(active)setError('Detail serial gagal dimuat.');});
    return ()=>{active=false;};
  },[id,retry]);
  useEffect(()=>{
    if(!data)return;
    let active=true;
    setEpisodes([]);setEpisodeError('');setLoadingEpisodes(true);
    fetchJSON(`/tv/${id}/season/${season}`)
      .then(result=>{if(active)setEpisodes(result.episodes || []);})
      .catch(()=>{if(active)setEpisodeError('Daftar episode gagal dimuat. Coba pilih season lagi.');})
      .finally(()=>{if(active)setLoadingEpisodes(false);});
    return ()=>{active=false;};
  },[data,id,season,retry]);
  if(error)return <div className="notice" role="alert">{error}<button onClick={()=>setRetry(n=>n+1)}>Coba lagi</button></div>;
  if(!data)return <p role="status">Memuat serial…</p>;
  return <div className="series-detail">
    <Link to="/tv">← Serial TV</Link>
    <section className="catalog-featured series-featured">
      {data.backdrop_path && <img className="featured-backdrop" src={imgUrl(data.backdrop_path,'w1280')} alt=""/>}
      <div className="featured-content"><p className="eyebrow">TV SERIES · {data.origin_country?.join(' / ')}</p><h1>{data.name}</h1><p className="featured-meta">★ {data.vote_average?.toFixed(1)} · {data.first_air_date?.slice(0,4)} · {data.number_of_seasons} season</p><p className="featured-overview">{data.overview}</p></div>
    </section>
    <SaveActions item={data} type="tv"/>
    <section aria-labelledby="episodes-title">
      <div className="catalog-toolbar"><h2 id="episodes-title">Pilih episode</h2><div className="filter-control"><label htmlFor="season">Season</label><select id="season" value={season} onChange={event=>setSeason(Number(event.target.value))}>{data.seasons?.filter(item=>item.season_number>0).map(item=><option key={item.id} value={item.season_number}>{item.name} · {item.episode_count} episode</option>)}</select></div></div>
      {loadingEpisodes && <p role="status">Memuat episode…</p>}
      {episodeError && <div className="notice" role="alert">{episodeError}<button onClick={()=>setRetry(n=>n+1)}>Coba lagi</button></div>}
      {!loadingEpisodes && !episodeError && !episodes.length && <p>Episode belum tersedia.</p>}
      <div className="episode-grid">{episodes.map(item=>{
        const upcoming=item.air_date && item.air_date>new Date().toISOString().slice(0,10);
        const content=<><span className="episode-number">{String(item.episode_number).padStart(2,'0')}</span><div><strong>{item.name || `Episode ${item.episode_number}`}</strong><p>{item.runtime ? `${item.runtime} menit · ` : ''}{item.air_date || 'Tanggal belum diketahui'}{upcoming ? ' · Segera hadir' : ''}</p></div><span>{upcoming?'◷':'▶'}</span></>;
        return upcoming ? <div key={item.id} className="episode-card upcoming-episode">{content}</div> : <Link key={item.id} className="episode-card" to={`/watch/tv/${id}?season=${season}&episode=${item.episode_number}`}>{content}</Link>;
      })}</div>
    </section>
    <section className="series-cast"><h2>Pemeran</h2><div>{data.credits?.cast?.slice(0,8).map(person=><article key={person.id}><strong>{person.name}</strong><p>{person.character}</p></article>)}</div></section>
    <section className="detail-recommendations"><h2>Serial pilihan lainnya</h2><MovieGrid items={data.recommendations?.results?.slice(0,12) || []} type="tv"/></section>
  </div>;
}
