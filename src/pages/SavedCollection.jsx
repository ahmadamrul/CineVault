import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/movie/MovieCard';
import { useToast } from '../components/common/Toast';
import { readSaved,writeSaved,sameSaved,SAVED_EVENT,savedMetadata } from '../services/saved';
import { fetchJSON } from '../services/tmdb/client';
export default function SavedCollection({ kind='favorites' }){
  const key=`cinevault_${kind}`,title=kind==='favorites'?'Favorit':'Watchlist';
  const [items,setItems]=useState(()=>readSaved(key));
  const notify=useToast();
  useEffect(()=>{
    let active=true;
    const refresh=()=>{if(active)setItems(readSaved(key));};refresh();
    window.addEventListener(SAVED_EVENT,refresh);window.addEventListener('storage',refresh);
    const legacy=readSaved(key).filter(item=>!Object.hasOwn(item,'poster_path'));
    Promise.allSettled(legacy.map(async item=>{
      const type=item.media_type || 'movie',data=await fetchJSON(`/${type}/${item.id}`);
      if(!active)return;
      const current=readSaved(key);
      if(current.some(old=>sameSaved(old,item)))writeSaved(key,current.map(old=>sameSaved(old,item)?savedMetadata(data,type):old));
    }));
    return ()=>{active=false;window.removeEventListener(SAVED_EVENT,refresh);window.removeEventListener('storage',refresh);};
  },[key]);
  function remove(item){try{writeSaved(key,readSaved(key).filter(old=>!sameSaved(old,item)));notify(`${item.title || item.name} dihapus dari ${title}.`);}catch{notify('Koleksi belum dapat diperbarui.');}}
  return <section className="saved-page"><div className="saved-heading"><span className="saved-symbol">{kind==='favorites'?'♥':'▱'}</span><div><p className="eyebrow">KOLEKSI PRIBADI</p><h1>{title}<span className="saved-count">{items.length}</span></h1></div></div><p className="saved-description">{kind==='favorites'?'Cerita yang kamu suka, dalam satu tempat.':'Daftar film dan serial untuk waktu luang berikutnya.'} Tersimpan di browser perangkat ini, tanpa akun.</p>
    {items.length?<div className="movie-grid saved-grid">{items.map(item=><div className="saved-card" key={`${item.media_type || 'movie'}:${item.id}`}><MovieCard item={item} type={item.media_type || 'movie'}/><button className="remove-saved" aria-label={`Hapus ${item.title || item.name} dari ${title}`} onClick={()=>remove(item)}>×</button></div>)}</div>:<div className="saved-empty"><span>{kind==='favorites'?'♡':'▱'}</span><h2>{title} masih kosong</h2><p>{kind==='favorites'?'Tekan ikon hati di halaman film untuk menambah favorit.':'Tekan ikon bookmark “Tonton nanti” di halaman film atau serial.'}</p><Link className="cinema-watch" to="/">Jelajahi film →</Link></div>}
  </section>;
}
