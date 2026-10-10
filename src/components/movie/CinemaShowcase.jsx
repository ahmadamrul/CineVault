import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { imgUrl } from '../../services/tmdb/client';
import PosterQuality from './PosterQuality';

function HeroBackdrops({ slides, active }) {
  const [loaded,setLoaded]=useState([]);
  const [visible,setVisible]=useState(null);
  useEffect(()=>{
    if(active && loaded.includes(active.backdrop_path))setVisible(active.backdrop_path);
  },[active?.backdrop_path,loaded]);
  return slides.map((item,index)=><img key={item.backdrop_path} className={`cinema-hero-image hero-backdrop${visible===item.backdrop_path?' is-visible':''}`} src={imgUrl(item.backdrop_path,'original')} alt="" fetchPriority={index===0?'high':'low'} onLoad={()=>setLoaded(paths=>paths.includes(item.backdrop_path)?paths:[...paths,item.backdrop_path])}/>);
}

export default function CinemaShowcase({ items, type, genres, collectionKey }) {
  const [selected,setSelected]=useState(0);
  const [paused,setPaused]=useState(false);
  const rail=useRef(null);
  useEffect(()=>{setSelected(0);},[collectionKey]);
  const slides=items.filter(item=>item.backdrop_path).slice(0,5);
  useEffect(()=>{
    if(paused || slides.length<2)return;
    const timer=setInterval(()=>{if(!document.hidden)setSelected(index=>(index+1)%slides.length);},4000);
    return ()=>clearInterval(timer);
  },[paused,slides.length,selected]);
  useEffect(()=>{
    if(paused || items.length<3)return;
    const timer=setInterval(()=>{
      const element=rail.current;
      if(!element || document.hidden || element.scrollWidth<=element.clientWidth)return;
      const end=element.scrollWidth-element.clientWidth;
      const next=element.scrollLeft>=end-4?0:element.scrollLeft+(element.firstElementChild?.getBoundingClientRect().width || 300)+16;
      element.scrollTo({left:Math.min(next,end),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    },4000);
    return ()=>clearInterval(timer);
  },[paused,items.length]);
  const active=slides[Math.min(selected,Math.max(slides.length-1,0))];
  const title=active?.title || active?.name;
  const names=active?.genre_ids?.map(id=>genres.find(genre=>genre.id===id)?.name).filter(Boolean).slice(0,3);
  const shift=direction=>rail.current?.scrollBy({left:direction*rail.current.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  return <>
    <section className={`cinema-hero${!active?' hero-loading':''}`} aria-label="Film dan serial pilihan">
      <HeroBackdrops key={collectionKey} slides={slides} active={active}/>
      <div className="cinema-hero-shade"/>
      <div className="cinema-hero-inner">
        {active ? <div className="cinema-hero-copy" key={active.id}>
          <div className="cinema-kicker"><span className="cinema-type">{type==='tv'?'TV SERIES':'MOVIE'}</span><span>CINEVAULT PICKS</span></div>
          <h1>{title}</h1>
          <div className="cinema-meta"><span className="cinema-rating">★ {active.vote_average?active.vote_average.toFixed(1):'—'}</span><span>{(active.release_date || active.first_air_date || '').slice(0,4)}</span>{names?.length>0 && <span className="hero-genres">{names.join(' · ')}</span>}<span className="hero-quality"><PosterQuality id={active.id} type={type}/></span></div>
          {active.overview && <p className="cinema-description">{active.overview}</p>}
          <Link className="cinema-watch" to={`/${type}/${active.id}`}><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>Tonton sekarang</Link>
        </div> : <div className="cinema-hero-copy"><p className="cinema-kicker">CINEVAULT</p><h1>Cerita berikutnya<br/>menanti kamu.</h1><p className="cinema-description">Jelajahi film dan serial pilihan.</p></div>}
        <div className="cinema-hero-bottom"><div className="hero-controls"><div className="hero-pagination" role="group" aria-label="Pilih film utama">{slides.map((item,index)=><button key={item.id} className={index===selected?'selected':''} aria-pressed={index===selected} aria-label={`Tampilkan ${item.title || item.name}`} onClick={()=>setSelected(index)}/>)}</div><button className="autoplay-toggle" aria-pressed={paused} aria-label={paused?'Lanjutkan pergantian otomatis':'Jeda pergantian otomatis'} onClick={()=>setPaused(value=>!value)}>{paused?'▷':'Ⅱ'}</button><span className="autoplay-caption">4 detik</span></div><span className="hero-index">{String(slides.length?selected+1:0).padStart(2,'0')}<span> / {String(slides.length).padStart(2,'0')}</span></span></div>
      </div>
    </section>
    {items.length>1 && <section className="spotlight-section" aria-labelledby="spotlight-title"><div className="spotlight-heading"><div><span className="section-line"/><h2 id="spotlight-title">Pilihan untukmu</h2></div><div className="rail-actions"><button aria-label="Rekomendasi sebelumnya" onClick={()=>shift(-1)}>←</button><button aria-label="Rekomendasi berikutnya" onClick={()=>shift(1)}>→</button></div></div>
      <div className="spotlight-rail" ref={rail}>{items.slice(1,7).map(item=><Link className="spotlight-card" key={item.id} to={`/${type}/${item.id}`}>
        {item.backdrop_path && <img className="spotlight-background" src={imgUrl(item.backdrop_path,'w780')} alt="" loading="lazy"/>}
        {item.poster_path && <div className="spotlight-poster-wrap"><img className="spotlight-poster" src={imgUrl(item.poster_path,'w185')} alt="" loading="lazy"/><PosterQuality id={item.id} type={type}/></div>}
        <div className="spotlight-copy"><h3>{item.title || item.name}</h3><div className="spotlight-meta"><span>★ {item.vote_average?item.vote_average.toFixed(1):'—'}</span><span>{(item.release_date || item.first_air_date || '').slice(0,4)}</span><span className="spotlight-tag">PILIHAN</span></div><p>{item.overview || 'Temukan cerita selengkapnya.'}</p><span className="spotlight-watch">▷ Tonton sekarang</span></div>
      </Link>)}</div>
    </section>}
  </>;
}

