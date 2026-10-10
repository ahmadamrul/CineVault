import MovieGrid from '../components/movie/MovieGrid';
export default function MoviesPage({ movies = [] }) {
  return <div><h2>Popular Movies</h2><MovieGrid items={movies} /></div>;
}
