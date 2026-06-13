/* =====================================================================
   Omnichannel Plus — Operator app screens (Telas 1–4 + Perfil)
   Requires app-shared.jsx globals.
   ===================================================================== */

/* ---------------- Data ---------------- */
const CONVERSATIONS = [
  { id:1, name:'Mariana Costa', color:'#7c3aed', channel:'wa', status:'open', funnel:'novo', tags:['Lead Quente','Plano Pro'], last:'Oi! Vi o anúncio do plano Pro e queria entender melhor…', time:'09:42', unread:2, ai:true, online:true },
  { id:2, name:'@joao.designer', color:'#db2777', channel:'ig', status:'open', funnel:'novo', tags:['Instagram'], last:'Vocês integram com o Instagram da minha loja?', time:'09:38', unread:1, ai:false, online:true },
  { id:3, name:'Carlos — Loja Sul', color:'#2563eb', channel:'wa', status:'resolved', funnel:'ganho', tags:['Cliente'], last:'Fechado, pode emitir a nota 👍', time:'09:21', unread:0, ai:false, online:false },
  { id:4, name:'Beatriz Almeida', color:'#0891b2', channel:'wa', status:'pending', funnel:'qual', tags:['Suporte'], last:'A conexão caiu de novo, conseguem ver?', time:'08:55', unread:0, ai:true, online:false },
  { id:5, name:'@ana.makeup', color:'#e11d48', channel:'ig', status:'pending', funnel:'novo', tags:['Lead'], last:'Quanto fica o pacote pra 5 atendentes?', time:'08:40', unread:0, ai:false, online:true },
  { id:6, name:'Rafael Mendes', color:'#ea580c', channel:'wa', status:'pending', funnel:'nego', tags:['Negociação'], last:'Vou conversar com meu sócio e te retorno.', time:'Ontem', unread:0, ai:false, online:false },
];

const CONV_VIEWS = [
  { id:'open', label:'Abertas', hint:'Aguardando atendimento' },
  { id:'pending', label:'Em andamento', hint:'Em atendimento' },
  { id:'resolved', label:'Resolvidas', hint:'Encerradas' },
];

const THREAD = [
  { who:'lead', t:'Oi! Vi o anúncio do plano Pro e queria entender melhor o que está incluso.', time:'09:38' },
  { who:'ai',   t:'Olá, Mariana! 👋 Que bom te ver por aqui. O plano Pro inclui 3 conexões (WhatsApp + Instagram), IA Copilot completo, CRM Kanban e até 10 usuários. Posso te enviar um comparativo?', time:'09:39' },
  { who:'lead', t:'Pode sim! E tem teste grátis?', time:'09:40' },
  { who:'ai',   t:'Tem sim — 14 dias grátis, sem cartão de crédito. Quer que eu já deixe seu ambiente pré-configurado?', time:'09:40' },
  { who:'lead', t:'Quero! Mas prefiro falar com uma pessoa pra tirar umas dúvidas de migração.', time:'09:42' },
];

const COMMENTS = [
  { id:1, user:'lucas.fit', color:'#16a34a', t:'Esse produto funciona pra quem tem loja só no Instagram?', time:'12 min', likes:3 },
  { id:2, user:'mari.boutique', color:'#db2777', t:'Acabei de assinar o Pro, recomendo demais! 🔥', time:'25 min', likes:12 },
  { id:3, user:'pedro.tech', color:'#2563eb', t:'Quanto custa o plano pra 10 atendentes?', time:'1 h', likes:1 },
  { id:4, user:'spam.promo23', color:'#6b7280', t:'GANHE DINHEIRO FÁCIL clique no meu link 💰💰', time:'1 h', likes:0, spam:true },
];

const STAGES = [
  { id:'novo', label:'Novo', color:'#42b9eb' },
  { id:'qual', label:'Qualificando', color:'#7c3aed' },
  { id:'prop', label:'Proposta', color:'#d97706' },
  { id:'nego', label:'Negociação', color:'#2563eb' },
  { id:'ganho', label:'Ganho', color:'#16a34a' },
];
const LEADS = {
  novo:[ {n:'Mariana Costa',v:'2.964',ch:'wa',c:'#7c3aed',tag:'Plano Pro'}, {n:'@ana.makeup',v:'5.928',ch:'ig',c:'#e11d48',tag:'5 usuários'}, {n:'Loja Verde',v:'1.164',ch:'wa',c:'#16a34a',tag:'Básico'} ],
  qual:[ {n:'@joao.designer',v:'2.964',ch:'ig',c:'#db2777',tag:'Integração'}, {n:'Bruno Telecom',v:'7.164',ch:'wa',c:'#0891b2',tag:'Enterprise'} ],
  prop:[ {n:'Rafael Mendes',v:'2.964',ch:'wa',c:'#ea580c',tag:'Aguardando'}, {n:'Studio Pilates',v:'2.964',ch:'wa',c:'#7c3aed',tag:'Proposta enviada'} ],
  nego:[ {n:'Carlos — Loja Sul',v:'5.928',ch:'wa',c:'#2563eb',tag:'Desconto'} ],
  ganho:[ {n:'Beatriz Almeida',v:'2.964',ch:'wa',c:'#0891b2',tag:'Assinou'}, {n:'mari.boutique',v:'2.964',ch:'ig',c:'#db2777',tag:'Pro anual'} ],
};

/* ---------------- Reusable bits ---------------- */
function Tag({ children, tone }) {
  const styles = {
    quente:{background:'rgba(220,38,38,.12)',color:'#ef4444'},
    default:{background:'var(--chip)',color:'var(--chip-text)'},
  };
  const hot = /quente|negocia/i.test(children);
  return <span style={{...(hot?styles.quente:styles.default),fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:7,whiteSpace:'nowrap'}}>{children}</span>;
}

/* ===================== SCREEN 1: INBOX ===================== */
function Inbox({ onOpen, theme, toggle, statusMap }) {
  const [view,setView] = useState('open');
  const [filter,setFilter] = useState('all');
  const filters = [
    {id:'all',label:'Todas'},
    {id:'wa',label:'WhatsApp',ic:<Wa s={13} c="var(--wa-green)"/>},
    {id:'ig',label:'Instagram'},
    {id:'ai',label:'IA ativa'},
  ];
  const st = statusMap || Object.fromEntries(CONVERSATIONS.map(c=>[c.id,c.status]));
  const counts = Object.fromEntries(CONV_VIEWS.map(v=>[v.id, CONVERSATIONS.filter(c=>st[c.id]===v.id).length]));
  const list = CONVERSATIONS.filter(c => st[c.id]===view)
    .filter(c => filter==='all' ? true : filter==='ai' ? c.ai : c.channel===filter);
  return (
    <Fragment>
      <div className="app-hdr tall">
        <div className="hdr-row">
          <div>
            <div className="hdr-title">Conversas</div>
            <div className="hdr-sub">{counts.open} aguardando · {counts.pending} em andamento</div>
          </div>
          <div className="hdr-spacer"></div>
          <ThemeToggle theme={theme} toggle={toggle} />
          <button className="hdr-icon" style={{background:'var(--brand-grad)',color:'#fff',border:'none'}}>{Ico.plus}</button>
        </div>
        <div className="viewtabs">
          {CONV_VIEWS.map(v => (
            <button key={v.id} className={'viewtab'+(view===v.id?' on':'')} onClick={()=>setView(v.id)}>
              {v.label}<span className="viewtab-n">{counts[v.id]}</span>
            </button>
          ))}
        </div>
        <div className="searchbar">{Ico.search}<input placeholder="Buscar conversa, lead ou tag…" /></div>
        <div className="chips no-scrollbar">
          {filters.map(f => <button key={f.id} className={'fchip'+(filter===f.id?' on':'')} onClick={()=>setFilter(f.id)}>{f.ic}{f.label}</button>)}
        </div>
      </div>
      <div className="body">
        {list.map(c => (
          <button key={c.id} className="conv-row" onClick={()=>onOpen(c)}>
            <Avatar name={c.name} color={c.color} channel={c.channel} ring={c.ai} />
            <div style={{minWidth:0,flex:1,textAlign:'left'}}>
              <div className="conv-top">
                <span className="conv-name">{c.name}</span>
                <span className="conv-time">{c.time}</span>
              </div>
              <div className="conv-bottom">
                <span className="conv-last">{c.last}</span>
                {c.unread>0 && <span className="conv-unread">{c.unread}</span>}
              </div>
              <div className="conv-tags">
                {c.ai && <span className="conv-ai ai-glow"><span className="ai-dot ai-pulse"></span>IA atendendo</span>}
                {c.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </button>
        ))}
        {list.length===0 && <div style={{textAlign:'center',color:'var(--text-3)',padding:'48px 24px',fontWeight:600}}>Nenhuma conversa nesta visão.</div>}
        <div style={{height:14}}></div>
      </div>
    </Fragment>
  );
}

/* ===================== SCREEN 2: CHAT + COPILOT ===================== */
function Chat({ conv, onBack, toast, stage, onMove, status, onStatus }) {
  const [msgs,setMsgs] = useState(THREAD);
  const [text,setText] = useState('');
  const [copilot,setCopilot] = useState(false);
  const [moveSheet,setMoveSheet] = useState(false);
  const [aiCard,setAiCard] = useState(null); // {type, content}
  const [thinking,setThinking] = useState(false);
  const bodyRef = useRef(null);
  const curStage = STAGES.find(s=>s.id===stage) || STAGES[0];
  useEffect(()=>{ if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; },[msgs,aiCard,thinking]);

  const send = (t) => {
    const v = (t ?? text).trim(); if(!v) return;
    setMsgs(m => [...m, {who:'human', t:v, time:'agora'}]);
    setText(''); setAiCard(null);
  };

  const runAction = (type) => {
    setCopilot(false); setThinking(true); setAiCard(null);
    setTimeout(()=>{
      setThinking(false);
      if(type==='resumir') setAiCard({type, title:'Resumo da conversa', content:'Mariana veio do anúncio do Plano Pro. Já entende o que está incluso e o teste grátis de 14 dias. Quer migrar mas prefere falar com um humano para tirar dúvidas de migração. Próximo passo: tranquilizar sobre a migração assistida.'});
      else if(type==='sugerir') setAiCard({type, title:'Resposta sugerida', content:'Claro, Mariana! Eu mesma te acompanho na migração 😊 Importamos seus contatos e conversas sem perder histórico, e configuro suas conexões com você ao vivo. Podemos começar seu teste agora — qual o melhor horário pra uma call rápida de 15 min?'});
      else setAiCard({type, title:'Tom ajustado · mais cordial', content: text ? `"${text}" → "${text.replace(/\.$/,'')}, fico à disposição pra te ajudar no que precisar! 😊"` : 'Digite uma mensagem primeiro para eu ajustar o tom dela.'});
    }, 900);
  };

  return (
    <Fragment>
      <div className="chat-hdr">
        <button className="hdr-icon" style={{width:40,height:40}} onClick={onBack}>{Ico.back}</button>
        <Avatar name={conv.name} color={conv.color} channel={conv.channel} size={40} />
        <div style={{minWidth:0,flex:1}}>
          <div style={{fontWeight:800,fontSize:16,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{conv.name}</div>
          <div style={{fontSize:12,color: conv.ai?'var(--accent-bright)':'var(--ok)',fontWeight:700,display:'flex',alignItems:'center',gap:5}}>
            {conv.ai ? <Fragment><span className="ai-dot ai-pulse"></span>IA Copilot ativa</Fragment> : <Fragment><span style={{width:7,height:7,borderRadius:9,background:'var(--ok)'}}></span>Online agora</Fragment>}
          </div>
        </div>
        <button className="hdr-icon" style={{width:40,height:40}} onClick={()=>setMoveSheet(true)} title="Mover no funil">{Ico.funnel}</button>
        {status==='resolved'
          ? <button className="hdr-icon" style={{width:40,height:40}} onClick={()=>{onStatus&&onStatus('pending');toast&&toast('Conversa reaberta');onBack();}} title="Reabrir">{Ico.chat}</button>
          : <button className="hdr-icon" style={{width:40,height:40,background:'var(--brand-grad-soft)',color:'var(--accent-bright)',borderColor:'rgba(66,185,235,.3)'}} onClick={()=>{onStatus&&onStatus('resolved');toast&&toast('Atendimento encerrado');onBack();}} title="Encerrar">{Ico.check}</button>}
      </div>

      <div className="chat-stagebar" onClick={()=>setMoveSheet(true)}>
        <span className="ai-dot" style={{background:curStage.color}}></span>
        <span style={{fontWeight:700,fontSize:12.5,color:'var(--text-2)'}}>No funil: <b style={{color:'var(--text)'}}>{curStage.label}</b></span>
        <span style={{marginLeft:'auto',fontSize:12,fontWeight:800,color:'var(--accent-bright)'}}>Mover ›</span>
      </div>

      <div className="body chat-body" ref={bodyRef}>
        <div className="chat-day">Hoje</div>
        {msgs.map((m,i) => <Bubble key={i} m={m} />)}
        {thinking && <div className="bubble ai"><div className="ai-head">{Ico.spark} IA Copilot</div><div className="typing"><span></span><span></span><span></span></div></div>}
        {aiCard && <AiCard card={aiCard} onUse={()=>{ if(aiCard.type==='sugerir'){send(aiCard.content);} else if(aiCard.type==='corrigir' && text){ setText(aiCard.content.split('→')[1]?.replace(/[""]/g,'').trim()||text);} setAiCard(null); }} onDismiss={()=>setAiCard(null)} />}
        <div style={{height:8}}></div>
      </div>

      {copilot && <CopilotSheet onClose={()=>setCopilot(false)} onAction={runAction} />}
      {moveSheet && (
        <Fragment>
          <div className="sheet-scrim" onClick={()=>setMoveSheet(false)}></div>
          <div className="sheet">
            <div className="sheet-grip"></div>
            <div className="sheet-title">{Ico.funnel}<span>Mover no funil</span></div>
            {STAGES.map(s => (
              <button key={s.id} className="copilot-action" style={{padding:'12px 13px'}} onClick={()=>{ onMove&&onMove(s.id); setMoveSheet(false); toast&&toast('Lead movido para '+s.label); }}>
                <span style={{width:12,height:12,borderRadius:'50%',background:s.color,flex:'none'}}></span>
                <span style={{flex:1,textAlign:'left',fontWeight:800,fontSize:15}}>{s.label}</span>
                {s.id===stage && <span style={{color:'var(--accent-bright)'}}>{Ico.check}</span>}
              </button>
            ))}
          </div>
        </Fragment>
      )}

      <div className="composer">
        <button className={'copilot-btn'+(copilot?' on':'')} onClick={()=>setCopilot(c=>!c)} title="Copiloto IA">
          {Ico.spark}
        </button>
        <div className="composer-input">
          <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Mensagem…" />
        </div>
        <button className="send-btn" onClick={()=>send()}>{Ico.send}</button>
      </div>
    </Fragment>
  );
}

function Bubble({ m }) {
  if(m.who==='ai') return (
    <div className="bubble ai">
      <div className="ai-head">{Ico.spark} IA Copilot</div>
      <div className="bubble-txt">{m.t}</div>
      <div className="bubble-time">{m.time}</div>
    </div>
  );
  const mine = m.who==='human';
  return (
    <div className={'bubble '+(mine?'me':'lead')}>
      <div className="bubble-txt">{m.t}</div>
      <div className="bubble-time">{m.time}{mine && ' · você'}</div>
    </div>
  );
}

function AiCard({ card, onUse, onDismiss }) {
  return (
    <div className="aicard">
      <div className="aicard-head">{Ico.spark}<span>{card.title}</span></div>
      <div className="aicard-body">{card.content}</div>
      <div className="aicard-actions">
        <button className="btn btn-primary" style={{height:40,minHeight:40,fontSize:13,flex:1}} onClick={onUse}>
          {card.type==='sugerir'?'Usar resposta':card.type==='corrigir'?'Aplicar':'Inserir no chat'}
        </button>
        <button className="btn btn-ghost" style={{height:40,minHeight:40,fontSize:13}} onClick={onDismiss}>Descartar</button>
      </div>
    </div>
  );
}

function CopilotSheet({ onClose, onAction }) {
  const actions = [
    {id:'resumir', ic:Ico.doc, t:'Resumir', d:'Resumo rápido da conversa'},
    {id:'sugerir', ic:Ico.wand, t:'Sugerir Resposta', d:'Próxima mensagem ideal'},
    {id:'corrigir', ic:Ico.bolt, t:'Corrigir Tom', d:'Ajusta o que você escreveu'},
  ];
  return (
    <Fragment>
      <div className="sheet-scrim" onClick={onClose}></div>
      <div className="sheet">
        <div className="sheet-grip"></div>
        <div className="sheet-title">{Ico.spark}<span>Copiloto IA</span></div>
        {actions.map(a => (
          <button key={a.id} className="copilot-action" onClick={()=>onAction(a.id)}>
            <span className="ca-ic">{a.ic}</span>
            <span style={{textAlign:'left'}}><span className="ca-t">{a.t}</span><span className="ca-d">{a.d}</span></span>
            <span className="ca-arrow">{Ico.back}</span>
          </button>
        ))}
      </div>
    </Fragment>
  );
}

/* ===================== SCREEN 3: MODERATION ===================== */
function Moderation({ theme, toggle, toast }) {
  const [hidden,setHidden] = useState([]);
  const [deleted,setDeleted] = useState([]);
  const [replied,setReplied] = useState({});
  const [replyOpen,setReplyOpen] = useState(null);
  const [draft,setDraft] = useState('');
  const list = COMMENTS.filter(c=>!deleted.includes(c.id));
  const sendReply = (id) => { if(!draft.trim()) return; setReplied(r=>({...r,[id]:draft.trim()})); setReplyOpen(null); setDraft(''); toast('Resposta publicada'); };
  return (
    <Fragment>
      <div className="app-hdr">
        <div><div className="hdr-title">Comentários</div><div className="hdr-sub">Moderação · Instagram</div></div>
        <div className="hdr-spacer"></div>
        <ThemeToggle theme={theme} toggle={toggle} />
      </div>
      <div className="body" style={{padding:'14px'}}>
        <div className="card post">
          <div className="post-media">
            <Ig s={34} c="rgba(255,255,255,.9)" />
            <span className="post-mediatag">Reels · Lançamento Plano Pro</span>
          </div>
          <div className="post-meta">
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:'var(--ig-grad)',display:'grid',placeItems:'center'}}><Ig s={15}/></div>
              <span style={{fontWeight:800,fontSize:14}}>@omnichannelplus</span>
            </div>
            <div className="post-stats"><b>1.284</b> curtidas · <b>{COMMENTS.length}</b> comentários</div>
          </div>
        </div>

        <div className="mod-count">{list.length - hidden.length} comentários para moderar</div>

        {list.map(c => {
          const isHidden = hidden.includes(c.id);
          const isReplied = replied[c.id];
          return (
            <div key={c.id} className={'card comment'+(isHidden?' is-hidden':'')}>
              <div className="comment-top">
                <Avatar name={c.user} color={c.color} size={38} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap'}}>
                    <span style={{fontWeight:800,fontSize:14}}>@{c.user}</span>
                    {c.spam && <span style={{fontSize:10,fontWeight:800,color:'var(--bad)',background:'rgba(220,38,38,.12)',padding:'2px 7px',borderRadius:6}}>SPAM</span>}
                    {isReplied && <span style={{fontSize:10,fontWeight:800,color:'var(--ok)',background:'rgba(22,163,74,.12)',padding:'2px 7px',borderRadius:6}}>Respondido</span>}
                    <span style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>· {c.time}</span>
                  </div>
                  <div className="comment-txt">{isHidden ? <em style={{color:'var(--text-3)'}}>Comentário ocultado</em> : c.t}</div>
                </div>
              </div>

              {isReplied && !isHidden && (
                <div className="comment-reply-sent">
                  <div style={{width:24,height:24,borderRadius:'50%',background:'var(--ig-grad)',display:'grid',placeItems:'center',flex:'none'}}><Ig s={11}/></div>
                  <div style={{minWidth:0}}><div style={{fontSize:11,fontWeight:800}}>@omnichannelplus</div><div style={{fontSize:13,fontWeight:500,marginTop:1}}>{isReplied}</div></div>
                </div>
              )}

              {!isHidden && replyOpen===c.id && (
                <div className="comment-reply">
                  <input autoFocus placeholder={'Responder a @'+c.user+'…'} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendReply(c.id)} />
                  <button className="crp-send" onClick={()=>sendReply(c.id)}>{Ico.send}</button>
                </div>
              )}

              {!isHidden && (
                <div className="comment-actions">
                  <button className="ca-btn primary" onClick={()=>{setReplyOpen(replyOpen===c.id?null:c.id);setDraft('');}}>{Ico.reply} Responder</button>
                  <button className="ca-btn" onClick={()=>{setHidden(h=>[...new Set([...h,c.id])]); toast('Comentário ocultado');}}>{Ico.eyeoff} Ocultar</button>
                  <button className="ca-btn danger" onClick={()=>{setDeleted(d=>[...d,c.id]); toast('Comentário excluído');}}>{Ico.trash} Excluir</button>
                  <button className="ca-btn dm" onClick={()=>toast('Convertido em ticket no DM')}>{Ico.dm} DM</button>
                </div>
              )}
            </div>
          );
        })}
        <div style={{height:14}}></div>
      </div>
    </Fragment>
  );
}

/* ===================== SCREEN 4: KANBAN ===================== */
function Kanban({ theme, toggle, onOpenChat }) {
  const [stage,setStage] = useState('novo');
  const tabsRef = useRef(null);
  const leads = LEADS[stage] || [];
  return (
    <Fragment>
      <div className="app-hdr tall">
        <div className="hdr-row">
          <div><div className="hdr-title">Funil de Vendas</div><div className="hdr-sub">CRM · arraste para avançar</div></div>
          <div className="hdr-spacer"></div>
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>
        <div className="chips no-scrollbar" ref={tabsRef}>
          {STAGES.map(s => (
            <button key={s.id} className={'stage-tab'+(stage===s.id?' on':'')} onClick={()=>setStage(s.id)} style={stage===s.id?{borderColor:s.color,color:s.color}:null}>
              <span className="stage-dot" style={{background:s.color}}></span>
              {s.label}
              <span className="stage-count">{(LEADS[s.id]||[]).length}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="body" style={{padding:'12px 14px'}}>
        <div className="stage-summary">
          <span>{leads.length} {leads.length===1?'card':'cards'}</span>
        </div>
        {leads.map((l,i) => (
          <div key={i} className="card lead-card">
            <div style={{display:'flex',alignItems:'center',gap:11}}>
              <Avatar name={l.n} color={l.c} channel={l.ch} size={42} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:800,fontSize:15,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{l.n}</div>
                <div style={{display:'flex',alignItems:'center',gap:7,marginTop:3}}>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--chip-text)',background:'var(--chip)',padding:'2px 8px',borderRadius:6}}>{l.tag}</span>
                  <span style={{fontSize:11,fontWeight:700,color:'var(--text-3)',display:'inline-flex',alignItems:'center',gap:4}}>{l.ch==='wa'?<Wa s={12} c="var(--wa-green)"/>:<Ig s={12} c="var(--ig-magenta)"/>}{l.ch==='wa'?'WhatsApp':'Instagram'}</span>
                </div>
              </div>
            </div>
            <button className="lead-chat" onClick={onOpenChat}>{Ico.chat} Abrir conversa</button>
          </div>
        ))}
        {leads.length===0 && <div style={{textAlign:'center',color:'var(--text-3)',padding:'40px 0',fontWeight:600}}>Nenhum card nesta etapa.</div>}
        <div style={{height:14}}></div>
      </div>
    </Fragment>
  );
}

/* ===================== SCREEN 5: PROFILE ===================== */
function Profile({ theme, toggle }) {
  const [available,setAvailable] = useState(true);
  return (
    <Fragment>
      <div className="app-hdr"><div className="hdr-title">Perfil</div><div className="hdr-spacer"></div><ThemeToggle theme={theme} toggle={toggle} /></div>
      <div className="body" style={{padding:'16px 14px'}}>
        <div className="card" style={{padding:18,display:'flex',alignItems:'center',gap:14,marginBottom:14}}>
          <Avatar name="Júlia Ramos" color="#2a688f" size={56} />
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:18}}>Júlia Ramos</div>
            <div style={{fontSize:13,color:'var(--text-2)',fontWeight:600}}>Operadora · Fila Comercial</div>
          </div>
        </div>
        <div className="card" style={{padding:'14px 16px',display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
          <span style={{width:11,height:11,borderRadius:9,background:available?'var(--ok)':'var(--text-3)'}}></span>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15}}>{available?'Disponível':'Ausente'}</div><div style={{fontSize:12.5,color:'var(--text-3)',fontWeight:600}}>Recebendo novos atendimentos</div></div>
          <button className={'switch'+(available?' on':'')} onClick={()=>setAvailable(a=>!a)}><span className="knob"></span></button>
        </div>
        <div className="prof-stats">
          {[['18','Atendimentos hoje'],['2m 14s','Tempo médio'],['96%','CSAT']].map(([v,l])=>(
            <div key={l} className="card" style={{padding:'16px 12px',textAlign:'center'}}>
              <div style={{fontSize:24,fontWeight:800,letterSpacing:'-.02em',background:'var(--brand-grad)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{v}</div>
              <div style={{fontSize:11.5,color:'var(--text-3)',fontWeight:700,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14}} className="card">
          {[['Minhas filas','Comercial · Suporte'],['Notificações','Ativadas'],['Atalhos rápidos','12 salvos']].map(([t,d],i)=>(
            <div key={t} style={{display:'flex',alignItems:'center',gap:12,padding:'15px 16px',borderTop:i?'1px solid var(--border)':'none'}}>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14.5}}>{t}</div><div style={{fontSize:12.5,color:'var(--text-3)',fontWeight:600}}>{d}</div></div>
              <span style={{color:'var(--text-3)',transform:'rotate(180deg)'}}>{Ico.back}</span>
            </div>
          ))}
        </div>
        <a href="Management.html" className="btn btn-soft" style={{width:'100%',marginTop:16}}>{Ico.cog} Ir para o Hub de Gestão</a>
        <a href="Landing.html" className="btn btn-ghost" style={{width:'100%',marginTop:10}}>← Voltar para a Landing</a>
        <div style={{height:14}}></div>
      </div>
    </Fragment>
  );
}

/* ===================== APP SHELL ===================== */
function OperatorApp() {
  const [theme,toggle] = useTheme();
  const [tab,setTab] = useState('conversas');
  const [chat,setChat] = useState(null);
  const [funnelMap,setFunnelMap] = useState(() => Object.fromEntries(CONVERSATIONS.map(c=>[c.id,c.funnel])));
  const [statusMap,setStatusMap] = useState(() => Object.fromEntries(CONVERSATIONS.map(c=>[c.id,c.status])));
  const [toastNode,showToast] = useToast();
  const moveFunnel = (id,st)=>setFunnelMap(m=>({...m,[id]:st}));
  const setStatus = (id,st)=>setStatusMap(m=>({...m,[id]:st}));

  const tabs = [
    {id:'conversas',label:'Conversas',icon:Ico.chat,badge:3},
    {id:'comentarios',label:'Comentários',icon:Ico.comment,badge:4},
    {id:'funil',label:'Funil',icon:Ico.funnel},
    {id:'perfil',label:'Perfil',icon:Ico.user},
  ];

  let screen;
  if(chat) screen = <Chat conv={chat} onBack={()=>setChat(null)} toast={showToast} stage={funnelMap[chat.id]} onMove={(st)=>moveFunnel(chat.id,st)} status={statusMap[chat.id]} onStatus={(st)=>{setStatus(chat.id,st);}} />;
  else if(tab==='conversas') screen = <Inbox onOpen={setChat} theme={theme} toggle={toggle} statusMap={statusMap} />;
  else if(tab==='comentarios') screen = <Moderation theme={theme} toggle={toggle} toast={showToast} />;
  else if(tab==='funil') screen = <Kanban theme={theme} toggle={toggle} onOpenChat={()=>{setChat(CONVERSATIONS[0]);}} />;
  else screen = <Profile theme={theme} toggle={toggle} />;

  return (
    <Fragment>
      <div className="floater">
        <a href="Landing.html">Landing</a>
        <a className="on" href="Operator.html">Operador</a>
        <a href="Management.html">Gestão</a>
        <span className="sep"></span>
        <a href="Operator Desktop.html">Desktop ↗</a>
      </div>
      <Device>
        {screen}
        {toastNode}
        {!chat && <BottomNav tabs={tabs} active={tab} onChange={setTab} />}
      </Device>
    </Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<OperatorApp />);
