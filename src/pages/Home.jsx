import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchJSON } from '../services/tmdb/client';
import { COUNTRIES, SORTS, catalogRequest } from '../services/catalog';
import { loadCatalogItems } from '../services/catalogBatch';
import MovieGrid from '../components/movie/MovieGrid';
import CinemaShowcase from '../components/movie/CinemaShowcase';

const collections=[
  {name:'Semua film',query:{}},{name:'Drakor',query:{type:'tv',country:'KR',genre:'18'}},
  {name:'Film Indonesia',query:{country:'ID'}},{name:'Thailand',query:{country:'TH'}},
  {name:'Anime',query:{type:'tv',country:'JP',genre:'16'}},
];
export default function HomePage({ defaultType='movie' }) {
  const [params,setParams]=useSearchParams();
  const navigate=useNavigate();
  const type=params.get('type')==='tv'?'tv':params.get('type')==='movie'?'movie':defaultType;
  const country=COUNTRIES.some(c=>c.id===params.get('country'))?params.get('country'):'';
  const genre=/^\d+$/.test(params.get('genre') || '')?params.get('genre'):'';
  const requestedSort=params.get('sort') || params.get('filter') || 'popular';
  const sort=SORTS.some(s=>s.id===requestedSort)?requestedSort:'popular';
  const filterKey=`${type}:${sort}:${country}:${genre}`;
  const [batch,setBatch]=useState(1);
  const [items,setItems]=useState([]);
  const [genres,setGenres]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [retry,setRetry]=useState(0);
  const [hasMore,setHasMore]=useState(false);
  const lastFilter=useRef(filterKey);
  const requests=useRef(new Map());
  useEffect(()=>{
    let active=true;setGenres([]);
    fetchJSON(`/genre/${type}/list?language=en-US`).then(data=>{if(active)setGenres(data.genres || []);}).catch(()=>{});
    return ()=>{active=false;};
  },[type]);
  useEffect(()=>{
    let active=true;setLoading(true);setError('');
    if(lastFilter.current!==filterKey && batch!==1){lastFilter.current=filterKey;setBatch(1);setItems([]);return ()=>{active=false;};}
    lastFilter.current=filterKey;
    if(batch===1)setItems([]);
    const fetchPage=page=>{
      if(!active)throw new Error('Catalog changed');
      const url=catalogRequest({type,sort,country,genre,page});
      if(!requests.current.has(url))requests.current.set(url,fetchJSON(url).catch(error=>{requests.current.delete(url);throw error;}));
      return requests.current.get(url);
    };
    loadCatalogItems(fetchPage,batch*24)
      .then(result=>{if(active){setItems(result.items);setHasMore(result.hasMore);}})
      .catch(()=>{if(active)setError('Katalog belum berhasil dimuat. Coba lagi.');})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[filterKey,batch,retry]);
  function updateFilter(key,value){
    const next=new URLSearchParams(params);next.delete('filter');
    value?next.set(key,value):next.delete(key);
    if(key==='type')next.delete('genre');
    if((key==='country' || key==='genre') && (sort==='weekly' || sort==='daily'))next.set('sort','popular');
    setBatch(1);setParams(next);
  }
  const countryLabel=COUNTRIES.find(c=>c.id===country)?.label;
  const genreLabel=genres.find(g=>String(g.id)===genre)?.name;
  const heading=country==='KR' && type==='tv' && genre==='18'?'Drama Korea':[type==='tv'?'Serial TV':'Film',countryLabel,genreLabel].filter(Boolean).join(' · ');
  const collection=collections.findIndex(c=>type===(c.query.type || 'movie') && country===(c.query.country || '') && genre===(c.query.genre || ''));
  return <div className="discover-page simple-home cinematic-home">
    <CinemaShowcase items={items} type={type} genres={genres} collectionKey={filterKey}/>
    <section className="catalog-section" aria-labelledby="catalog-title" aria-busy={loading}>
      <div className="simple-catalog-toolbar"><h2 id="catalog-title">{heading}<span className="title-dot">.</span></h2>
        <form className="catalog-search" role="search" onSubmit={event=>{event.preventDefault();const q=new FormData(event.currentTarget).get('query').trim();if(q)navigate(`/search?q=${encodeURIComponent(q)}`);}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input name="query" aria-label="Cari judul film atau serial" placeholder="Cari judul film atau serial…" required/><button type="submit">Cari</button></form>
        <select className="catalog-sort" aria-label="Urutan film" value={sort} onChange={e=>updateFilter('sort',e.target.value)}>{SORTS.map(item=><option key={item.id} value={item.id} disabled={!!(country || genre) && (item.id==='weekly' || item.id==='daily')}>{item.label}</option>)}</select>
      </div>
      <div className="catalog-secondary"><details className="advanced-filters"><summary><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--surface)"/><circle cx="15" cy="17" r="3" fill="var(--surface)"/></svg>Genre & negara <svg className="filter-chevron" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></summary><div className="catalog-filters">
        <div className="filter-control"><label htmlFor="collection-filter">Koleksi</label><select id="collection-filter" value={collection<0?'custom':String(collection)} onChange={e=>{const query=collections[Number(e.target.value)].query;setBatch(1);setParams({type:query.type || 'movie',sort:'popular',...query});}}><option value="custom" disabled>Kustom</option>{collections.map((item,index)=><option key={item.name} value={index}>{item.name}</option>)}</select></div>
        <div className="filter-control"><label htmlFor="media-type">Jenis</label><select id="media-type" value={type} onChange={e=>updateFilter('type',e.target.value)}><option value="movie">Film</option><option value="tv">Serial TV</option></select></div>
        <div className="filter-control"><label htmlFor="genre-filter">Genre</label><select id="genre-filter" value={genre} onChange={e=>updateFilter('genre',e.target.value)}><option value="">Semua genre</option>{genres.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
        <div className="filter-control"><label htmlFor="country-filter">Negara</label><select id="country-filter" value={country} onChange={e=>updateFilter('country',e.target.value)}><option value="">Semua negara</option>{COUNTRIES.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select></div>
      </div></details><div className="catalog-summary">{(country || genre) && <button onClick={()=>{setBatch(1);setParams({type,sort:'popular'});}}>Reset filter ×</button>}<span>{items.length} judul</span></div></div>
      {error && <div className="notice" role="alert">{error}<button onClick={()=>setRetry(n=>n+1)}>Coba lagi</button></div>}
      {loading && !items.length?<div className="movie-grid" aria-label="Memuat film">{Array.from({length:24},(_,i)=><div className="skeleton-card" key={i}><div/><span/><span/></div>)}</div>:<MovieGrid items={items} type={type}/>}
      {items.length>0 && hasMore && <div className="load-more"><button disabled={loading || !!error} onClick={()=>setBatch(n=>n+1)}>{loading?'Memuat…':'Lihat lebih banyak'}<span>↓</span></button></div>}
    </section>
  </div>;
}
