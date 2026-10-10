import { useState } from 'react';
import { Link } from 'react-router-dom';
import { imgUrl } from '../../utils/imageUrl';
import PosterQuality from './PosterQuality';
export default function MovieCard({ item, type = 'movie' }) {
  const [failed, setFailed] = useState(false);
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  return <Link to={`/${type}/${item.id}`} className="movie-card" aria-label={`${title}${year ? ', ' + year : ''}`}>
    <div className="poster-wrap">
      {item.poster_path && !failed ? <img src={imgUrl(item.poster_path, 'w342')} alt={title} loading="lazy" onError={() => setFailed(true)}/> : <div className="poster-placeholder"><span>▧</span><p>{title}</p></div>}
      <span className="rating-badge"><span>★</span> {item.vote_average ? item.vote_average.toFixed(1) : '—'}</span>
      <PosterQuality id={item.id} type={type}/>
      <span className="poster-play" aria-hidden="true">↗</span>
      <span className="poster-type">{type === 'tv' ? 'SERIES' : 'MOVIE'}</span>
    </div>
    <div className="movie-card-info"><h3 title={title}>{title}</h3><p>{year || 'Coming soon'}<span>{type === 'tv' ? 'TV Series' : 'Film'}</span></p></div>
  </Link>;
}
