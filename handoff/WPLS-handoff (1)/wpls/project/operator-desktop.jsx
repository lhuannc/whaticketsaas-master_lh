/* =====================================================================
   Omnichannel Plus — Operator Desktop console
   3-pane inbox + chat + copilot · horizontal Kanban · moderation · perfil
   Requires app-shared.jsx + app-data.jsx globals.
   ===================================================================== */

/* ---------- Shared desktop chrome ---------- */
function TopBar({ theme, toggle, available, setAvailable }) {
  return (
    <div className="dk-topbar">
      <div className="dk-brand">
        <span className="dk-logo"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><circle cx="9" cy="11.5" r="1" fill="#fff" stroke="none"/><circle cx="12" cy="11.5" r="1" fill="#fff" stroke="none"/><circle cx="15" cy="11.5" r="1" fill="#fff" stroke="none"/></svg></span>
        Omnichannel<span style={{color:'var(--accent)'}}>Plus</span>
      </div>
      <div className="dk-search">{Ico.search}<input placeholder="Buscar conversas, leads, tags…" /><kbd>⌘K</kbd></div>
      <div className="dk-spacer"></div>
      <div className="dk-top-actions">
        <button className={'dk-presence'+(available?' on':'')} onClick={()=>setAvailable(a=>!a)} title="Sua disponibilidade">
          <span className="dk-presence-dot"></span>{available?'Disponível':'Ausente'}
        </button>
        <div className="dk-viewswitch">
          <a href="Operator.html">{Ico.user} Mobile</a>
          <a className="on" href="Operator Desktop.html">{Ico.grid} Desktop</a>
        </div>
        <button className="dk-iconbtn" title="Notificações"><span className="ndot"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg></button>
        <button className="dk-iconbtn" onClick={toggle} title="Tema">{theme==='light'?Ico.moon:Ico.sun}</button>
        <div className="dk-me">
          <Avatar name="Júlia Ramos" color="#2a688f" size={32} />
          <div><div className="dk-me-name">Júlia Ramos</div><div className="dk-me-role">Operadora</div></div>
        </div>
      </div>
    </div>
  );
}

function Rail({ active, onChange }) {
  const items = [
    {id:'conversas', label:'Conversas', icon:Ico.chat, badge:3},
    {id:'comentarios', label:'Coment.', icon:Ico.comment, badge:5},
    {id:'funil', label:'Funil', icon:Ico.funnel},
    {id:'perfil', label:'Perfil', icon:Ico.user},
  ];
  return (
    <div className="dk-rail">
      {items.map(i => (
        <button key={i.id} className={'dk-rail-btn'+(active===i.id?' on':'')} onClick={()=>onChange(i.id)}>
          {i.badge ? <span className="dk-rail-badge">{i.badge}</span> : null}
          {i.icon}<span>{i.label}</span>
        </button>
      ))}
      <div className="dk-rail-sp"></div>
      <a className="dk-rail-btn" href="Management.html" style={{textDecoration:'none'}}>{Ico.cog}<span>Gestão</span></a>
    </div>
  );
}

/* ================= INBOX ================= */
function Inbox({ toast }) {
  const [sel, setSel] = useState(CONVERSATIONS[0]);
  const [view, setView] = useState('open');
  const [filter, setFilter] = useState('all');
  const [funnelMap, setFunnelMap] = useState(() => Object.fromEntries(CONVERSATIONS.map(c=>[c.id,c.funnel])));
  const [statusMap, setStatusMap] = useState(() => Object.fromEntries(CONVERSATIONS.map(c=>[c.id,c.status])));
  const filters = [{id:'all',label:'Todas'},{id:'wa',label:'WhatsApp'},{id:'ig',label:'Instagram'},{id:'ai',label:'IA ativa'}];
  const counts = Object.fromEntries(CONV_VIEWS.map(v=>[v.id, CONVERSATIONS.filter(c=>statusMap[c.id]===v.id).length]));
  const list = CONVERSATIONS.filter(c => statusMap[c.id]===view)
    .filter(c => filter==='all'?true:filter==='ai'?c.ai:c.channel===filter);
  const moveFunnel = (id, stageId) => { setFunnelMap(m=>({...m,[id]:stageId})); };
  const setStatus = (id, st) => { setStatusMap(m=>({...m,[id]:st})); setView(st); };
  return (
    <div className="dk-inbox">
      {/* list */}
      <div className="dk-list">
        <div className="dk-list-hdr">
          <div className="dk-list-title">
            <h2>Conversas</h2>
            <button className="dk-iconbtn" style={{width:34,height:34,background:'var(--brand-grad)',color:'#fff',border:'none'}}>{Ico.plus}</button>
          </div>
          <div className="dk-viewtabs">
            {CONV_VIEWS.map(v => (
              <button key={v.id} className={'dk-viewtab'+(view===v.id?' on':'')} onClick={()=>setView(v.id)}>
                {v.label}<span className="dk-viewtab-n">{counts[v.id]}</span>
              </button>
            ))}
          </div>
          <div className="dk-search" style={{maxWidth:'none',height:38,margin:'12px 0'}}>{Ico.search}<input placeholder="Buscar…" /></div>
          <div className="chips no-scrollbar">
            {filters.map(f => <button key={f.id} className={'fchip'+(filter===f.id?' on':'')} onClick={()=>setFilter(f.id)}>{f.label}</button>)}
          </div>
        </div>
        <div className="dk-list-scroll">
          {list.map(c => (
            <button key={c.id} className={'dk-conv'+(sel.id===c.id?' on':'')} onClick={()=>setSel(c)}>
              <Avatar name={c.name} color={c.color} channel={c.channel} ring={c.ai} size={44} />
              <div style={{minWidth:0,flex:1}}>
                <div className="dk-conv-top"><span className="dk-conv-name">{c.name}</span><span className="dk-conv-time">{c.time}</span></div>
                <div className="dk-conv-last">{c.last}</div>
                <div className="dk-conv-tags">
                  {c.ai && <span className="dk-ai-tag ai-glow"><span className="dk-ai-dot ai-pulse"></span>IA atendendo</span>}
                  {c.tags.map(t => <span key={t} className={'dk-tag'+(/quente|negocia/i.test(t)?' hot':'')}>{t}</span>)}
                  {c.unread>0 && <span className="dk-conv-unread" style={{marginLeft:'auto'}}>{c.unread}</span>}
                </div>
              </div>
            </button>
          ))}
          {list.length===0 && <div style={{textAlign:'center',color:'var(--text-3)',padding:'48px 24px',fontWeight:600,fontSize:13.5}}>Nenhuma conversa nesta visão.</div>}
        </div>
      </div>
      {/* chat */}
      <ChatPane conv={sel} toast={toast} stage={funnelMap[sel.id]} onMove={(st)=>moveFunnel(sel.id,st)} status={statusMap[sel.id]} onStatus={(st)=>setStatus(sel.id,st)} />
      {/* context */}
      <ContextPane conv={sel} toast={toast} stage={funnelMap[sel.id]} onMove={(st)=>moveFunnel(sel.id,st)} />
    </div>
  );
}

function ChatPane({ conv, toast, stage, onMove, status, onStatus }) {
  const [msgs, setMsgs] = useState(THREAD);
  const [text, setText] = useState('');
  const [moveOpen, setMoveOpen] = useState(false);
  const bodyRef = useRef(null);
  useEffect(()=>{ setMsgs(THREAD); setMoveOpen(false); }, [conv.id]);
  useEffect(()=>{ if(bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs]);
  const send = (t) => { const v=(t??text).trim(); if(!v) return; setMsgs(m=>[...m,{who:'human',t:v,time:'agora'}]); setText(''); };
  window.__dkSend = send; // bridge for context-pane "use response"
  const curStage = STAGES.find(s=>s.id===stage) || STAGES[0];
  return (
    <div className="dk-chat">
      <div className="dk-chat-hdr">
        <Avatar name={conv.name} color={conv.color} channel={conv.channel} size={42} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:800,fontSize:16}}>{conv.name}</div>
          <div style={{fontSize:12.5,color:conv.ai?'var(--accent-bright)':'var(--ok)',fontWeight:700,display:'flex',alignItems:'center',gap:5}}>
            {conv.ai ? <span style={{display:'contents'}}><span className="dk-ai-dot ai-pulse"></span>IA Copilot ativa</span> : <span style={{display:'contents'}}><span style={{width:7,height:7,borderRadius:9,background:'var(--ok)'}}></span>Online agora</span>}
          </div>
        </div>
        {/* Mover no funil (direto do chat) */}
        <div style={{position:'relative'}}>
          <button className="dk-stage-btn" onClick={()=>setMoveOpen(o=>!o)} title="Mover no funil">
            <span className="dk-stage-dot" style={{background:curStage.color}}></span>
            <span className="dk-stage-lbl">{curStage.label}</span>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          {moveOpen && (
            <div className="dk-stage-menu">
              <div className="dk-stage-menu-h">Mover no funil</div>
              {STAGES.map(s => (
                <button key={s.id} className={'dk-stage-opt'+(s.id===stage?' on':'')} onClick={()=>{ onMove(s.id); setMoveOpen(false); toast('Lead movido para '+s.label); }}>
                  <span className="dk-stage-dot" style={{background:s.color}}></span>{s.label}
                  {s.id===stage && <span style={{marginLeft:'auto',color:'var(--accent-bright)'}}>{Ico.check}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        {status==='resolved'
          ? <button className="dk-iconbtn" title="Reabrir" onClick={()=>{onStatus('pending');toast('Conversa reaberta');}}>{Ico.chat}</button>
          : <button className="dk-iconbtn" title="Encerrar atendimento" onClick={()=>{onStatus('resolved');toast('Atendimento encerrado');}}>{Ico.check}</button>}
      </div>
      <div className="dk-chat-body" ref={bodyRef}>
        <div className="dk-day">Hoje · {conv.channel==='wa'?'WhatsApp':'Instagram Direct'}</div>
        {msgs.map((m,i) => (
          m.who==='ai' ? (
            <div key={i} className="dk-bubble ai"><div className="dk-ai-head">{Ico.spark} IA Copilot</div><div className="bt">{m.t}</div><div className="bm">{m.time}</div></div>
          ) : m.who==='system' ? (
            <div key={i} className="dk-sysmsg">{m.t}</div>
          ) : (
            <div key={i} className={'dk-bubble '+(m.who==='human'?'me':'lead')}><div className="bt">{m.t}</div><div className="bm">{m.time}{m.who==='human'&&' · você'}</div></div>
          )
        ))}
      </div>
      <div className="dk-composer">
        <div className="dk-quickbar">
          <button className="dk-quick" onClick={()=>send('Claro! Posso te ligar em 15 minutos?')}>{Ico.bolt} Resposta rápida</button>
          <button className="dk-quick" onClick={()=>toast('Modelo de proposta anexado')}>{Ico.doc} Enviar proposta</button>
          <button className="dk-quick" onClick={()=>setMoveOpen(true)}>{Ico.funnel} Mover no funil</button>
        </div>
        <div className="dk-composer-box">
          <textarea rows={1} value={text} placeholder="Escreva uma mensagem…  (Enter envia)" onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send(); } }} />
          <button className="dk-send" onClick={()=>send()}>{Ico.send}</button>
        </div>
      </div>
    </div>
  );
}

function ContextPane({ conv, toast, stage, onMove }) {
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);
  const [stageOpen, setStageOpen] = useState(false);
  useEffect(()=>{ setOut(null); setStageOpen(false); }, [conv.id]);
  const curStage = STAGES.find(s=>s.id===stage) || STAGES[0];
  const run = (type) => {
    setBusy(type); setOut(null);
    setTimeout(()=>{
      setBusy(false);
      if(type==='resumir') setOut({type, title:'Resumo', body:`${conv.name} veio do anúncio do Plano Pro, já entende o que está incluso e o teste grátis de 14 dias. Quer migrar mas prefere falar com um humano sobre a migração. Próximo passo: tranquilizar sobre migração assistida.`});
      else if(type==='sugerir') setOut({type, title:'Resposta sugerida', body:'Claro! Eu mesma te acompanho na migração 😊 Importamos seus contatos e conversas sem perder histórico e configuro suas conexões ao vivo. Podemos começar seu teste agora — qual o melhor horário pra uma call rápida de 15 min?'});
      else setOut({type, title:'Tom ajustado · cordial', body:'Sua mensagem ficou mais calorosa e consultiva, mantendo a objetividade. Pronta para enviar.'});
    }, 850);
  };
  const acts = [
    {id:'resumir', ic:Ico.doc, t:'Resumir conversa', d:'TL;DR do atendimento'},
    {id:'sugerir', ic:Ico.wand, t:'Sugerir resposta', d:'Próxima mensagem ideal'},
    {id:'corrigir', ic:Ico.bolt, t:'Corrigir tom', d:'Ajusta o que você escreveu'},
  ];
  return (
    <div className="dk-context">
      <div className="dk-ctx-scroll">
        <div className="dk-ctx-profile">
          <div style={{display:'flex',justifyContent:'center'}}><Avatar name={conv.name} color={conv.color} channel={conv.channel} size={66} /></div>
          <div className="dk-ctx-name">{conv.name}</div>
          <div className="dk-ctx-handle">{conv.online?'Online agora':'Visto por último hoje'}</div>
        </div>

        <div className="dk-ctx-sec">
          <div className="dk-ctx-label">Etapa no funil</div>
          <div style={{position:'relative'}}>
            <button className="dk-ctx-stage" onClick={()=>setStageOpen(o=>!o)}>
              <span className="dk-stage-dot" style={{background:curStage.color}}></span>
              <span style={{flex:1,textAlign:'left',fontWeight:800,fontSize:15}}>{curStage.label}</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {stageOpen && (
              <div className="dk-stage-menu" style={{left:0,right:0}}>
                {STAGES.map(s => (
                  <button key={s.id} className={'dk-stage-opt'+(s.id===stage?' on':'')} onClick={()=>{ onMove(s.id); setStageOpen(false); toast('Lead movido para '+s.label); }}>
                    <span className="dk-stage-dot" style={{background:s.color}}></span>{s.label}
                    {s.id===stage && <span style={{marginLeft:'auto',color:'var(--accent-bright)'}}>{Ico.check}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dk-ctx-sec">
          <div className="dk-ctx-label">Contato</div>
          <div className="dk-ctx-field">{Ico.chat}<span>{conv.phone}</span></div>
          <div className="dk-ctx-field">{Ico.doc}<span style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{conv.email}</span></div>
          <div className="dk-ctx-field" style={{borderBottom:'none'}}>{conv.channel==='wa'?<Wa s={16} c="var(--wa-green)"/>:<Ig s={16} c="var(--ig-magenta)"/>}<span>{conv.channel==='wa'?'WhatsApp':'Instagram'}</span></div>
        </div>

        <div className="dk-ctx-sec">
          <div className="dk-ctx-label">Etiquetas</div>
          <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
            {conv.tags.map(t=><span key={t} className={'dk-tag'+(/quente|negocia/i.test(t)?' hot':'')}>{t}</span>)}
            <button className="dk-tag" style={{cursor:'pointer',border:'1px dashed var(--border-2)',background:'transparent'}} onClick={()=>toast('Nova etiqueta adicionada')}>+ Etiqueta</button>
          </div>
        </div>

        <div className="dk-ctx-sec">
          <div className="dk-copilot-card">
            <div className="dk-copilot-head ai-glow">{Ico.spark} Copiloto IA</div>
            <div className="dk-copilot-sub">Sempre ao lado da conversa</div>
            {acts.map(a => (
              <button key={a.id} className="dk-copilot-act" onClick={()=>run(a.id)}>
                <span className="ic">{busy===a.id ? <span className="dk-typing" style={{padding:0}}><span className="ai-pulse"></span><span className="ai-pulse"></span><span className="ai-pulse"></span></span> : a.ic}</span>
                <span><span className="t">{a.t}</span><span className="d">{a.d}</span></span>
              </button>
            ))}
            {out && (
              <div className="dk-copilot-out">
                <div className="oh">{Ico.spark} {out.title}</div>
                <div className="ob">{out.body}</div>
                <div className="obtns">
                  <button className="btn btn-primary" style={{height:38,minHeight:38,fontSize:13,flex:1}} onClick={()=>{ if(out.type==='sugerir'&&window.__dkSend){window.__dkSend(out.body);} toast(out.type==='sugerir'?'Resposta inserida':'Aplicado'); setOut(null); }}>
                    {out.type==='sugerir'?'Usar resposta':'Aplicar'}
                  </button>
                  <button className="btn btn-ghost" style={{height:38,minHeight:38,fontSize:13}} onClick={()=>setOut(null)}>{Ico.x}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= KANBAN (horizontal) ================= */
function Kanban({ toast }) {
  return (
    <div className="dk-board-wrap">
      <div className="dk-pane-hdr">
        <div><div className="dk-pane-title">Funil de Vendas</div><div className="dk-pane-sub">CRM · 5 etapas · arraste os cards entre colunas</div></div>
        <div className="dk-spacer"></div>
        <button className="btn btn-soft" style={{height:40,minHeight:40,fontSize:13.5}} onClick={()=>toast('Novo card criado')}>{Ico.plus} Novo card</button>
      </div>
      <div className="dk-board">
        {STAGES.map(s => {
          const leads = LEADS[s.id] || [];
          return (
            <div className="dk-col" key={s.id}>
              <div className="dk-col-hdr"><span className="dk-col-dot" style={{background:s.color}}></span><span className="dk-col-name">{s.label}</span><span className="dk-col-count">{leads.length}</span></div>
              <div className="dk-col-body">
                {leads.map((l,i) => (
                  <div className="dk-lead" key={i} draggable>
                    <div className="dk-lead-top">
                      <Avatar name={l.n} color={l.c} channel={l.ch} size={38} />
                      <div style={{minWidth:0,flex:1}}><div className="dk-lead-name">{l.n}</div><span className="dk-lead-tag">{l.tag}</span></div>
                    </div>
                    <div className="dk-lead-foot">
                      <span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:12,fontWeight:700,color:'var(--text-3)'}}>{l.ch==='wa'?<Wa s={13} c="var(--wa-green)"/>:<Ig s={13} c="var(--ig-magenta)"/>}{l.ch==='wa'?'WhatsApp':'Instagram'}</span>
                      <button className="dk-lead-chat" onClick={()=>toast('Abrindo conversa de '+l.n)}>{Ico.chat} Conversa</button>
                    </div>
                  </div>
                ))}
                {leads.length===0 && <div style={{textAlign:'center',color:'var(--text-3)',padding:'24px 0',fontWeight:600,fontSize:13}}>Vazio</div>}
              </div>
              <div className="dk-col-sum"><span>{leads.length} {leads.length===1?'card':'cards'}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= MODERATION ================= */
function Moderation({ toast }) {
  const [hidden, setHidden] = useState([]);
  const [deleted, setDeleted] = useState([]);
  const [replied, setReplied] = useState({});      // id -> texto enviado
  const [replyOpen, setReplyOpen] = useState(null);
  const [draft, setDraft] = useState('');
  const list = COMMENTS.filter(c => !deleted.includes(c.id));
  const openReply = (id) => { setReplyOpen(id); setDraft(''); };
  const sendReply = (id) => { if(!draft.trim()) return; setReplied(r=>({...r,[id]:draft.trim()})); setReplyOpen(null); setDraft(''); toast('Resposta publicada no comentário'); };
  return (
    <div className="dk-mod">
      <div className="dk-mod-side">
        <div className="dk-card dk-post-media"><Ig s={40} c="rgba(255,255,255,.95)"/><span>Reels · Lançamento Plano Pro</span></div>
        <div style={{display:'flex',alignItems:'center',gap:10,margin:'16px 0'}}>
          <div style={{width:34,height:34,borderRadius:'50%',background:'var(--ig-grad)',display:'grid',placeItems:'center'}}><Ig s={17}/></div>
          <div><div style={{fontWeight:800,fontSize:14}}>@omnichannelplus</div><div style={{fontSize:12,color:'var(--text-3)',fontWeight:600}}>Publicado há 3 h</div></div>
        </div>
        <div className="dk-grid-2" style={{gap:10}}>
          <div className="dk-card dk-stat" style={{padding:'14px 16px'}}><div className="dk-stat-l">Curtidas</div><div className="dk-stat-v" style={{fontSize:22}}>1.284</div></div>
          <div className="dk-card dk-stat" style={{padding:'14px 16px'}}><div className="dk-stat-l">Comentários</div><div className="dk-stat-v" style={{fontSize:22}}>{list.length}</div></div>
        </div>
        <div style={{fontSize:12.5,color:'var(--text-2)',fontWeight:600,marginTop:16,lineHeight:1.5}}>Responda publicamente, oculte, exclua ou converta dúvidas em tickets no Direct.</div>
      </div>
      <div className="dk-mod-main">
        <div className="dk-pane-title" style={{marginBottom:4}}>Comentários para moderar</div>
        <div className="dk-pane-sub" style={{marginBottom:18}}>{list.length - hidden.length} ativos · {hidden.length} ocultados · {deleted.length} excluídos</div>
        <div className="dk-mod-list">
          {list.map(c => {
            const isH = hidden.includes(c.id), isR = replied[c.id];
            return (
              <div key={c.id} className={'dk-comment'+(isH?' hidden':'')}>
                <Avatar name={c.user} color={c.color} size={42} />
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                    <span style={{fontWeight:800,fontSize:14}}>@{c.user}</span>
                    {c.spam && <span style={{fontSize:10,fontWeight:800,color:'var(--bad)',background:'rgba(220,38,38,.12)',padding:'2px 7px',borderRadius:6}}>SPAM</span>}
                    {isR && <span style={{fontSize:10,fontWeight:800,color:'var(--ok)',background:'rgba(22,163,74,.12)',padding:'2px 7px',borderRadius:6}}>Respondido</span>}
                    <span style={{fontSize:12,color:'var(--text-3)',fontWeight:600,whiteSpace:'nowrap'}}>· {c.time}</span>
                  </div>
                  <div className="dk-comment-txt">{isH ? <em style={{color:'var(--text-3)'}}>Comentário ocultado</em> : c.t}</div>

                  {isR && !isH && (
                    <div className="dk-reply-sent">
                      <div style={{width:28,height:28,borderRadius:'50%',background:'var(--ig-grad)',display:'grid',placeItems:'center',flex:'none'}}><Ig s={13}/></div>
                      <div style={{minWidth:0}}><div style={{fontSize:12,fontWeight:800}}>@omnichannelplus <span style={{color:'var(--text-3)',fontWeight:600}}>respondeu</span></div><div style={{fontSize:13.5,fontWeight:500,marginTop:2}}>{isR}</div></div>
                    </div>
                  )}

                  {!isH && replyOpen===c.id && (
                    <div className="dk-reply-box">
                      <textarea autoFocus rows={2} placeholder={'Responder a @'+c.user+'…'} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendReply(c.id);} }} />
                      <div className="dk-reply-actions">
                        <button className="dk-cbtn" onClick={()=>setReplyOpen(null)}>Cancelar</button>
                        <button className="dk-cbtn primary" onClick={()=>sendReply(c.id)}>{Ico.send} Publicar resposta</button>
                      </div>
                    </div>
                  )}

                  {!isH && (
                    <div className="dk-comment-actions">
                      <button className="dk-cbtn primary" onClick={()=>openReply(c.id)}>{Ico.reply} {isR?'Responder de novo':'Responder'}</button>
                      <button className="dk-cbtn" onClick={()=>{setHidden(h=>[...new Set([...h,c.id])]);toast('Comentário ocultado');}}>{Ico.eyeoff} Ocultar</button>
                      <button className="dk-cbtn danger" onClick={()=>{setDeleted(d=>[...d,c.id]);toast('Comentário excluído do Instagram');}}>{Ico.trash || Ico.x} Excluir</button>
                      <button className="dk-cbtn dm" onClick={()=>toast('Convertido em ticket no Direct')}>{Ico.dm} Chamar no Direct</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {list.length===0 && <div style={{textAlign:'center',color:'var(--text-3)',fontWeight:600,padding:'40px 0'}}>Todos os comentários foram moderados.</div>}
        </div>
      </div>
    </div>
  );
}

/* ================= PROFILE ================= */
function Profile({ toast, avail, setAvail }) {
  return (
    <div className="dk-scroll-center">
      <div className="dk-wrap narrow">
        <div className="dk-card" style={{padding:24,display:'flex',alignItems:'center',gap:18,marginBottom:18}}>
          <Avatar name="Júlia Ramos" color="#2a688f" size={64} />
          <div style={{flex:1}}><div style={{fontWeight:800,fontSize:22}}>Júlia Ramos</div><div style={{fontSize:14,color:'var(--text-2)',fontWeight:600}}>Operadora · Fila Comercial</div></div>
          <button className={'switch'+(avail?' on':'')} onClick={()=>setAvail(a=>!a)}><span className="knob"></span></button>
        </div>
        <div className="dk-grid-3" style={{marginBottom:18}}>
          {[['18','Atendimentos hoje'],['2m 14s','Tempo médio'],['96%','CSAT']].map(([v,l])=>(
            <div key={l} className="dk-card dk-stat" style={{textAlign:'center'}}><div className="dk-stat-v" style={{background:'var(--brand-grad)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>{v}</div><div className="dk-stat-l" style={{marginTop:4}}>{l}</div></div>
          ))}
        </div>
        <div className="dk-card">
          {[['Minhas filas','Comercial · Suporte'],['Notificações','Ativadas'],['Atalhos rápidos','12 salvos'],['Assinatura de mensagem','— Júlia, Omnichannel Plus']].map(([t,d],i)=>(
            <div key={t} className="dk-row" style={{borderTop:i?'1px solid var(--border)':'none'}}>
              <div className="grow"><div className="t">{t}</div><div className="d">{d}</div></div>
              <button className="dk-iconbtn" style={{width:36,height:36}} onClick={()=>toast('Abrindo '+t)}>{Ico.cog}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= APP ================= */
function OperatorDesktop() {
  const [theme, toggle] = useTheme();
  const [section, setSection] = useState('conversas');
  const [available, setAvailable] = useState(true);
  const [toastNode, showToast] = useToast();
  const toast = (m)=>showToast(m);

  let content;
  if(section==='conversas') content = <Inbox toast={toast} />;
  else if(section==='comentarios') content = <Moderation toast={toast} />;
  else if(section==='funil') content = <Kanban toast={toast} />;
  else content = <Profile toast={toast} avail={available} setAvail={setAvailable} />;

  return (
    <div style={{display:'contents'}}>
      <div className="dk-app">
        <TopBar theme={theme} toggle={toggle} available={available} setAvailable={setAvailable} />
        <div className="dk-body">
          <Rail active={section} onChange={setSection} />
          <div className="dk-content">{content}</div>
        </div>
      </div>
      <div className="dk-too-small">
        <div className="ic">{Ico.grid}</div>
        <h2>Versão desktop</h2>
        <p>Esta é a interface de desktop do Omnichannel Plus. Amplie a janela ou abra o <b>App Mobile</b> para telas menores.</p>
        <a className="btn btn-primary" href="Operator.html">Abrir versão mobile</a>
      </div>
      {toastNode && React.cloneElement(toastNode, {className:'dk-toast'})}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<OperatorDesktop />);
