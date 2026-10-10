// External players are enabled, but mounted only after the in-app ad warning.
export const allowExternalPlayers = import.meta.env.VITE_ALLOW_EXTERNAL_PLAYERS !== 'false';
export const movieServers = allowExternalPlayers ? [
  { id: 'vidsrc', name: 'Server 1 · VidSrc', origin:'https://vidsrc.sh', url: (id, {type='movie',season=1,episode=1,language='id'}={}) => `https://vidsrc.sh/embed/${type==='tv'?'tv':'movie'}/${encodeURIComponent(id)}${type==='tv'?`/${season}/${episode}`:''}?ds_lang=${language==='en'?'en':'id,en'}` },
  { id: 'vixsrc', name: 'Server 2 · VixSrc', origin:'https://vixsrc.to', url: (id, {type='movie',season=1,episode=1}={}) => `https://vixsrc.to/${type==='tv'?'tv':'movie'}/${encodeURIComponent(id)}${type==='tv'?`/${season}/${episode}`:''}/?autoplay=false` },
  { id: 'vidfast', name: 'Server 3 · VidFast', origin:'https://vidfast.vc', url: (id, {type='movie',season=1,episode=1,language='id'}={}) => `https://vidfast.vc/${type==='tv'?'tv':'movie'}/${encodeURIComponent(id)}${type==='tv'?`/${season}/${episode}`:''}?autoPlay=true&theme=ff304e&sub=${language==='en'?'en':'id'}` },
] : [];

// Keep this separately labelled; never substitute it for the selected movie.
export const freeMovie = {
  id: 'big-buck-bunny', title: 'Big Buck Bunny',
  attribution: '© 2008 Blender Foundation — CC BY 3.0',
  website: 'https://peach.blender.org/about/',
  api: 'https://video.blender.org/api/v1/videos/bf1f3fb5-b119-4f9f-9930-8e20e892b898',
  fallback: 'https://archive.org/download/BigBuckBunny_328/BigBuckBunny_512kb.mp4',
};

export async function getFreeMovieSource(signal) {
  const response = await fetch(freeMovie.api, { signal });
  if (!response.ok) throw new Error('Free movie source unavailable');
  const video = await response.json();
  const files = (video.files || []).filter(file => file.fileUrl?.endsWith('.mp4'));
  const file = files.find(file => file.resolution?.id === 480) || files[0];
  if (!file) throw new Error('No playable MP4');
  return file.fileUrl;
}
