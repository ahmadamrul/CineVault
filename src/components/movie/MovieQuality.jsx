import { useEffect, useState } from 'react';
import { describeQuality } from '../../services/videoQuality';
import { getMovieQuality } from '../../services/quality';

export default function MovieQuality({ id, server='vidsrc', mediaType='movie' }) {
  const [result,setResult]=useState({state:'loading',data:null});
  useEffect(()=>{
    let active=true;
    setResult({state:'loading',data:null});
    if(server!=='vidsrc' || mediaType!=='movie'){setResult({state:'unknown',data:null});return;}
    getMovieQuality(id).then(value=>{if(active)setResult(value);});
    return ()=>{active=false;};
  },[id,server,mediaType]);
  const quality=describeQuality(result.data?.quality);
  return <div className="quality-info" role="status">
    <span className={`quality-badge quality-${quality.type}`}>{result.state==='loading'?'Mengecek kualitas…':result.state==='unavailable'?'Belum tersedia di Server 1':quality.label}</span>
    <span>{server!=='vidsrc' || mediaType!=='movie'?'Kualitas server ini belum dapat diverifikasi.':result.state==='ready'?`Server 1 · ${quality.source}`:'Data kualitas dari server, bukan rating TMDB.'}</span>
  </div>;
}
