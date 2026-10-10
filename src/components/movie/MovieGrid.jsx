import MovieCard from './MovieCard';
import EmptyState from '../common/EmptyState';
export default function MovieGrid({ items, type = 'movie' }) {
  if (!items || items.length === 0) return <EmptyState message="No items found." />;
  return (
    <div className="movie-grid">
      {items.map(i => <MovieCard key={i.id} item={i} type={type} />)}
    </div>
  );
}
