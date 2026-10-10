import { useEffect, useState } from 'react';
import { SAVED_EVENT, readSaved, sameSaved, toggleSaved } from '../../services/saved';
import { useToast } from '../common/Toast';
export default function SaveActions({ item,type='movie' }){
  const [version,setVersion]=useState(0);
  const notify=useToast();
  useEffect(()=>{const refresh=()=>setVersion(n=>n+1);window.addEventListener(SAVED_EVENT,refresh);window.addEventListener('storage',refresh);return ()=>{window.removeEventListener(SAVED_EVENT,refresh);window.removeEventListener('storage',refresh);};},[]);
  const identity={...item,media_type:type};
  const favorite=readSaved('cinevault_favorites').some(old=>sameSaved(old,identity));
  const watchlist=readSaved('cinevault_watchlist').some(old=>sameSaved(old,identity));
  function toggle(key,label){try{const added=toggleSaved(key,item,type);notify(`${item.title || item.name} ${added?'ditambahkan ke':'dihapus dari'} ${label}.`);}catch{notify('Penyimpanan browser tidak tersedia. Koleksi belum tersimpan.');}}
  return <div className="save-actions">
    <button className={favorite?'is-saved':''} aria-pressed={favorite} onClick={()=>toggle('cinevault_favorites','Favorit')}><svg viewBox="0 0 24 24" width="18" height="18" fill={favorite?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>{favorite?'Difavoritkan':'Tambah favorit'}</button>
    <button className={watchlist?'is-saved':''} aria-pressed={watchlist} onClick={()=>toggle('cinevault_watchlist','Watchlist')}><svg viewBox="0 0 24 24" width="18" height="18" fill={watchlist?'currentColor':'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z"/></svg>{watchlist?'Di watchlist':'Tonton nanti'}</button>
  </div>;
}
