import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import MovieQuality from '../components/movie/MovieQuality';
import { fetchJSON } from '../services/tmdb/client';
import { movieServers, freeMovie, getFreeMovieSource, allowExternalPlayers } from '../services/playback';

export default function WatchPage({ mediaType = 'movie' }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const positiveNumber = value => /^\d+$/.test(value || '') && Number(value) > 0 ? Number(value) : 1;
  const season = positiveNumber(params.get('season'));
  const episode = positiveNumber(params.get('episode'));
  const [language, setLanguage] = useState('id');
  const isFree = id === freeMovie.id;
  const [data, setData] = useState(null);
  const [metadataError, setMetadataError] = useState(false);
  const [server, setServer] = useState('vidsrc');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');
  const [attempt, setAttempt] = useState(0);
  const warning = useRef(null);
  const [approvedFor, setApprovedFor] = useState('');
  const playerKey = `${mediaType}:${id}:${season}:${episode}:${server}`;
  const approved = approvedFor === playerKey;

  useEffect(() => {
    if (!isFree && allowExternalPlayers && !approved) warning.current?.showModal();
    else warning.current?.close();
  }, [playerKey, isFree, approved]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setData(null);
    setMetadataError(false);
    setServer('vidsrc');
    setSource('');
    setStatus('');
    if (isFree) {
      setStatus('Memuat video gratis…');
      const timeout = setTimeout(() => controller.abort(), 15000);
      getFreeMovieSource(controller.signal)
        .then(url => { if (active) { setSource(url); setStatus('Siap diputar — tekan Play.'); } })
        .catch(() => { if (active) { setSource(freeMovie.fallback); setStatus('Menggunakan sumber Internet Archive.'); } })
        .finally(() => clearTimeout(timeout));
    } else {
      fetchJSON(`/${mediaType}/${id}?append_to_response=videos`)
        .then(result => { if (active) setData(result); })
        .catch(() => { if (active) setMetadataError(true); });
    }
    return () => { active = false; controller.abort(); };
  }, [id, isFree, mediaType]);

  const trailer = data?.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
  const provider = movieServers.find(item => item.id === server) || movieServers[0];
  const embed = server === 'trailer' && trailer
    ? `https://www.youtube.com/embed/${encodeURIComponent(trailer.key)}` : provider?.url(id, { type: mediaType, season, episode, language });
  const switchServer = value => { setServer(value); setStatus(''); setAttempt(0); };

  return <div className="watch-page">
    <Link to={isFree ? '/' : `/${mediaType}/${id}`}>← Kembali ke {mediaType === 'tv' ? 'serial' : 'film'}</Link>
    <h1 style={{ margin: '12px 0 8px' }}>{isFree ? freeMovie.title : data?.title || data?.name || `Judul #${id}`}</h1>
    {mediaType === 'tv' && <p className="episode-caption">Season {season} · Episode {episode}</p>}
    <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
      {isFree ? 'Film pendek lengkap · Gratis · Tanpa iklan' : !allowExternalPlayers ? 'Mode bebas iklan · Pemutar video langsung' : server === 'trailer' ? 'Trailer' : 'Server eksternal · Iklan dari penyedia mungkin muncul'}
    </p>
    {metadataError && <p style={{ color: 'var(--muted)', marginBottom: 12 }}>Detail film gagal dimuat. Pemutar tetap dapat digunakan.</p>}
    {!isFree && allowExternalPlayers && server !== 'trailer' && <MovieQuality id={id} server={server} mediaType={mediaType}/>}
    {!isFree && allowExternalPlayers && <dialog className="ad-warning" ref={warning} aria-labelledby="ad-warning-title" aria-describedby="ad-warning-description">
      <span className="warning-symbol" aria-hidden="true">!</span><p className="eyebrow">SEBELUM MENONTON</p>
      <h2 id="ad-warning-title">Server film mungkin berisi iklan</h2>
      <p id="ad-warning-description">Video diputar dari server pihak ketiga. Iklan atau pop-up mungkin muncul dan tidak dikendalikan oleh CineVault.</p>
      <div className="warning-actions"><button onClick={() => warning.current.close()}>Batal</button><button className="confirm-play" onClick={() => { setApprovedFor(playerKey); warning.current.close(); }}>Lanjutkan menonton →</button></div>
    </dialog>}
    {!isFree && allowExternalPlayers && <div className="player-actions" role="group" aria-label="Video source">
      {movieServers.map(item => <button key={item.id} aria-pressed={server === item.id} onClick={() => switchServer(item.id)}>{item.name}</button>)}
      {trailer && <button aria-pressed={server === 'trailer'} onClick={() => switchServer('trailer')}>Trailer</button>}
      <button onClick={() => { setAttempt(n => n + 1); setStatus(''); }}>Muat ulang pemutar</button>
    </div>}
    {!isFree && allowExternalPlayers && server !== 'trailer' && <div className="subtitle-settings">
      <div className="filter-control"><label htmlFor="subtitle-language">Subtitle</label><select id="subtitle-language" value={server === 'vixsrc' ? 'manual' : language} disabled={server === 'vixsrc'} onChange={event => setLanguage(event.target.value)}>{server !== 'vixsrc' ? <><option value="id">Indonesia</option><option value="en">English</option></> : <option value="manual">Pilih melalui CC pemutar</option>}</select></div>
      <p>{server === 'vidsrc' ? `Prioritas ${language === 'id' ? 'Indonesia, lalu English bila tidak tersedia' : 'English'}. Mengganti bahasa memuat ulang video. Pilihan CC mengikuti koleksi server.` : server === 'vidfast' ? 'Bahasa dikirim ke pemutar sesuai pilihan Indonesia / English; ketersediaan mengikuti film. Buka pengaturan kualitas untuk memilih resolusi tertinggi yang tersedia. Jika gagal, pilih sumber lain lewat tombol server di dalam pemutar.' : 'Buka CC di pemutar dan pilih English. Server 2 belum menyediakan pilihan Indonesia yang dapat diverifikasi; gunakan Server 1 untuk Indonesia.'} Subtitle bawaan mengikuti versi video masing-masing server. Jika meleset, coba track CC lain atau pindah server.</p>
    </div>}
    {!isFree && allowExternalPlayers && server === 'vidsrc' && <details className="subtitle-help"><summary>Subtitle terlalu cepat atau terlambat?</summary><p>Buka <strong>CC → Options → Subtitle delay</strong> di dalam pemutar. Jika teks muncul terlalu cepat, tekan <strong>+</strong> untuk menundanya. Jika terlambat, tekan <strong>−</strong>. Setiap langkah menggeser 0,25 detik; <strong>Reset timing</strong> mengembalikan ke 0.</p><p>Pilih track Indonesia atau English yang sesuai versi video. Jika memakai audio Korea asli, hindari track bertanda <em>English dub</em>; track <em>forced</em> biasanya hanya mencakup sebagian dialog. Bila selisih waktunya terus berubah, ganti track CC atau server.</p></details>}
    <div className={`watch-player${!isFree && (!allowExternalPlayers || !approved) ? ' player-empty' : ''}`}>
      {isFree ? source && <video key={source + attempt} src={source} controls playsInline preload="metadata" aria-label={freeMovie.title}
        onPlaying={() => setStatus('Sedang diputar')}
        onPause={() => setStatus('Dijeda')}
        onEnded={() => setStatus('Selesai')}
        onError={() => {
          if (source !== freeMovie.fallback) { setSource(freeMovie.fallback); setStatus('Mencoba sumber Internet Archive…'); }
          else setStatus('Video gagal dimuat. Coba lagi atau buka sumber langsung.');
        }} />
        : allowExternalPlayers && approved ? <iframe key={`${playerKey}:${server === 'vidsrc' || server === 'vidfast' ? language : ''}:${attempt}`} src={embed} title={`${data?.title || data?.name || 'Video'} — ${server === 'trailer' ? 'Trailer' : provider.name}`}
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          : allowExternalPlayers ? <div className="unavailable-player"><span aria-hidden="true">▷</span><h2>Siap untuk menonton?</h2><p>Server belum dibuka. Lanjutkan setelah membaca pemberitahuan iklan.</p><button className="primary-link" onClick={() => warning.current.showModal()}>Buka pemutar →</button></div>
          : <div className="unavailable-player"><span aria-hidden="true">▷</span><h2>Sumber tanpa iklan belum tersedia</h2><p>Film ini ada di katalog, tetapi belum memiliki sumber video langsung. Server dengan iklan dan pop-up tidak dimuat.</p><Link className="primary-link" to={`/watch/${freeMovie.id}`}>Tonton Big Buck Bunny tanpa iklan →</Link></div>}
    </div>
    {status && <p role="status" style={{ margin: '12px 0', color: 'var(--muted)' }}>{status}</p>}
    {isFree ? <div className="player-actions">
      <a href={freeMovie.website} target="_blank" rel="noreferrer">{freeMovie.attribution}</a>
      {source && <a href={source} target="_blank" rel="noreferrer">Buka video langsung ↗</a>}
      <button onClick={() => { setAttempt(n => n + 1); setStatus('Siap dicoba lagi.'); }}>Coba lagi</button>
    </div> : <p style={{ color: 'var(--muted)', margin: '16px 0' }}>
      {allowExternalPlayers ? 'Pemutar disediakan pihak ketiga; iklan dan ketersediaan film tergantung server. ' : 'Hanya sumber video langsung yang digunakan dalam mode bebas iklan. '}
      <Link to={`/watch/${freeMovie.id}`}>Tonton film gratis: {freeMovie.title} →</Link>
    </p>}
    {data?.overview && <section style={{ marginTop: 24 }}><h3>Overview</h3><p>{data.overview}</p></section>}
  </div>;
}
