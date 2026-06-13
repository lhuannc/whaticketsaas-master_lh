/* =====================================================================
   Omnichannel Plus — Management app (Telas 5–6)
   Tela 5: Hub de Gestão (Dono da Empresa / Tenant)
   Tela 6: Gestão SaaS Multi-tenant (Super Admin)
   Requires app-shared.jsx globals.
   ===================================================================== */

/* ---------------- Data ---------------- */
const MEMBERS = [
  { n:'Júlia Ramos', color:'#2a688f', role:'Operador', queue:'Comercial', online:true },
  { n:'Pedro Lima', color:'#0891b2', role:'Operador', queue:'Suporte', online:true },
  { n:'Ana Souza', color:'#7c3aed', role:'Admin', queue:'Todas', online:false },
  { n:'Diego Martins', color:'#ea580c', role:'Operador', queue:'Comercial', online:false },
];

const TENANTS = [
  { n:'Boutique da Mari', plan:'Pro', status:'ativo', due:'12 jun', value:'197', users:'8/10' },
  { n:'TechSul Telecom', plan:'Enterprise', status:'ativo', due:'28 jun', value:'497', users:'24/∞' },
  { n:'Studio Pilates Zen', plan:'Básico', status:'inadimplente', due:'02 jun', value:'79', users:'3/3' },
  { n:'Loja Verde Orgânicos', plan:'Pro', status:'ativo', due:'19 jun', value:'197', users:'5/10' },
  { n:'Ana Makeup Store', plan:'Básico', status:'trial', due:'14 jun', value:'0', users:'2/3' },
  { n:'Bruno Advocacia', plan:'Pro', status:'inadimplente', due:'30 mai', value:'197', users:'6/10' },
];

const STATUS_META = {
  ativo:        { label:'Ativo', color:'var(--ok)', bg:'rgba(22,163,74,.13)' },
  inadimplente: { label:'Inadimplente', color:'var(--bad)', bg:'rgba(220,38,38,.13)' },
  trial:        { label:'Trial', color:'var(--warn)', bg:'rgba(217,119,6,.14)' },
};

/* ---------------- Small bits ---------------- */
function Switch({ on, onClick }) {
  return <button className={'switch'+(on?' on':'')} onClick={onClick}><span className="knob"></span></button>;
}
function SectionTitle({ children, sub }) {
  return <div className="sec-title"><span>{children}</span>{sub && <span className="sec-sub">{sub}</span>}</div>;
}

/* ===================== TENANT · CANAIS ===================== */
function Canais({ theme, toggle, toast }) {
  const [wa,setWa] = useState(true);
  const [ig,setIg] = useState(true);
  return (
    <Fragment>
      <Header title="Canais" sub="Conexões da sua empresa" theme={theme} toggle={toggle} />
      <div className="body" style={{padding:14}}>
        <SectionTitle sub="Evolution API">WhatsApp</SectionTitle>

        <div className="card chan">
          <div className="chan-top">
            <div className="chan-ic" style={{background:'var(--wa-green)'}}><Wa s={22}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="chan-name">Comercial · Instância 01</div>
              <div className="chan-meta">+55 21 99888-7766</div>
            </div>
            <span className={'pill '+(wa?'ok':'off')}><span className="pill-dot"></span>{wa?'Conectado':'Offline'}</span>
          </div>
          <div className="chan-foot">
            <span className="chan-api">{Ico.link} Evolution API · v2.1</span>
            <button className="mini-btn" onClick={()=>toast(wa?'Reconectando instância…':'Lendo QR Code…')}>{wa?'Reiniciar':'Ler QR Code'}</button>
          </div>
        </div>

        <div className="card chan">
          <div className="chan-top">
            <div className="chan-ic" style={{background:'var(--wa-deep)'}}><Wa s={22}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="chan-name">Suporte · Instância 02</div>
              <div className="chan-meta">+55 21 99777-1122</div>
            </div>
            <Switch on={wa} onClick={()=>{setWa(w=>!w);toast(wa?'Instância pausada':'Instância ativada');}} />
          </div>
        </div>

        <button className="add-row">{Ico.plus} Conectar novo número (QR Code)</button>

        <SectionTitle sub="Graph API">Instagram</SectionTitle>
        <div className="card chan">
          <div className="chan-top">
            <div className="chan-ic" style={{backgroundImage:'var(--ig-grad)'}}><Ig s={22}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="chan-name">@omnichannelplus</div>
              <div className="chan-meta">Direct + Comentários</div>
            </div>
            <span className={'pill '+(ig?'ok':'off')}><span className="pill-dot"></span>{ig?'Conectado':'Offline'}</span>
          </div>
          <div className="chan-foot">
            <span className="chan-api">{Ico.link} Instagram Graph API</span>
            <button className="mini-btn" onClick={()=>{setIg(i=>!i);toast(ig?'Conta desvinculada':'Conta reconectada');}}>{ig?'Desconectar':'Reconectar'}</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

/* ===================== TENANT · EQUIPE ===================== */
function Equipe({ theme, toggle, toast }) {
  const [email,setEmail] = useState('');
  return (
    <Fragment>
      <Header title="Equipe" sub={MEMBERS.length+' membros · 2 online'} theme={theme} toggle={toggle} />
      <div className="body" style={{padding:14}}>
        <div className="card invite">
          <div className="invite-lbl">{Ico.team} Convidar para uma fila</div>
          <div className="invite-row">
            <div className="searchbar" style={{flex:1}}><input placeholder="email@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <button className="btn btn-primary" style={{minHeight:44,padding:'0 16px'}} onClick={()=>{toast(email?'Convite enviado a '+email:'Digite um e-mail');setEmail('');}}>Convidar</button>
          </div>
          <div className="invite-queues">
            {['Comercial','Suporte','Financeiro'].map((q,i)=><span key={q} className={'qchip'+(i===0?' on':'')}>{q}</span>)}
          </div>
        </div>

        <SectionTitle sub="Filas e permissões">Membros</SectionTitle>
        {MEMBERS.map(m => (
          <div key={m.n} className="card member">
            <div style={{position:'relative'}}>
              <Avatar name={m.n} color={m.color} size={44} />
              <span className="presence" style={{background:m.online?'var(--ok)':'var(--text-3)'}}></span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:800,fontSize:15}}>{m.n}</div>
              <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>
                <span className={'rolechip '+(m.role==='Admin'?'admin':'')}>{m.role}</span>
                <span className="queuechip">{m.queue}</span>
              </div>
            </div>
            <button className="hdr-icon" style={{width:38,height:38,border:'1px solid var(--border)'}}>{Ico.cog}</button>
          </div>
        ))}
      </div>
    </Fragment>
  );
}

/* ===================== TENANT · IA ===================== */
function IA({ theme, toggle }) {
  const [master,setMaster] = useState(true);
  const [opts,setOpts] = useState({ auto:true, suggest:true, offhours:true, handoff:false });
  const set = k => setOpts(o=>({...o,[k]:!o[k]}));
  const rows = [
    {k:'auto', t:'Atendimento automático', d:'IA responde o primeiro contato'},
    {k:'suggest', t:'Sugestões para operadores', d:'Copiloto sugere respostas no chat'},
    {k:'offhours', t:'Fora do horário comercial', d:'IA assume quando ninguém está online'},
    {k:'handoff', t:'Transferência automática', d:'Passa para humano em casos sensíveis'},
  ];
  return (
    <Fragment>
      <Header title="Inteligência Artificial" sub="Automação global" theme={theme} toggle={toggle} />
      <div className="body" style={{padding:14}}>
        <div className={'card ia-master'+(master?' on':'')}>
          <div className="ia-master-ic">{Ico.spark}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:17}}>Copiloto IA</div>
            <div style={{fontSize:13,color:master?'rgba(255,255,255,.85)':'var(--text-3)',fontWeight:600}}>{master?'Ativo em todas as filas':'Desligado'}</div>
          </div>
          <Switch on={master} onClick={()=>setMaster(m=>!m)} />
        </div>

        <SectionTitle>Comportamentos</SectionTitle>
        <div className="card" style={{opacity:master?1:.5,pointerEvents:master?'auto':'none',transition:'opacity .2s'}}>
          {rows.map((r,i)=>(
            <div key={r.k} className="ia-row" style={{borderTop:i?'1px solid var(--border)':'none'}}>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14.5}}>{r.t}</div><div style={{fontSize:12.5,color:'var(--text-3)',fontWeight:600,marginTop:2}}>{r.d}</div></div>
              <Switch on={opts[r.k]} onClick={()=>set(r.k)} />
            </div>
          ))}
        </div>

        <SectionTitle>Tom de voz</SectionTitle>
        <div className="tone-row">
          {['Formal','Cordial','Descontraído'].map((t,i)=><button key={t} className={'tone'+(i===1?' on':'')}>{t}</button>)}
        </div>
      </div>
    </Fragment>
  );
}

/* ===================== TENANT · FINANCEIRO ===================== */
function Financeiro({ theme, toggle }) {
  const [pix,setPix] = useState(false);
  const usage = [
    {l:'Usuários', v:7, max:10},
    {l:'Conexões', v:3, max:3},
    {l:'Mensagens / mês', v:18420, max:50000, fmt:true},
  ];
  return (
    <Fragment>
      <Header title="Financeiro" sub="Assinatura e uso" theme={theme} toggle={toggle} />
      <div className="body" style={{padding:14}}>
        <div className="card sub-card">
          <div className="tri" style={{position:'absolute',top:0,right:0}}></div>
          <div className="sub-top">
            <div>
              <div className="eyebrow" style={{color:'#fff',opacity:.85}}>Plano Atual</div>
              <div className="sub-plan">Pro <span>· Anual</span></div>
            </div>
            <div className="sub-price"><b>R$ 197</b><span>/mês</span></div>
          </div>
          <div className="sub-invoice">
            <span className="pill warn"><span className="pill-dot"></span>Fatura vence em 3 dias</span>
            <span style={{fontSize:13,fontWeight:700,opacity:.9}}>Próx.: 12 jun 2026</span>
          </div>
        </div>

        <SectionTitle>Uso do plano</SectionTitle>
        <div className="card" style={{padding:'16px 16px 6px'}}>
          {usage.map(u=>{
            const pct = Math.min(100, Math.round(u.v/u.max*100));
            const danger = pct>=100, warn = pct>=80;
            return (
              <div key={u.l} style={{marginBottom:16}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                  <span style={{fontSize:13.5,fontWeight:700}}>{u.l}</span>
                  <span style={{fontSize:13,fontWeight:800,color:danger?'var(--bad)':warn?'var(--warn)':'var(--text-2)'}}>{u.fmt?u.v.toLocaleString('pt-BR'):u.v} / {u.max===Infinity?'∞':(u.fmt?u.max.toLocaleString('pt-BR'):u.max)}</span>
                </div>
                <div className="bar"><span className="bar-fill" style={{width:pct+'%',background:danger?'var(--bad)':warn?'var(--warn)':'var(--brand-grad)'}}></span></div>
              </div>
            );
          })}
        </div>

        <button className="btn pix-btn" onClick={()=>setPix(true)}>{Ico.pix} Pagar com PIX</button>
        <button className="btn btn-ghost" style={{width:'100%',marginTop:10}}>Ver faturas anteriores</button>
        <a href="Operator.html" className="btn btn-soft" style={{width:'100%',marginTop:10}}>{Ico.chat} Abrir App do Operador</a>
      </div>
      {pix && <PixSheet onClose={()=>setPix(false)} />}
    </Fragment>
  );
}

function PixSheet({ onClose }) {
  const [copied,setCopied] = useState(false);
  return (
    <Fragment>
      <div className="sheet-scrim" onClick={onClose}></div>
      <div className="sheet" style={{textAlign:'center'}}>
        <div className="sheet-grip"></div>
        <div className="sheet-title" style={{justifyContent:'center'}}>{Ico.pix}<span>Pagamento via PIX</span></div>
        <div style={{fontSize:13,color:'var(--text-2)',fontWeight:600,marginBottom:14}}>R$ 197,00 · Plano Pro Anual</div>
        <div className="qr">
          <div className="qr-grid">{Array.from({length:144}).map((_,i)=><span key={i} style={{background: (Math.sin(i*12.9)*43758%1>0.45)?'var(--text)':'transparent'}}></span>)}</div>
        </div>
        <button className={'btn '+(copied?'btn-soft':'btn-primary')} style={{width:'100%',marginTop:16}} onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
          {copied?<Fragment>{Ico.check} Código copiado!</Fragment>:'Copiar código PIX'}
        </button>
        <div style={{fontSize:12,color:'var(--text-3)',fontWeight:600,marginTop:12}}>Aprovação em até 30 segundos</div>
      </div>
    </Fragment>
  );
}

/* ===================== SUPER ADMIN · EMPRESAS ===================== */
function Empresas({ theme, toggle, toast }) {
  const [menu,setMenu] = useState(null);
  const metrics = [
    {l:'MRR', v:'R$ 38,4k', t:'+12%'},
    {l:'Empresas ativas', v:'142', t:'+8'},
    {l:'Inadimplentes', v:'2', t:'', bad:true},
  ];
  return (
    <Fragment>
      <Header title="Empresas" sub="Gestão SaaS · Super Admin" theme={theme} toggle={toggle} badge="SA" />
      <div className="body" style={{padding:14}}>
        <div className="metric-grid">
          {metrics.map(m=>(
            <div key={m.l} className="card metric">
              <div className="metric-l">{m.l}</div>
              <div className="metric-v" style={m.bad?{color:'var(--bad)'}:null}>{m.v}</div>
              {m.t && <div className="metric-t">{m.t}</div>}
            </div>
          ))}
        </div>

        <div className="searchbar" style={{margin:'4px 0 12px'}}>{Ico.search}<input placeholder="Buscar empresa (tenant)…" /></div>

        {TENANTS.map((t,idx)=>{
          const s = STATUS_META[t.status];
          return (
            <div key={t.n} className="card tenant">
              <div className="tenant-top">
                <div className="tenant-ic">{Ico.building}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="tenant-name">{t.n}</div>
                  <div className="tenant-meta">Plano <b>{t.plan}</b> · {t.users} usuários</div>
                </div>
                <button className="hdr-icon" style={{width:38,height:38,border:'1px solid var(--border)'}} onClick={()=>setMenu(menu===idx?null:idx)}>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
                </button>
              </div>
              <div className="tenant-foot">
                <span className="pill" style={{color:s.color,background:s.bg}}><span className="pill-dot" style={{background:s.color}}></span>{s.label}</span>
                <span className="tenant-due">Vence <b>{t.due}</b> · R$ {t.value}/mês</span>
              </div>
              {menu===idx && (
                <div className="tenant-menu">
                  <button onClick={()=>{toast('Logado como '+t.n);setMenu(null);}}>{Ico.user} Logar como</button>
                  <button onClick={()=>{toast('Limites abertos para edição');setMenu(null);}}>{Ico.cog} Editar limites</button>
                  <button className="danger" onClick={()=>{toast(t.n+' suspensa');setMenu(null);}}>{Ico.power} Suspender empresa</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Fragment>
  );
}

/* ===================== SUPER ADMIN · MÉTRICAS ===================== */
function Metricas({ theme, toggle }) {
  const bars = [62,48,70,55,80,73,95,88,76,90,84,100];
  const planSplit = [['Básico',38,'#42b9eb'],['Pro',82,'#2a688f'],['Enterprise',22,'#7c3aed']];
  return (
    <Fragment>
      <Header title="Métricas" sub="Visão do software" theme={theme} toggle={toggle} badge="SA" />
      <div className="body" style={{padding:14}}>
        <div className="metric-grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div className="card metric"><div className="metric-l">Receita anual</div><div className="metric-v" style={{fontSize:24}}>R$ 461k</div><div className="metric-t">ARR · +18%</div></div>
          <div className="card metric"><div className="metric-l">Churn mensal</div><div className="metric-v" style={{fontSize:24}}>1,8%</div><div className="metric-t">−0,4pp</div></div>
        </div>

        <SectionTitle sub="Últimos 12 meses">Receita recorrente</SectionTitle>
        <div className="card" style={{padding:16}}>
          <div className="chart">{bars.map((b,i)=><span key={i} className="chart-bar" style={{height:Math.round(b/100*108)+'px',animationDelay:(i*0.04)+'s'}}></span>)}</div>
          <div style={{display:'flex',justifyContent:'space-between',marginTop:10,fontSize:11,color:'var(--text-3)',fontWeight:700}}><span>jul</span><span>jan</span><span>jun</span></div>
        </div>

        <SectionTitle>Distribuição de planos</SectionTitle>
        <div className="card" style={{padding:'16px 16px 8px'}}>
          {planSplit.map(([n,v,c])=>(
            <div key={n} style={{marginBottom:13}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}><span style={{fontSize:13.5,fontWeight:700}}>{n}</span><span style={{fontSize:13,fontWeight:800,color:'var(--text-2)'}}>{v} empresas</span></div>
              <div className="bar"><span className="bar-fill" style={{width:(v/82*100)+'%',background:c}}></span></div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}

/* ===================== HEADER w/ role switch ===================== */
function Header({ title, sub, theme, toggle, badge }) {
  return (
    <div className="app-hdr">
      <div style={{minWidth:0}}>
        <div className="hdr-title">{title}</div>
        <div className="hdr-sub">{sub}</div>
      </div>
      <div className="hdr-spacer"></div>
      {badge && <span className="sa-badge">{badge}</span>}
      <ThemeToggle theme={theme} toggle={toggle} />
    </div>
  );
}

/* ===================== APP SHELL ===================== */
function ManagementApp() {
  const [theme,toggle] = useTheme();
  const [role,setRole] = useState('empresa'); // empresa | super
  const [tab,setTab] = useState('canais');
  const [toastNode,showToast] = useToast();

  useEffect(()=>{ setTab(role==='empresa'?'canais':'empresas'); },[role]);

  const tenantTabs = [
    {id:'canais',label:'Canais',icon:Ico.link},
    {id:'equipe',label:'Equipe',icon:Ico.team},
    {id:'ia',label:'IA',icon:Ico.spark},
    {id:'financeiro',label:'Financeiro',icon:Ico.card},
  ];
  const superTabs = [
    {id:'empresas',label:'Empresas',icon:Ico.building},
    {id:'metricas',label:'Métricas',icon:Ico.grid},
  ];

  let screen;
  if(role==='empresa'){
    if(tab==='canais') screen=<Canais theme={theme} toggle={toggle} toast={showToast} />;
    else if(tab==='equipe') screen=<Equipe theme={theme} toggle={toggle} toast={showToast} />;
    else if(tab==='ia') screen=<IA theme={theme} toggle={toggle} />;
    else screen=<Financeiro theme={theme} toggle={toggle} />;
  } else {
    if(tab==='empresas') screen=<Empresas theme={theme} toggle={toggle} toast={showToast} />;
    else screen=<Metricas theme={theme} toggle={toggle} />;
  }

  return (
    <Fragment>
      <div className="floater">
        <a href="Landing.html">Landing</a>
        <a href="Operator.html">Operador</a>
        <a className="on" href="Management.html">Gestão</a>
        <span className="sep"></span>
        <a href="Management Desktop.html">Desktop ↗</a>
      </div>
      <Device>
        <div className="role-switch">
          <button className={role==='empresa'?'on':''} onClick={()=>setRole('empresa')}>{Ico.building} Minha Empresa</button>
          <button className={role==='super'?'on':''} onClick={()=>setRole('super')}>{Ico.grid} Super Admin</button>
        </div>
        {screen}
        {toastNode}
        <BottomNav tabs={role==='empresa'?tenantTabs:superTabs} active={tab} onChange={setTab} />
      </Device>
    </Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ManagementApp />);
