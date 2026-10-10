import { fetchJSON } from './client';
export const searchMovie = q => fetchJSON('/search/movie?query=' + encodeURIComponent(q));
export const searchTV = q => fetchJSON('/search/tv?query=' + encodeURIComponent(q));
