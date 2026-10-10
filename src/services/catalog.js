export const COUNTRIES = [
  { id:'ID', label:'Indonesia' }, { id:'KR', label:'Korea Selatan' }, { id:'TH', label:'Thailand' },
  { id:'JP', label:'Jepang' }, { id:'CN', label:'China' }, { id:'TW', label:'Taiwan' },
  { id:'US', label:'Amerika Serikat' }, { id:'GB', label:'Inggris' }, { id:'IN', label:'India' },
  { id:'MY', label:'Malaysia' }, { id:'PH', label:'Filipina' }, { id:'FR', label:'Prancis' },
];
export const SORTS = [
  { id:'popular', label:'Popular' }, { id:'weekly', label:'Trending Weekly' },
  { id:'daily', label:'Trending Today' }, { id:'latest', label:'Rilis Terbaru' },
  { id:'rated', label:'Top Rated' }, { id:'upcoming', label:'Upcoming' },
];
export function catalogRequest({ type='movie', sort='popular', country='', genre='', page=1, today=new Date().toISOString().slice(0,10) }) {
  const media = type === 'tv' ? 'tv' : 'movie';
  const query = new URLSearchParams({ page:String(page), include_adult:'false', language:'en-US' });
  if (!country && !genre && (sort === 'weekly' || sort === 'daily')) return `/trending/${media}/${sort === 'weekly' ? 'week' : 'day'}?${query}`;
  if (!country && !genre && sort === 'popular') return `/${media}/popular?${query}`;
  if (!country && !genre && sort === 'rated') return `/${media}/top_rated?${query}`;
  if (country) query.set('with_origin_country',country);
  if (genre) query.set('with_genres',genre);
  const date = media === 'tv' ? 'first_air_date' : 'primary_release_date';
  query.set('sort_by',sort === 'rated' ? 'vote_average.desc' : sort === 'latest' || sort === 'upcoming' ? `${date}.desc` : 'popularity.desc');
  if (sort === 'rated') query.set('vote_count.gte','100');
  if (sort === 'latest') { query.set(`${date}.lte`,today); query.set('vote_count.gte','5'); }
  if (sort === 'upcoming') { query.set(`${date}.gte`,today); query.set('sort_by',`${date}.asc`); }
  return `/discover/${media}?${query}`;
}
