const cache=new Map();
const pending=new Map();
const queue=[];
let active=0;
function drain(){
  while(active<4 && queue.length){
    const work=queue.shift();active++;
    work().finally(()=>{active--;drain();});
  }
}
export function getMovieQuality(id){
  const key=String(id);
  const saved=cache.get(key);
  if(saved && saved.expires>Date.now())return Promise.resolve(saved.result);
  if(pending.has(key))return pending.get(key);
  const promise=new Promise(resolve=>{
    queue.push(async()=>{
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),8000);
      let result={state:'unknown',data:null};
      try{
        const response=await fetch(`https://vidsrc.sh/info/movie/${encodeURIComponent(key)}.json`,{signal:controller.signal});
        if(response.status===404)result={state:'unavailable',data:null};
        else if(response.ok){
          const data=await response.json();
          result=data.status_code===404 ? {state:'unavailable',data:null} : {state:'ready',data};
        }
      }catch{/* Unavailable quality must never turn into a guessed HD/BD badge. */}
      finally{clearTimeout(timer);}
      cache.set(key,{result,expires:Date.now()+(result.state==='unknown'?45000:300000)});
      pending.delete(key);resolve(result);
    });
  });
  pending.set(key,promise);drain();return promise;
}
