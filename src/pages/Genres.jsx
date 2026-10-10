import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchJSON } from '../services/tmdb';
export default function GenresPage() {
  const [genres,setGenres]=useState([]);
  const [error,setError]=useState('');
  const [type,setType]=useState('movie');
  useEffect(()=>{
    let active=true;setGenres([]);setError('');
    fetchJSON(`/genre/${type}/list`).then(data=>{if(active)setGenres(data.genres || []);}).catch(()=>{if(active)setError('Genre gagal dimuat.');});
    return ()=>{active=false;};
  },[type]);
  return <div><div className="catalog-toolbar"><div><p className="eyebrow">TEMUKAN SELERA ANDA</p><h1>Jelajahi genre</h1></div><div className="filter-control"><label htmlFor="genre-type">Jenis</label><select id="genre-type" value={type} onChange={event=>setType(event.target.value)}><option value="movie">Film</option><option value="tv">Serial TV</option></select></div></div>{error && <p role="alert">{error}</p>}<div className="genre-grid">{genres.map(genre=><Link key={genre.id} to={`/?type=${type}&genre=${genre.id}`}><span>{genre.name}</span><span>↗</span></Link>)}</div></div>;
}
