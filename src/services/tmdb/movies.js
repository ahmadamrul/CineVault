import { fetchJSON } from './client';
export const getPopular = () => fetchJSON('/movie/popular');
