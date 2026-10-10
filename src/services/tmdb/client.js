const KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const BASE = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const USE_MOCK = !KEY || KEY === 'demo';
export async function fetchJSON(path) {
  if (USE_MOCK) {
    return { results: [{ id: 1, title: 'Mock Movie', poster_path: '/mock.jpg', backdrop_path: '/mock.jpg' }] };
  }
  let attempt = 0;
  while (attempt < 3) {
    try {
      const url = new URL(`${BASE}${path}`, window.location.origin);
      url.searchParams.set('api_key', KEY);
      const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (r.status === 429) { attempt++; await new Promise(x=>setTimeout(x, 400*attempt)); continue; }
      if (!r.ok) throw new Error('TMDB error via proxy ' + r.status);
      return r.json();
    } catch (e) { attempt++; if (attempt>=3) throw e; }
  }
  throw new Error('TMDB rate limit reached. Please retry later.');
}
export const imgUrl = (p, s='w500') => p ? `https://image.tmdb.org/t/p/${s}${p}` : null;
