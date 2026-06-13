/* =====================================================================
   Omnichannel Plus — Shared app scaffold (device frame, icons, helpers)
   Loaded by Operator.html and Management.html. Exposes globals on window.
   ===================================================================== */
const { useState, useEffect, useRef, Fragment } = React;

/* ---------------- Icons ---------------- */
const Ico = {
  chat:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  comment:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  funnel: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4h18l-7 8v7l-4 2v-9z"/></svg>,
  user:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a8 8 0 0 1 13 0"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
  back:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  send:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>,
  spark:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>,
  plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>,
  sun:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>,
  moon:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>,
  check:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
  x:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  eyeoff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.24A9.1 9.1 0 0 1 12 4c7 0 10 8 10 8a18 18 0 0 1-2.16 3.19M6.6 6.6A18 18 0 0 0 2 12s3 8 10 8a9.3 9.3 0 0 0 5.4-1.6M1 1l22 22"/><path d="M9.5 9.5a3 3 0 0 0 4.2 4.2"/></svg>,
  reply:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 17l-5-5 5-5"/><path d="M4 12h11a5 5 0 0 1 5 5v1"/></svg>,
  trash:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/></svg>,
  dm:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v12H7l-3 3z"/></svg>,
  bolt:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>,
  doc:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>,
  wand:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2M15 10V8M12.5 6.5h-2M19.5 6.5h-2M5 21l11-11M18 13l1 1"/></svg>,
  link:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>,
  team:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3.2 3.2 0 0 1 0 6M18 20a5.5 5.5 0 0 0-3-4.9"/></svg>,
  card:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20"/></svg>,
  cog:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  grid:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  building:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>,
  power:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v10M18.36 6.64a9 9 0 1 1-12.73 0"/></svg>,
  pix:    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.9 1.5 6.2 7.2a1.2 1.2 0 0 0 0 1.7l2.9 2.9-2.9 2.9a1.2 1.2 0 0 0 0 1.7l5.7 5.7a1.2 1.2 0 0 0 1.7 0l5.7-5.7a1.2 1.2 0 0 0 0-1.7l-2.9-2.9 2.9-2.9a1.2 1.2 0 0 0 0-1.7l-5.7-5.7a1.2 1.2 0 0 0-1.7 0zm.85 2.4 4.05 4.05-1.7 1.7a3.6 3.6 0 0 0-4.7 0l-1.7-1.7zm0 16.2-4.05-4.05 1.7-1.7a3.6 3.6 0 0 0 4.7 0l1.7 1.7z"/></svg>,
};

const Wa = ({s=12,c='#fff'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>;
const Ig = ({s=12,c='#fff'}) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>;

/* ---------------- Theme hook ---------------- */
function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ocp-theme') || 'light');
  useEffect(() => {
    document.body.className = 'theme-' + theme;
    localStorage.setItem('ocp-theme', theme);
  }, [theme]);
  return [theme, () => setTheme(t => t === 'light' ? 'dark' : 'light')];
}

/* ---------------- Avatar w/ channel badge ---------------- */
function Avatar({ name, color, channel, size=46, ring }) {
  const initials = name.replace(/[@]/g,'').split(/[ .]/).filter(Boolean).slice(0,2).map(s=>s[0]).join('').toUpperCase();
  return (
    <div style={{position:'relative',flex:'none'}}>
      <div style={{width:size,height:size,borderRadius:size*0.3,background:color,display:'grid',placeItems:'center',
        color:'#fff',fontWeight:800,fontSize:size*0.34,boxShadow: ring?'0 0 0 2.5px var(--brand-bright)':'none'}}>{initials}</div>
      {channel && (
        <span style={{position:'absolute',bottom:-3,right:-3,width:size*0.42,height:size*0.42,borderRadius:size*0.15,
          display:'grid',placeItems:'center',border:'2.5px solid var(--surface)',
          background: channel==='wa' ? 'var(--wa-green)' : undefined,
          backgroundImage: channel==='ig' ? 'var(--ig-grad)' : undefined}}>
          {channel==='wa' ? <Wa s={size*0.22}/> : <Ig s={size*0.22}/>}
        </span>
      )}
    </div>
  );
}

/* ---------------- Device frame ---------------- */
function StatusBar() {
  const [t,setT] = useState('09:41');
  useEffect(()=>{ const u=()=>{const d=new Date();setT(String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'));}; u(); const id=setInterval(u,15000); return ()=>clearInterval(id); },[]);
  return (
    <div className="statusbar">
      <span className="sb-time">{t}</span>
      <span className="sb-notch"></span>
      <span className="sb-right">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx="1"/><rect x="4.5" y="4" width="3" height="7" rx="1"/><rect x="9" y="2" width="3" height="9" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 2.2c1.9 0 3.6.7 4.9 1.9l1.2-1.2C12.4 1.2 10.3.4 8 .4S3.6 1.2 1.9 2.9l1.2 1.2C4.4 2.9 6.1 2.2 8 2.2zM8 5.8c1 0 1.9.4 2.5 1l1.2-1.2C10.8 4.7 9.5 4.2 8 4.2s-2.8.5-3.7 1.4l1.2 1.2c.6-.6 1.5-1 2.5-1zM8 8l1.5 1.5L8 11 6.5 9.5z"/></svg>
        <span className="sb-batt"><span className="sb-batt-fill"></span></span>
      </span>
    </div>
  );
}

function Device({ children }) {
  return (
    <div className="stage">
      <div className="device">
        <div className="screen">
          <StatusBar />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Bottom tab nav ---------------- */
function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="bottomnav">
      {tabs.map(t => (
        <button key={t.id} className={'tab'+(active===t.id?' on':'')} onClick={()=>onChange(t.id)}>
          <span className="tab-ic">{t.icon}</span>
          <span className="tab-lbl">{t.label}</span>
          {t.badge ? <span className="tab-badge">{t.badge}</span> : null}
        </button>
      ))}
    </nav>
  );
}

/* ---------------- Theme toggle button ---------------- */
function ThemeToggle({ theme, toggle }) {
  return <button className="hdr-icon" onClick={toggle} title="Tema">{theme==='light'?Ico.moon:Ico.sun}</button>;
}

/* ---------------- Toast ---------------- */
function useToast() {
  const [msg,setMsg] = useState(null);
  const show = (m)=>{ setMsg(m); setTimeout(()=>setMsg(null),2200); };
  const node = msg ? <div className="toast">{Ico.check}<span>{msg}</span></div> : null;
  return [node, show];
}

Object.assign(window, { React, useState, useEffect, useRef, Fragment, Ico, Wa, Ig, useTheme, Avatar, Device, StatusBar, BottomNav, ThemeToggle, useToast });
