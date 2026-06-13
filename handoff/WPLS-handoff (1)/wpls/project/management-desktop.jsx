/* =====================================================================
   Omnichannel Plus — Management Desktop
   Left sidebar (role switch + nav) + wide content panels.
   Tenant: Canais · Equipe · IA · Financeiro
   Super Admin: Empresas · Métricas
   Requires app-shared.jsx + app-data.jsx globals.
   ===================================================================== */

function Switch({ on, onClick }) {
  return <button className={'switch'+(on?' on':'')} onClick={onClick}><span className="knob"></span></button>;
}

function TopBar({ theme, toggle, role }) {
  return (
    <div className="dk-topbar">
      <div className="dk-brand">
        <span className="dk-logo"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><circle cx="9" cy="11.5" r="1" fill="#fff" stroke="none"/><circle cx="12" cy="11.5" r="1" fill="#fff" stroke="none"/><circle cx="15" cy="11.5" r="1" fill="#fff" stroke="none"/></svg></span>
        Omnichannel<span style={{color:'var(--accent)'}}>Plus</span>
        <span style={{marginLeft:10,fontSize:12,fontWeight:800,color:'var(--text-3)',border:'1px solid var(--border)',padding:'3px 9px',borderRadius:8}}>{role==='super'?'SUPER ADMIN':'GESTÃO'}</span>
      </div>
      <div className="dk-search">{Ico.search}<input placeholder={role==='super'?'Buscar empresa (tenant)…':'Buscar nas configurações…'} /><kbd>⌘K</kbd></div>
      <div className="dk-spacer"></div>
      <div className="dk-top-actions">
        <div className="dk-viewswitch">
          <a href="Management.html">{Ico.user} Mobile</a>
          <a className="on" href="Management Desktop.html">{Ico.grid} Desktop</a>
        </div>
        <button className="dk-iconbtn" onClick={toggle} title="Tema">{theme==='light'?Ico.moon:Ico.sun}</button>
        <div className="dk-me">
          <Avatar name="Ana Souza" color="#7c3aed" size={32} />
          <div><div className="dk-me-name">Ana Souza</div><div className="dk-me-role">{role==='super'?'Super Admin':'Admin'}</div></div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ role, setRole, tab, setTab }) {
  const tenantNav = [
    {id:'canais', label:'Canais', icon:Ico.link},
    {id:'fluxos', label:'Fluxos & URA', icon:FIco.flow},
    {id:'funis', label:'Funis', icon:Ico.funnel},
    {id:'ia', label:'Inteligência Artificial', icon:Ico.spark},
    {id:'equipe', label:'Equipe', icon:Ico.team},
    {id:'distribuicao', label:'Distribuição', icon:FIco.dist},
    {id:'configuracoes', label:'Configurações', icon:Ico.cog},
    {id:'financeiro', label:'Financeiro', icon:Ico.card},
  ];
  const superNav = [
    {id:'empresas', label:'Empresas', icon:Ico.building},
    {id:'metricas', label:'Métricas', icon:Ico.grid},
  ];
  const nav = role==='empresa' ? tenantNav : superNav;
  return (
    <div className="dk-mside">
      <div className="dk-roleswitch">
        <button className={role==='empresa'?'on':''} onClick={()=>setRole('empresa')}>{Ico.building} Minha Empresa</button>
        <button className={role==='super'?'on':''} onClick={()=>setRole('super')}>{Ico.grid} Super Admin</button>
      </div>
      {nav.map(n => (
        <button key={n.id} className={'dk-mnav'+(tab===n.id?' on':'')} onClick={()=>setTab(n.id)}>
          {n.icon}<span className="mlabel">{n.label}</span>
        </button>
      ))}
      <div className="dk-mnav-sp"></div>
      <a className="dk-mnav" href="Operator Desktop.html" style={{textDecoration:'none'}}>{Ico.chat}<span className="mlabel">App do Operador</span></a>
      <a className="dk-mnav" href="Landing.html" style={{textDecoration:'none'}}>{Ico.back}<span className="mlabel">Landing</span></a>
    </div>
  );
}

/* ===================== CANAIS ===================== */
const FbLogo = ({s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M24 12a12 12 0 1 0-13.875 11.854v-8.385H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385A12.002 12.002 0 0 0 24 12z"/></svg>;
const LiLogo = ({s=22}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="#fff"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>;

function ChanCard({ icBg, icBgImg, logo, name, meta, via, action, connected, onAction, toggle, onToggle, badge }) {
  return (
    <div className="dk-card dk-chan">
      <div className="dk-chan-top">
        <div className="dk-chan-ic" style={{background:icBg, backgroundImage:icBgImg}}>{logo}</div>
        <div style={{flex:1,minWidth:0}}>
          <div className="dk-chan-name" style={{display:'flex',alignItems:'center',gap:8}}>{name}{badge && <span style={{fontSize:10,fontWeight:800,color:'var(--accent-bright)',background:'var(--brand-grad-soft)',border:'1px solid rgba(66,185,235,.3)',padding:'2px 7px',borderRadius:6,letterSpacing:'.02em'}}>{badge}</span>}</div>
          <div className="dk-chan-meta">{meta}</div>
        </div>
        {toggle ? <Switch on={connected} onClick={onToggle} /> : <span className={'dk-pill '+(connected?'ok':'off')}><span className="pd"></span>{connected?'Conectado':'Offline'}</span>}
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
        <span style={{fontSize:12,fontWeight:700,color:'var(--text-3)',display:'inline-flex',gap:6,alignItems:'center'}}>{Ico.link} {via}</span>
        <button className="mini-btn" onClick={onAction}>{action}</button>
      </div>
    </div>
  );
}

function Canais({ toast }) {
  const [wa, setWa] = useState(true);
  const [ig, setIg] = useState(true);
  const [fb, setFb] = useState(true);
  const [li, setLi] = useState(false);
  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div className="dk-pane-title">Canais</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Conexões da sua empresa. A Evolution API faz toda a integração — você só conecta.</div>

      <div className="dk-card" style={{padding:18,display:'flex',alignItems:'center',gap:14,marginBottom:6,background:'var(--brand-grad-soft)',borderColor:'rgba(66,185,235,.3)'}}>
        <div style={{width:46,height:46,flex:'none',borderRadius:13,background:'var(--brand-grad)',color:'#fff',display:'grid',placeItems:'center'}}>{Ico.link}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:15.5}}>Evolution API</div>
          <div style={{fontSize:13,color:'var(--text-2)',fontWeight:600,marginTop:2}}>Centraliza a integração de <b>WhatsApp não oficial</b>, <b>Instagram oficial</b> e <b>Facebook</b> em um só lugar.</div>
        </div>
        <span className="dk-pill ok"><span className="pd"></span>Operante · v2.1</span>
      </div>

      <div className="dk-sec-h">WhatsApp <span className="s">não oficial · Evolution API</span></div>
      <div className="dk-grid-2">
        <ChanCard icBg="var(--wa-green)" logo={<Wa s={22}/>} name="Comercial · Instância 01" meta="+55 21 99888-7766"
          via="QR Code · 99.9% uptime" connected={wa} action="Reiniciar" onAction={()=>toast('Reiniciando instância…')} />
        <ChanCard icBg="var(--wa-deep)" logo={<Wa s={22}/>} name="Suporte · Instância 02" meta="+55 21 99777-1122"
          via="Fila de suporte" toggle connected={wa} onToggle={()=>{setWa(w=>!w);toast(wa?'Instância pausada':'Instância ativada');}} action="Ler QR Code" onAction={()=>toast('Lendo QR Code…')} />
      </div>
      <button className="add-row" style={{marginTop:14}} onClick={()=>toast('Escaneie o QR Code no celular')}>{Ico.plus} Conectar novo número (QR Code)</button>

      <div className="dk-sec-h">Instagram &amp; Facebook <span className="s">oficial · via Evolution API</span></div>
      <div className="dk-grid-2">
        <ChanCard icBgImg="var(--ig-grad)" logo={<Ig s={22}/>} name="@omnichannelplus" meta="Direct + Comentários"
          via="Instagram oficial" connected={ig} action={ig?'Desconectar':'Reconectar'} onAction={()=>{setIg(i=>!i);toast(ig?'Conta desvinculada':'Conta reconectada');}} />
        <ChanCard icBg="#1877F2" logo={<FbLogo s={22}/>} name="WPLS Brasil" meta="Página · Messenger + Comentários"
          via="Facebook oficial" connected={fb} action={fb?'Desconectar':'Reconectar'} onAction={()=>{setFb(f=>!f);toast(fb?'Página desvinculada':'Página reconectada');}} />
      </div>

      <div className="dk-sec-h">LinkedIn <span className="s">somente comentários</span></div>
      <ChanCard icBg="#0A66C2" logo={<LiLogo s={22}/>} name="WPLS · Company Page" meta="Monitora e responde comentários das publicações"
        badge="Somente comentários" via="LinkedIn API" connected={li} action={li?'Desconectar':'Conectar'} onAction={()=>{setLi(l=>!l);toast(li?'LinkedIn desconectado':'LinkedIn conectado · comentários');}} />

      <div className="dk-sec-h">WhatsApp API Oficial <span className="s">autoconfigurável · Cloud API da Meta</span></div>
      <OfficialApiCard toast={toast} />
    </div></div>
  );
}

/* ===================== EQUIPE ===================== */
function Equipe({ toast }) {
  const [email, setEmail] = useState('');
  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div className="dk-pane-title">Equipe</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>{MEMBERS.length} membros · 2 online · filas e permissões</div>

      <div className="dk-card" style={{padding:18,marginBottom:18}}>
        <div className="dk-ilabel" style={{display:'flex',alignItems:'center',gap:8,fontWeight:800,fontSize:14.5,marginBottom:12,whiteSpace:'nowrap'}}>{Ico.team} Convidar para uma fila</div>
        <div style={{display:'flex',gap:10}}>
          <div className="dk-search" style={{maxWidth:'none',flex:1,height:44}}><input placeholder="email@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <select className="mini-btn" style={{minHeight:44,padding:'0 14px'}} defaultValue="Comercial">
            <option>Comercial</option><option>Suporte</option><option>Financeiro</option>
          </select>
          <button className="btn btn-primary" style={{minHeight:44}} onClick={()=>{toast(email?'Convite enviado a '+email:'Digite um e-mail');setEmail('');}}>Convidar</button>
        </div>
      </div>

      <div className="dk-card">
        <div className="dk-th" style={{gridTemplateColumns:'2fr 1fr 1fr 1fr auto'}}><span>Membro</span><span>Função</span><span>Fila</span><span>CSAT</span><span></span></div>
        {MEMBERS.map((m,i)=>(
          <div key={m.n} className="dk-tenant-row" style={{gridTemplateColumns:'2fr 1fr 1fr 1fr auto'}}>
            <div className="dk-tenant-id">
              <div style={{position:'relative'}}><Avatar name={m.n} color={m.color} size={40} /><span className="presence" style={{background:m.online?'var(--ok)':'var(--text-3)'}}></span></div>
              <div style={{minWidth:0}}><div style={{fontWeight:800,fontSize:14,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{m.n}</div><div style={{fontSize:12,color:'var(--text-3)',fontWeight:600,whiteSpace:'nowrap'}}>{m.online?'Online':'Ausente'} · {m.atend} hoje</div></div>
            </div>
            <span><span className={'rolechip '+(m.role==='Admin'?'admin':'')}>{m.role}</span></span>
            <span><span className="queuechip">{m.queue}</span></span>
            <span style={{fontWeight:800,fontSize:14}}>{m.csat}</span>
            <button className="dk-iconbtn" style={{width:36,height:36}} onClick={()=>toast('Permissões de '+m.n)}>{Ico.cog}</button>
          </div>
        ))}
      </div>
    </div></div>
  );
}

/* ===================== IA ===================== */
function IA() {
  const [master, setMaster] = useState(true);
  const [opts, setOpts] = useState({ auto:true, suggest:true, offhours:true, handoff:false });
  const [tone, setTone] = useState(1);
  const set = k => setOpts(o=>({...o,[k]:!o[k]}));
  const rows = [
    {k:'auto', t:'Atendimento automático', d:'IA responde o primeiro contato de cada lead'},
    {k:'suggest', t:'Sugestões para operadores', d:'Copiloto sugere respostas dentro do chat'},
    {k:'offhours', t:'Fora do horário comercial', d:'IA assume quando nenhum operador está online'},
    {k:'handoff', t:'Transferência automática', d:'Passa para humano em casos sensíveis'},
  ];
  return (
    <div className="dk-scroll-center"><div className="dk-wrap narrow">
      <div className="dk-pane-title">Inteligência Artificial</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Automação global do Copiloto para toda a empresa</div>

      <div className={'dk-card ia-master'+(master?' on':'')} style={{marginBottom:6}}>
        <div className="ia-master-ic">{Ico.spark}</div>
        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:18}}>Copiloto IA</div><div style={{fontSize:13.5,color:master?'rgba(255,255,255,.85)':'var(--text-3)',fontWeight:600}}>{master?'Ativo em todas as filas':'Desligado'}</div></div>
        <Switch on={master} onClick={()=>setMaster(m=>!m)} />
      </div>

      <div className="dk-sec-h">Comportamentos</div>
      <div className="dk-card" style={{opacity:master?1:.5,pointerEvents:master?'auto':'none',transition:'opacity .2s'}}>
        {rows.map((r,i)=>(
          <div key={r.k} className="dk-row" style={{borderTop:i?'1px solid var(--border)':'none'}}>
            <div className="grow"><div className="t">{r.t}</div><div className="d">{r.d}</div></div>
            <Switch on={opts[r.k]} onClick={()=>set(r.k)} />
          </div>
        ))}
      </div>

      <div className="dk-sec-h">Tom de voz</div>
      <div className="dk-grid-3">
        {['Formal','Cordial','Descontraído'].map((t,i)=><button key={t} className={'tone'+(tone===i?' on':'')} onClick={()=>setTone(i)}>{t}</button>)}
      </div>
    </div></div>
  );
}

/* ===================== FINANCEIRO ===================== */
function Financeiro({ toast }) {
  const [pix, setPix] = useState(false);
  const usage = [{l:'Usuários',v:7,max:10},{l:'Conexões',v:3,max:3},{l:'Mensagens / mês',v:18420,max:50000,fmt:true}];
  return (
    <div className="dk-scroll-center"><div className="dk-wrap">
      <div className="dk-pane-title">Financeiro</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Assinatura, uso do plano e pagamento</div>

      <div className="dk-grid-2" style={{alignItems:'start'}}>
        <div className="dk-card sub-card" style={{borderRadius:16}}>
          <div className="tri" style={{position:'absolute',top:0,right:0}}></div>
          <div className="sub-top">
            <div><div className="eyebrow" style={{color:'#fff',opacity:.85}}>Plano Atual</div><div className="sub-plan">Pro <span>· Anual</span></div></div>
            <div className="sub-price"><b>R$ 197</b><span>/mês</span></div>
          </div>
          <div className="sub-invoice"><span className="dk-pill warn" style={{background:'rgba(255,255,255,.18)',color:'#ffe0b2'}}><span className="pd"></span>Vence em 3 dias</span><span style={{fontSize:13,fontWeight:700,opacity:.9}}>Próx.: 12 jun 2026</span></div>
        </div>
        <div className="dk-card" style={{padding:20}}>
          <div className="dk-stat-l" style={{marginBottom:14}}>Ações</div>
          <button className="btn pix-btn" style={{width:'100%'}} onClick={()=>setPix(true)}>{Ico.pix} Pagar com PIX</button>
          <button className="btn btn-ghost" style={{width:'100%',marginTop:10}} onClick={()=>toast('Abrindo histórico de faturas')}>Ver faturas anteriores</button>
          <button className="btn btn-soft" style={{width:'100%',marginTop:10}} onClick={()=>toast('Comparando planos…')}>Fazer upgrade</button>
        </div>
      </div>

      <div className="dk-sec-h">Uso do plano</div>
      <div className="dk-card" style={{padding:'20px 22px 8px'}}>
        {usage.map(u=>{
          const pct=Math.min(100,Math.round(u.v/u.max*100)), danger=pct>=100, warn=pct>=80;
          return (
            <div key={u.l} style={{marginBottom:18}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                <span style={{fontSize:14,fontWeight:700}}>{u.l}</span>
                <span style={{fontSize:13.5,fontWeight:800,color:danger?'var(--bad)':warn?'var(--warn)':'var(--text-2)'}}>{u.fmt?u.v.toLocaleString('pt-BR'):u.v} / {u.fmt?u.max.toLocaleString('pt-BR'):u.max}</span>
              </div>
              <div className="dk-bar"><span className="dk-bar-fill" style={{width:pct+'%',background:danger?'var(--bad)':warn?'var(--warn)':'var(--brand-grad)'}}></span></div>
            </div>
          );
        })}
      </div>
      {pix && <PixModal onClose={()=>setPix(false)} />}
    </div></div>
  );
}

function PixModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="dk-modal-scrim" onClick={onClose}>
      <div className="dk-modal" onClick={e=>e.stopPropagation()}>
        <button className="dk-modal-x" onClick={onClose}>{Ico.x}</button>
        <div className="sheet-title" style={{justifyContent:'center'}}>{Ico.pix}<span>Pagamento via PIX</span></div>
        <div style={{textAlign:'center',fontSize:13.5,color:'var(--text-2)',fontWeight:600,marginBottom:16}}>R$ 197,00 · Plano Pro Anual</div>
        <div className="qr" style={{margin:'0 auto'}}><div className="qr-grid">{Array.from({length:144}).map((_,i)=><span key={i} style={{background:(Math.sin(i*12.9)*43758%1>0.45)?'var(--text)':'transparent'}}></span>)}</div></div>
        <button className={'btn '+(copied?'btn-soft':'btn-primary')} style={{width:'100%',marginTop:18}} onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?<span style={{display:'contents'}}>{Ico.check} Código copiado!</span>:'Copiar código PIX'}</button>
        <div style={{textAlign:'center',fontSize:12,color:'var(--text-3)',fontWeight:600,marginTop:12}}>Aprovação em até 30 segundos</div>
      </div>
    </div>
  );
}

/* ===================== SUPER ADMIN · EMPRESAS ===================== */
function Empresas({ toast }) {
  const [menu, setMenu] = useState(null);
  const metrics = [{l:'MRR',v:'R$ 38,4k',t:'+12%'},{l:'Empresas ativas',v:'142',t:'+8 no mês'},{l:'Trials ativos',v:'9',t:'+3'},{l:'Inadimplentes',v:'2',bad:true}];
  return (
    <div className="dk-scroll-center"><div className="dk-wrap" style={{maxWidth:1100}}>
      <div className="dk-pane-title">Empresas</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Gestão SaaS multi-tenant · {TENANTS.length} clientes</div>

      <div className="dk-grid-4" style={{marginBottom:20}}>
        {metrics.map(m=>(
          <div key={m.l} className="dk-card dk-stat"><div className="dk-stat-l">{m.l}</div><div className="dk-stat-v" style={m.bad?{color:'var(--bad)'}:null}>{m.v}</div>{m.t&&<div className="dk-stat-t">{m.t}</div>}</div>
        ))}
      </div>

      <div className="dk-card">
        <div className="dk-th"><span>Empresa</span><span>Plano</span><span>Status</span><span>Vencimento</span><span></span></div>
        {TENANTS.map((t,idx)=>{
          const s = STATUS_META[t.status];
          return (
            <div key={t.n} className="dk-tenant-row" style={{position:'relative'}}>
              <div className="dk-tenant-id">
                <div className="dk-tenant-ic">{Ico.building}</div>
                <div style={{minWidth:0}}><div style={{fontWeight:800,fontSize:14.5,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t.n}</div><div style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>{t.users} usuários</div></div>
              </div>
              <span style={{fontWeight:700,fontSize:13.5}}>{t.plan}</span>
              <span><span className="dk-pill" style={{color:s.color,background:s.bg}}><span className="pd" style={{background:s.color}}></span>{s.label}</span></span>
              <span style={{fontSize:13.5,fontWeight:600,color:'var(--text-2)'}}>{t.due} · <b style={{color:'var(--text)'}}>R$ {t.value}</b></span>
              <button className="dk-iconbtn" style={{width:36,height:36}} onClick={()=>setMenu(menu===idx?null:idx)}><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button>
              {menu===idx && (
                <div className="dk-menu">
                  <button onClick={()=>{toast('Logado como '+t.n);setMenu(null);}}>{Ico.user} Logar como</button>
                  <button onClick={()=>{toast('Limites abertos para edição');setMenu(null);}}>{Ico.cog} Editar limites</button>
                  <button className="danger" onClick={()=>{toast(t.n+' suspensa');setMenu(null);}}>{Ico.power} Suspender</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div></div>
  );
}

/* ===================== SUPER ADMIN · MÉTRICAS ===================== */
function Metricas() {
  const bars = [62,48,70,55,80,73,95,88,76,90,84,100];
  const months = ['jul','ago','set','out','nov','dez','jan','fev','mar','abr','mai','jun'];
  const planSplit = [['Básico',38,'#42b9eb'],['Pro',82,'#2a688f'],['Enterprise',22,'#7c3aed']];
  return (
    <div className="dk-scroll-center"><div className="dk-wrap" style={{maxWidth:1000}}>
      <div className="dk-pane-title">Métricas</div>
      <div className="dk-pane-sub" style={{marginBottom:18}}>Visão geral do software (SaaS)</div>

      <div className="dk-grid-4" style={{marginBottom:20}}>
        {[['Receita anual','R$ 461k','ARR · +18%'],['MRR','R$ 38,4k','+12%'],['Churn mensal','1,8%','−0,4pp'],['Ticket médio','R$ 270','+6%']].map(([l,v,t])=>(
          <div key={l} className="dk-card dk-stat"><div className="dk-stat-l">{l}</div><div className="dk-stat-v" style={{fontSize:25}}>{v}</div><div className="dk-stat-t">{t}</div></div>
        ))}
      </div>

      <div className="dk-grid-2" style={{alignItems:'start'}}>
        <div className="dk-card" style={{padding:22}}>
          <div className="dk-stat-l" style={{marginBottom:18}}>Receita recorrente · 12 meses</div>
          <div className="dk-chart">{bars.map((b,i)=><span key={i} className="dk-chart-bar" style={{height:Math.round(b/100*176)+'px'}}></span>)}</div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>{months.map(m=><span key={m} style={{fontSize:10,color:'var(--text-3)',fontWeight:700,flex:1,textAlign:'center'}}>{m}</span>)}</div>
        </div>
        <div className="dk-card" style={{padding:22}}>
          <div className="dk-stat-l" style={{marginBottom:18}}>Distribuição de planos</div>
          {planSplit.map(([n,v,c])=>(
            <div key={n} style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}><span style={{fontSize:14,fontWeight:700}}>{n}</span><span style={{fontSize:13.5,fontWeight:800,color:'var(--text-2)'}}>{v} empresas</span></div>
              <div className="dk-bar"><span className="dk-bar-fill" style={{width:(v/82*100)+'%',background:c}}></span></div>
            </div>
          ))}
          <div style={{marginTop:20,paddingTop:18,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:14,fontWeight:700,color:'var(--text-2)'}}>Total de empresas</span><span style={{fontSize:18,fontWeight:800}}>142</span></div>
        </div>
      </div>
    </div></div>
  );
}

/* ===================== APP ===================== */
function ManagementDesktop() {
  const [theme, toggle] = useTheme();
  const [role, setRole] = useState('empresa');
  const [tab, setTab] = useState('canais');
  const [toastNode, showToast] = useToast();
  const toast = (m)=>showToast(m);

  useEffect(()=>{ setTab(role==='empresa'?'canais':'empresas'); }, [role]);

  let content;
  if(role==='empresa'){
    if(tab==='canais') content=<Canais toast={toast} />;
    else if(tab==='fluxos') content=<FluxosScreen toast={toast} />;
    else if(tab==='funis') content=<FunisScreen toast={toast} />;
    else if(tab==='ia') content=<IAConfig toast={toast} />;
    else if(tab==='equipe') content=<Equipe toast={toast} />;
    else if(tab==='distribuicao') content=<DistribuicaoScreen toast={toast} />;
    else if(tab==='configuracoes') content=<ConfiguracoesScreen toast={toast} />;
    else content=<Financeiro toast={toast} />;
  } else {
    if(tab==='empresas') content=<Empresas toast={toast} />;
    else content=<Metricas />;
  }

  return (
    <div style={{display:'contents'}}>
      <div className="dk-app">
        <TopBar theme={theme} toggle={toggle} role={role} />
        <div className="dk-body">
          <Sidebar role={role} setRole={setRole} tab={tab} setTab={setTab} />
          <div className="dk-content">{content}</div>
        </div>
      </div>
      <div className="dk-too-small">
        <div className="ic">{Ico.grid}</div>
        <h2>Versão desktop</h2>
        <p>Esta é a interface de gestão para desktop. Amplie a janela ou abra a versão <b>Mobile</b> em telas menores.</p>
        <a className="btn btn-primary" href="Management.html">Abrir versão mobile</a>
      </div>
      {toastNode && React.cloneElement(toastNode, {className:'dk-toast'})}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ManagementDesktop />);
