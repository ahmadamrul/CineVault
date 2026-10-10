// Fill complete poster rows without inventing titles or discarding API leftovers.
export async function loadCatalogItems(fetchPage, count) {
  const items=[];
  const seen=new Set();
  let page=1;
  let totalPages=1;
  do {
    const data=await fetchPage(page);
    totalPages=Math.min(data.total_pages || 1,500);
    for(const item of data.results || []) {
      if(!seen.has(item.id)){seen.add(item.id);items.push(item);}
    }
    page++;
  } while(items.length<count && page<=totalPages);
  return {items:items.slice(0,count),hasMore:items.length>count || page<=totalPages};
}
