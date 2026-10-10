export function describeQuality(value) {
  const quality=String(value || '').trim().toUpperCase();
  const resolution=quality.match(/\b(2160|1080|720|480|360)P\b/)?.[0].toLowerCase() || (/\b4K\b/.test(quality)?'2160p':null);
  // Source markers take priority: a 1080p CAM is still a cinema recording.
  if (/\b(?:HD)?CAM(?:RIP)?\b|\b(?:HD)?TS\b|TELESYNC/.test(quality))return {label:/\b(?:HD)?TS\b|TELESYNC/.test(quality)?'TS / CAM':'CAM',type:'cam',resolution,source:'Rekaman bioskop (menurut server)'};
  if (/BLU[ -]?RAY|BDRIP|BRRIP|\bBD\b|REMUX/.test(quality))return {label:'BD',type:'hd',resolution,source:'Sumber Blu-ray / BD (menurut server, belum diverifikasi langsung)'};
  if (/WEB[ ._-]?(?:DL|RIP)|HDTV|\b(?:FULL[ -]?HD|FHD|HD)\b/.test(quality))return {label:'HD',type:'hd',resolution,source:'Sumber HD (menurut server, belum diverifikasi langsung)'};
  if (/DVD/.test(quality))return {label:'DVD',type:'sd',resolution,source:'Sumber DVD (menurut server)'};
  // Pixel dimensions describe the file, not whether it came from CAM, WEB or BD.
  return {label:'Sumber belum diketahui',type:'unknown',resolution,source:resolution?`Server hanya menyebut resolusi ${resolution}; sumber CAM / HD / BD belum diketahui.`:'Server belum menyebut sumber CAM / HD / BD.'};
}

export function posterQualityLabel(value) {
  const info=describeQuality(value);
  return info.type==='unknown'?'Sumber ?':info.label;
}
