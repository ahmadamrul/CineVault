import { useEffect, useRef, useState } from 'react';
import { getMovieQuality } from '../../services/quality';
import { describeQuality, posterQualityLabel } from '../../services/videoQuality';
export default function PosterQuality({ id, type }) {
  const badge=useRef(null);
  const [result,setResult]=useState({state:'loading',data:null});
  useEffect(()=>{
    let active=true;
    setResult({state:'loading',data:null});
    if(type==='tv'){setResult({state:'unknown',data:null});return;}
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();
      getMovieQuality(id).then(value=>{if(active)setResult(value);});
    },{rootMargin:'200px'});
    if(badge.current)observer.observe(badge.current);
    return ()=>{active=false;observer.disconnect();};
  },[id,type]);
  const quality=describeQuality(result.data?.quality);
  const label=result.state==='loading'?'…':result.state==='unavailable'?'Belum tersedia':posterQualityLabel(result.data?.quality);
  const description=result.state==='loading'?'Memeriksa kualitas Server 1':result.state==='unavailable'?'Video belum tersedia di Server 1':type==='tv'?'Kualitas episode belum terverifikasi':`Server 1 · ${quality.label} · ${quality.source}`;
  return <span ref={badge} className={`poster-quality quality-${quality.type}`} title={description} aria-label={`Kualitas: ${description}`}>{label}</span>;
}
