import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useLayoutEffect, useRef } from 'react';
import HomePage from './pages/Home';
import GenresPage from './pages/Genres';
import MovieDetail from './pages/MovieDetail';
import SearchPage from './pages/Search';
import TVDetailPage from './pages/TVDetail';
import FavoritesPage from './pages/Favorites';
import WatchlistPage from './pages/Watchlist';
import NotFound from './pages/NotFound';
import WatchPage from './pages/Watch';
import { ToastProvider } from './components/common/Toast';
import { COUNTRIES } from './services/catalog';

function Header() {
  const header=useRef(null);
  useLayoutEffect(()=>{
    const updateHeight=()=>document.documentElement.style.setProperty('--site-header-height',`${header.current?.getBoundingClientRect().height || 80}px`);
    updateHeight();
    const observer=new ResizeObserver(updateHeight);
    observer.observe(header.current);
    return ()=>observer.disconnect();
  },[]);
  const navigate = useNavigate();
  const location=useLocation();
  const cinematic=location.pathname==='/' || location.pathname==='/tv';
  const params=new URLSearchParams(location.search);
  const drakor=params.get('type')==='tv' && params.get('country')==='KR' && params.get('genre')==='18';
  const anime=params.get('type')==='tv' && params.get('country')==='JP' && params.get('genre')==='16';
  const home=location.pathname==='/' && !params.get('country') && !params.get('genre') && params.get('type')!=='tv';
  const tv=location.pathname==='/tv' || (location.pathname==='/' && params.get('type')==='tv' && !drakor && !anime && !params.get('country'));
  const selected=(value)=>value?'active':undefined;
  return <header className="site-header cinema-header" ref={header}>
    <div className="header-inner">
      <Link to="/" className="brand" aria-label="CineVault home"><span className="brand-mark">C<span>▸</span></span><span>Cine<span className="brand-accent">Vault</span><small>YOUR NEXT GREAT STORY</small></span></Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/" className={selected(home)} aria-current={home?'page':undefined}>Beranda</Link><Link to="/tv" className={selected(tv)} aria-current={tv?'page':undefined}>Serial TV</Link><Link to="/?type=tv&country=KR&genre=18" className={selected(cinematic && drakor)} aria-current={cinematic && drakor?'page':undefined}>Drakor</Link><Link to="/?type=tv&country=JP&genre=16" className={selected(cinematic && anime)} aria-current={cinematic && anime?'page':undefined}>Anime</Link><NavLink to="/genres">Genre</NavLink><details className="country-menu" key={location.pathname+location.search}><summary className={selected(cinematic && !!params.get('country') && !drakor && !anime)}>Negara <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg></summary><div className="country-menu-panel">{COUNTRIES.map(country=><Link to={`/?type=movie&country=${country.id}`} key={country.id}>{country.label}</Link>)}</div></details><NavLink to="/favorites">Favorit</NavLink><NavLink to="/watchlist">Watchlist</NavLink>
      </nav>
      <form className="header-search" role="search" onSubmit={event => { event.preventDefault(); const q = new FormData(event.currentTarget).get('q').trim(); if (q) navigate(`/search?q=${encodeURIComponent(q)}`); }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg>
        <input name="q" aria-label="Search movies" placeholder="Cari film, serial…" autoComplete="off"/><button type="submit" aria-label="Cari film"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg></button>
      </form>
    </div>
  </header>;
}

function AppLayout() {
  const location=useLocation();
  const cinematic=location.pathname==='/' || location.pathname==='/tv';
  return <>
    <a className="skip-link" href="#main">Lewati ke konten</a>
    <Header />
    <main id="main" className={`app-main ${cinematic?'cinema-main':'content-main'}`}>
      <Routes>
        <Route path="/" element={<HomePage />} /><Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/search" element={<SearchPage />} /><Route path="/tv" element={<HomePage defaultType="tv" />} />
        <Route path="/tv/:id" element={<TVDetailPage />} /><Route path="/genres" element={<GenresPage />} />
        <Route path="/favorites" element={<FavoritesPage />} /><Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/watch/:id" element={<WatchPage />} /><Route path="/watch/tv/:id" element={<WatchPage mediaType="tv" />} /><Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <footer className="site-footer"><Link to="/" className="footer-brand">CineVault<span>© {new Date().getFullYear()}</span></Link><p>Temukan cerita yang layak ditonton.</p><span>Movie data by TMDB</span></footer>
  </>;
}
export default function App(){return <BrowserRouter><ToastProvider><AppLayout/></ToastProvider></BrowserRouter>;}
