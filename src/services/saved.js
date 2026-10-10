export const SAVED_EVENT='cinevault-saved-change';
export function readSaved(key){
  try{const value=JSON.parse(localStorage.getItem(key) || '[]');return Array.isArray(value)?value.filter(item=>item && item.id!=null):[];}catch{return [];}
}
export const sameSaved=(a,b)=>String(a.id)===String(b.id) && (a.media_type || 'movie')===(b.media_type || 'movie');
export function savedMetadata(item,type='movie'){
  return {id:item.id,media_type:type,title:item.title,name:item.name,poster_path:item.poster_path,backdrop_path:item.backdrop_path,release_date:item.release_date,first_air_date:item.first_air_date,vote_average:item.vote_average};
}
export function writeSaved(key,items){localStorage.setItem(key,JSON.stringify(items));window.dispatchEvent(new Event(SAVED_EVENT));}
export function toggleSaved(key,item,type='movie'){
  const metadata=savedMetadata(item,type),list=readSaved(key),exists=list.some(old=>sameSaved(old,metadata));
  writeSaved(key,exists?list.filter(old=>!sameSaved(old,metadata)):[...list,metadata]);return !exists;
}
