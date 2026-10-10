import { createContext, useContext, useEffect, useState } from 'react';
const ToastContext=createContext(()=>{});
export function ToastProvider({children}){
  const [toast,setToast]=useState(null);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),4500);return ()=>clearTimeout(timer);},[toast]);
  return <ToastContext.Provider value={message=>setToast({message,time:Date.now()})}>{children}<div className={`toast-popup${toast?' shown':''}`} role="status" aria-live="polite" aria-atomic="true">{toast && <><span className="toast-check">✓</span><span>{toast.message}</span><button aria-label="Tutup notifikasi" onClick={()=>setToast(null)}>×</button></>}</div></ToastContext.Provider>;
}
export const useToast=()=>useContext(ToastContext);
