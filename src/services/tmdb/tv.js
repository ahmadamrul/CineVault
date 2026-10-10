import { fetchJSON } from './client';
export const getPopularTV = () => fetchJSON('/tv/popular');
